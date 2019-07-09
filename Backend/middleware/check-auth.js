/*
	We need to make the 3 functions only one and pass arguments to it TODO
*/

const jwt = require('jsonwebtoken');
const {userModel} = require('../models/userModel');

var checkAuthAdmin = (req,res,next)=>{
	try{
		const decoded = jwt.verify(req.headers.token,process.env.JWT_KEY);
		req.userData = decoded;
		userModel.find({email:decoded.email})
		.then((user)=>{
			if(user.length >= 1){
				if(user[0].user_type == 'admin'){
					next();
				}
				else{
					return res.status(401).json({
						message : 'You are not an admin'
					})
				}
			}
		})
		.catch(err=>{
			res.status(400).json({
			error : err
			});
		});
	}
	catch(err){
		return res.status(401).json({
			message :'Auth Failed',
			error : err
		})
	}
}

var checkAuthUploader = (req,res,next)=>{
	try{
		const decoded = jwt.verify(req.headers.token,process.env.JWT_KEY);
		req.userData = decoded;
		userModel.find({email : decoded.email})
		.then(user=>{
			if(user.length >= 1){

				if(user[0].user_type == 'uploader'){
					req.body.file_status = "Pending";
					req.body.file_uploader = user[0]._id;
					req.body.file_site = user[0].user_site;
					next();
					}else
						return res.status(401).json({
							message : 'You are not Authorized to upload file'
						});
				}
				else{
					return res.status(401).json({
							message : "You are not uploader in this site"
					});
				}
		})
	// .catch(err=>{
	// 	res.status(400).json({
	// 	error : err
	// 	});
	//
	// });
	}catch(err){
		return res.status(401).json({
			message :'Auth Failed',
			error : err
		})
	}
}
var checkAuthApprover = (req,res,next)=>{
	try{
		const decoded = jwt.verify(req.headers.token,process.env.JWT_KEY);
		req.userData = decoded;
		userModel.find({email : decoded.email})
		.then(user=>{
		if(user.length >= 1){
			if(user[0].user_type == 'approver'){
				req.body.file_approver = user[0]._id;
				req.body.file_site = user[0].user_site;
				next();
				}else{
					return res.status(401).json({
						message : 'You are not Authorized to approve files'
					});
				}
		}
		else throw "No users with this Id"
	})
}catch(err){
		return res.status(401).json({
			message :'Auth Failed',
			error : err
		})
	}
}

module.exports = {
	checkAuthAdmin,
	checkAuthUploader,
	checkAuthApprover
};
