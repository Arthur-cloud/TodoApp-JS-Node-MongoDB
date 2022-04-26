const { Schema, model } = require('mongoose');

const PostSchema = Schema(
	{
		author: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		group: {
			type: Schema.Types.ObjectId,
			ref: 'Group',
			required: false,
		},
		comment:  {
			type: [],
		},
		like: {
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: 'User',
				},
			],
			default: [],
		},
		dislike: {
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: 'User',
				},
			],
			default: [],
		},
	},
	{
		timestamps: true,
	},
);

module.exports = model('Post', PostSchema);
