/*
	Few notes to remember regarding the user functionality:
	*You can't sign up because you need the admin to add you a specific site
	*Logging out doesn't need any functionality, just lose the token you have and forward him to the login screen
	*Will admins change the site of a user or his type? TODO
	*The logic done in deleting/updating a user is kinda repetitive TODO
	*Don't forget to remove the testing function TODO
	*Testing is needed here TODO
	*What will happen to the files a user have when he is deleted TODO
	*Adding uploaders and approves takes any kind of password
*/

const mongoose = require('mongoose');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const lodash = require('lodash');

const {userModel} = require('../models/userModel');
const {siteModel} = require('../models/siteModel')

const {checkAuthAdmin} = require('../middleware/check-auth')

module.exports = function(app){

	//Front end testing function
	app.get('/users',(req,res)=>{
		userModel.find({}).then((results)=>{
			res.status(200).send(results)
		})
		.catch((err)=>{
			res.status(400).send(err);
		})
	})
	//To get a user of a specific site given the siteId
	app.get('/users/:passedId',checkAuthAdmin,(req,res)=>{
		var passedId = req.params.passedId;
		if(!ObjectID.isValid(passedId)) return res.status(400).send('ID is not valid')

		siteModel.findById(passedId).then((result)=>{
			if(!result) return res.status(404).json({
				message: "No site Id with the passed id"
			})
			userModel.find({user_site:passedId}).then((doc)=>{
				if(!doc) return res.status(404).send('no site found with such id');
				result = []
				for(i = 0; i < doc.length; i++)
				result.push(lodash.pick(doc[i],['email','user_type']))

				return res.status(200).send(result);
			}).catch((e)=>{
				return res.status(400).send('Error occured when trying to fetch');
			})
		})
	})

 //To allow the admin to add approver/uploader to any site given the whole user structure
	app.post('/user/adduser',checkAuthAdmin,(req,res)=>{
		userModel.find({email:req.body.email})
		.then((user)=>{
			if(user.length>=1)
				throw "Mail exists"
			if(req.body.user_type !== 'approver' && req.body.user_type !== 'uploader')
				throw "Unknown user type"
			if(!ObjectID.isValid(req.body.user_site))
					throw "Site ID is not valid"

			bcrypt.hash(req.body.password,10,(err,hash)=>{
					if(err) throw err;
					return siteModel.findById(req.body.user_site)
					.then((result)=>{
						if(!result) throw 'No site with this id'
						const userDoc = new userModel({
							_id : new mongoose.Types.ObjectId(),
							email: req.body.email,
							password: hash,
							user_type: req.body.user_type,
							user_site: req.body.user_site
						})
						userDoc.save().then(result=>{
							res.status(200).json({
								message : 'User Created'
							});
						})
					})
					.catch((e)=>res.status(400).json({
						message: e
					}))
				});
		})
		.catch((e)=>res.status(400).json({
			message: e
		}))
	});

	//to allow anyone to sign in given his email and unhashed password
	app.post('/user/login',(req,res)=>{
		userModel.find({email: req.body.email})
		.then(user=>{
			if(user.length<1)
				return res.status(404).json({
					message : 'No user was found with such email'
				});
			bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
				if(err)
					return res.status(400).json({
					message : 'Error in comparing passwords'
					});

				if(result){
					const token = jwt.sign({
						email : user[0].email,
						userId : user[0]._id,
						user_type : user[0].user_type,
						user_site :user[0].user_site
					},
					process.env.JWT_KEY,
					{
						expiresIn:"10h"
					});
					return res.status(200).json({
						message : 'Auth successful',
						token : token,
						user_type:user[0].user_type
					});
				}else return res.status(404).json({
				message : 'Non-matching passwords'
				});
			});
		})
		.catch(err=>{
			res.status(400).json({
			error : err
			});
		});
	});

	//TODO figure out why findByIdAndDelete isn't working
	app.delete('/user/deleteuser/:passedId',checkAuthAdmin,(req,res)=>{

		var passedId = req.params.passedId;
		if(!ObjectID.isValid(passedId)) return res.status(400).send('ID is not valid')
		userModel.findById(passedId)
		.then((result)=>{
			if(!result) throw "No user found with this ID"
			userModel.deleteOne({ _id : passedId})
			.then(result=>{
				res.status(200).json({
					message : "User deleted"
				})
			})
		})
		.catch(err=>{
			res.status(400).json({
				error : err
			});
		});
	});

	//allow the user to change his email or password, given the new email and password
	app.patch('/user/updateuser/:passedId',(req,res)=>{
		var passedId = req.params.passedId;
		if(!ObjectID.isValid(passedId)) return res.status(400).send('ID is not valid')

		var body = lodash.pick(req.body,['email','password'])
		bcrypt.hash(body.password,10,(err,hash)=>{
			if(err) throw err;

			body.password = hash;
			userModel.findByIdAndUpdate(passedId,{$set: body},{new: true})
			.then((result)=>{
				if(!result) return res.status(404).json({
					message: "No user found with this Id"
				})
				res.status(200).send()
			})
			.catch((err)=>res.status(400).json({
				message:err
			}))
		})
	})

	//random route just for testing now
	app.get('/testfun/:passedId',(req,res)=>{

		var passedId = req.params.passedId
		var body = lodash.pick(req.body,['email','password'])
		userModel.findByIdAndUpdate(passedId,{$set: body},{new: true})
		.then((result)=>{
			if(!result) throw res.status(404).json({
				message: "No user with such Id"
			})
			res.status(200).send(result)
		})
		.catch((err)=>{
			res.status(400).send()
		})
	})
}
