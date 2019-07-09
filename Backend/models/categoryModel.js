const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
	_id : mongoose.Schema.Types.ObjectId,
	category_name :{type : String , unique :true, required : true}

});

var categoryModel = mongoose.model('Category',categorySchema);
module.exports = {
	categoryModel
}
