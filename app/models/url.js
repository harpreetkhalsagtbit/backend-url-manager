// Load required packages
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
// Define our beer schema
var URLMetadataSchema   = new mongoose.Schema({
	userId: ObjectId,
	url: String,
	metadata: Schema.Types.Mixed,
});

// Export the Mongoose model
module.exports = mongoose.model('URLMetadata', URLMetadataSchema);