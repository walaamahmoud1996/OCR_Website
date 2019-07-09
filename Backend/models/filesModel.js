const mongoose = require('mongoose');

const filesSchema = mongoose.Schema({

	_id : mongoose.Schema.Types.ObjectId,
	upload_name :{type : String , required : true, unique: true},
	pdfFile_name :{type : String , required : true},
	excelFile_name :{type : String , required : true},
	file_status : {type : String,required : true},
	file_site : {type: mongoose.Schema.Types.ObjectId, ref: 'Site',required : true},
	file_uploader : {type: mongoose.Schema.Types.ObjectId, ref: 'User',required : true}
});

var fileModel = mongoose.model('File',filesSchema)
module.exports = {
	fileModel
}
