const {Schema, model} = require('mongoose');

const GroupSchema = Schema(
	{
		name: {
			type: String,
			required: true,
		},
		admin: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		follower: {
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: 'User',
				},
			],
			default: [],
		},
		staff: {
			type: [],
		},
		restricted: {
			type: []
		}
	},
	{
		timestamps: true,
	},
);

module.exports = model('Group', GroupSchema)