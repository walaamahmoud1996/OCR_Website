/*
	* Deleting site is needed? What happens when to the users working at it TODO
	* Editing site is needed TODO
	* Getting all sites is needed TODO
*/

const mongoose = require('mongoose');

const {siteModel} = require('../models/siteModel');
const {checkAuthAdmin} = require('../middleware/check-auth')

module.exports = function(app){

	//Adding a site providing all information about the site
	app.post('/site/addsite',checkAuthAdmin,(req,res,next)=>{
		siteModel.find({site_name:req.body.site_name})
		.then(siteResult=>{
			if(siteResult.length>=1)
				return 	res.status(409).json({
					message :"Site name exists"
				});
			siteModel.find({site_location:req.body.site_location})
			.then((locResults)=>{
				if(locResults.length>=1) return res.status(409).json({
					message :"Site location exists"
				});
				const site = new siteModel({
					_id : new mongoose.Types.ObjectId(),
					site_name: req.body.site_name,
					site_location: req.body.site_location
				})
				.save()
				.then(result=>{
					res.status(200).json({
						message : 'Site Created'
					});
				})
			})
		})
		.catch(err=>{
			res.status(400).json({
				error : err
			});
		});
	});

	app.get('/sites',checkAuthAdmin,(req,res)=>{
		siteModel.find({}).then((results)=>{
			res.status(200).send(results)
		})
		.catch((err)=>{
			res.status(400).send(err);
		})
	})
}
