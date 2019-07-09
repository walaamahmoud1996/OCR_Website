const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	_id : mongoose.Schema.Types.ObjectId,
	email:{
		type : String,
		required : true,
		unique :true,
		match : /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
	},
	password  : {type :String,required : true},
	user_type : {type : String, required : true},
	user_site : {type: String, required : true}
});

var userModel = mongoose.model('User',userSchema);
module.exports = {
	userModel
}
