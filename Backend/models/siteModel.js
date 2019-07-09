const mongoose = require('mongoose');

const siteSchema = mongoose.Schema({
	_id : mongoose.Schema.Types.ObjectId,
	site_name :{type : String , unique :true, required : true},
	site_location : {type : String, unique : true ,required : true}
});

var siteModel = mongoose.model('Site',siteSchema);
module.exports = {
	siteModel
}
