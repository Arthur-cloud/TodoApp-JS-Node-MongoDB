const {Schema, model} = require('mongoose');

const UserSchema =  new Schema(
    {
        email: {
            type: String,
            unique: true,
            required:true
    },
        password: {
            type: String,
            required:true
    },
        isActivated: {
            type: Boolean,
            default: false
    },
        token:  {
            type: String
    },
        role: {
            type: String,
            default: "User"
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
        groupFollowing: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'Group',
                },
            ],
            default: [],
    },
        userFollowing: {
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
    })

module.exports = model('User', UserSchema)