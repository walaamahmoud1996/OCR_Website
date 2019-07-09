/*
	Sending >2 files returns a 500 TODO
	Check that the 2 files we have are excel and pdf TODO
	Testing TODO
	When requesting for files we need to send the file itself not a json of its name TODO
	After doing the last todo, we need to uncomment the route that gets files for a specific user TODO
*/

const mongoose = require('mongoose');
const {ObjectID} = require('mongodb');
const multer = require('multer');
const mv = require('mv');
const lodash = require('lodash');
var base64 = require('file-base64');

const {fileModel} = require('../models/filesModel');
const {checkAuthUploader,checkAuthAdmin,checkAuthApprover} = require('../middleware/check-auth');

module.exports = function(app){

	//Adding a file given a pdf, excelsheet, upload_name
	app.post('/file/addfile',checkAuthUploader,(req,res)=>{

		fileModel.find({upload_name:req.body.upload_name})
		.then(fileResults=>{
			if(fileResults.length>=1) throw "Previous upload exists with the following name"
			const file = new fileModel({
				_id : new mongoose.Types.ObjectId(),
				upload_name : req.body.upload_name,
				pdfFile_name: req.body.pdf_name,
				excelFile_name: req.body.excel_name,
				file_status: req.body.file_status,
				file_site: req.body.file_site,
				file_uploader: req.body.file_uploader
			})
			.save()
			.then(result=>{
				var pdfFileName = req.body.upload_name+'_'+req.body.pdf_name;
				var excelFileName = req.body.upload_name+'_'+req.body.excel_name;
				base64.decode(req.body.pdf_file,pdfFileName, function(err, output) {
					if(err) throw "Error in PDF file";
					base64.decode(req.body.excel_file,excelFileName, function(err, output) {
						if(err) throw "Error in excel file";
						mv(pdfFileName, 'uploads/'+pdfFileName, function(err) {
							if(err) throw "Error in moving pdf file";
							mv(excelFileName, 'uploads/'+excelFileName, function(err) {
								if(err) throw "Error in moving excel file";
								res.status(200).json({
									message : 'File Created'
								});
							});
						});
					});
				});
			})
		})
		.catch(err=>{
			console.log(err);
			res.status(400).json({
				error : err
			});
		});
	});

	//Get files for a specificSite
	app.get('/file/fileSite/:passedId',checkAuthAdmin,(req,res)=>{
		var passedId = req.params.passedId;
		if(!ObjectID.isValid(passedId)) return res.status(400).send('ID is not valid')

		fileModel.find({file_site: passedId})
		.then(fileResults=>{
			if(fileResults.length>=1){
				result = []
				for(i = 0; i < fileResults.length; i++)
				result.push(lodash.pick(fileResults[i],['upload_name','pdfFile_name','excelFile_name','file_status']))
				return res.status(200).send(result);
			}
			else
				return res.status(404).json({
					message : 'No files in this site'
				});
		})
		.catch(err=>{
			res.status(400).json({
			error : err
			});
		});
	});

	//Get files for a specific user
	// app.get('/file/fileUser',checkAuthAdmin,(req,res)=>{
	// 	var passedId = req.params.passedId;
	// 	if(!ObjectID.isValid(passedId)) return res.status(400).send('ID is not valid')
	//
	// 	fileModel.find({file_site: passedId})
	// 	.then(fileResults=>{
	// 		if(fileResults.length>=1){
	// 			result = []
	// 			for(i = 0; i < fileResults.length; i++)
	// 			result.push(lodash.pick(fileResults[i],['upload_name','pdfFile_name','excelFile_name','file_status']))
	// 			return res.status(200).send(result);
	// 		}
	// 		else
	// 			return res.status(404).json({
	// 				message : 'No files in this site'
	// 			});
	// 	})
	// 	.catch(err=>{
	// 		res.status(400).json({
	// 		error : err
	// 		});
	// 	});
	// });
	// app.get('/file/fileName/:name',checkAuthUploader,(req,res)=>{
	// 	var nameRegex = new RegExp(req.params.name);
	// 	fileModel.find({file_name: {$regex: nameRegex}})
	// 	.exec()
	// 	.then(file=>{
	// 		if(file.length>=1){
	// 			return res.status(302).json(file);
	// 		}else{
	// 			return res.status(404).json({
	// 				message : 'No files with this name'
	// 			});
	// 		}
	// 	})
	// 	.catch(err=>{
	// 		res.status(400).json({
	// 			error : err
	// 		});
	// 	 });
	// });

	//Frontend debug route
	app.get('/files',(req,res)=>{
		fileModel.find({}).then((results)=>{
			res.status(200).send(results)
		})
		.catch((err)=>{
			res.status(400).send(err);
		})
	})

	//Get list of files of an approver given his Id
	app.get('/files/approver/files',checkAuthApprover,(req,res)=>{

		fileModel.find({file_site: req.body.file_site})
		.then(fileResults=>{
			if(fileResults.length>=1){
				result = []
				for(i = 0; i < fileResults.length; i++)
					result.push(lodash.pick(fileResults[i],['upload_name','pdfFile_name','excelFile_name','file_status']))
				return res.status(200).send(result);
			}
			else
				return res.status(404).json({
					message : 'No files in this site'
				});
		})
		.catch(err=>{
			res.status(400).json({
			error : err
			});
		});
	})

	//Download a file given its upload name and file name
	app.get('/files/approver/file/:uploadName/:fileName',checkAuthApprover,(req,res)=>{
		var passedUploadName = req.params.uploadName;
		var passedFileName = req.params.fileName;

		//Check if user is in the same site as the file
		fileModel.find({upload_name:passedUploadName})
		.then((results)=>{
			if(results.length < 1) throw "No upload name with such name"
			if(JSON.stringify(results[0].file_site) !== JSON.stringify(req.body.file_site)) throw "You aren't in the same site as the needed document!"
			if(results[0].pdfFile_name !== passedFileName && results[0].excelFile_name !== passedFileName) return res.status(404).send()
			//console.log(require('path').dirname(require.main.filename)+'/uploads/amr.txt');
			res.status(200).sendFile(require('path').dirname(require.main.filename)+'/uploads/'+passedUploadName+'_'+passedFileName)
		})
		.catch((err)=>{
			res.status(400).send(err);
		})
	})

	app.patch('/files/approver/verify/file/:uploadName',checkAuthApprover,(req,res)=>{
		var passedUploadName = req.params.uploadName;
		fileModel.findOneAndUpdate(({upload_name:passedUploadName}),{$set:{file_status: req.body.newStatus}})
	  .then((todo)=> {
	    if(!todo) return res.status(404).send();
	    res.status(200).send();
	  })
	  .catch((err)=>{
	    res.status(400).send();
	  })
})

}
