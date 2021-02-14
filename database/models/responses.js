/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ResponseSchema = new Schema({
	chatId: {
		type: String,
		requred: true
	},
	message: {
        type: String
	}
}, {
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	}
});

const Response = mongoose.model('Response', ResponseSchema);

module.exports = (registry) => {
	registry.Response = Response;
};
