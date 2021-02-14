/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ChatSchema = new Schema({
	chatId: {
		type: String,
		unique: true,
		requred: true
	},
	isOpenToQuestion: {
		type: Boolean,
		default: false
	},
	from: {
		type: Object,
		defaul: null
	}
}, {
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	}
});

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = (registry) => {
	registry.Chat = Chat;
};
