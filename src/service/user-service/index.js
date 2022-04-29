const bcrypt = require('bcrypt')
const { User, Group } = require('../../db')
const mailerTools = require('../../tools/mailer-tools');
const tokenService = require('../token-service')
const getRandomInRange = require('../../helpers/getRandomInRange')
const CandidatDto = require('../../dtos/candidat-dto')
const UserDto = require('../../dtos/user-dto');
const ApiError = require('../../errors/api-error');
const res = require('express/lib/response');
const config = require('../../config')


class UserService {
    //complete
    async registration(email, password) {
        const candidat = await User.findOne({email})

        if(candidat && candidat.isActivated === true) {
            throw ApiError.BadRequest('User with this email already exists')
        }

        const hashPassword = await bcrypt.hash(password, 7);
        const authCode = getRandomInRange(1000, 9999);

        const user = {email, authCode}
        const candidatDto = new CandidatDto(user)

        const accessToken = tokenService.generateAccessToken({...candidatDto})

        if(candidat && candidat.isActivated === false) {
           const userData = await User.findByIdAndUpdate(candidat.id, {
                email: email,
                password: hashPassword,
                token: accessToken,
            })
            await mailerTools.sendActivationMail(email, `${authCode}`)
            return userData
        } else {
            const userData = await User.create({email, password: hashPassword, token: accessToken})
            await mailerTools.sendActivationMail(email, `${authCode}`)
            return userData
        }
    }
    //complete
    async activate(validAccess, code, adminCode) {

        if(validAccess.authCode != code) {
            throw ApiError.BadRequest('Activation code entered incorrectly')
        }

        const email = validAccess.email
        const user = await User.findOne({email})

        const userDto = new UserDto(user)
        const refreshToken = tokenService.generateRefreshToken({...userDto})

        if(adminCode) {
            
            if(adminCode == config.Admin_Code) {
                const userData = await User.findByIdAndUpdate(user.id, {isActivated: true , token: refreshToken, role: "Admin"})
                userData.save()
                return userData
            } else {
                throw ApiError.BadRequest('Admin code entered incorrectly')
            }

        } else {
            const userData = await User.findByIdAndUpdate(user.id, {isActivated: true , token: refreshToken})
            userData.save()
            return userData
        }


    }
    //complete
    async login(email, password) {
        const user = await User.findOne({email})
        if(!user) {
            throw ApiError.BadRequest('User is not found')
        }
        
        const isPassEquals = await bcrypt.compare(password, user.password);
        if(!isPassEquals) {
            throw ApiError.BadRequest('Incorrect password')
        }

        const userDto = new UserDto(user);
        const refreshToken = tokenService.generateRefreshToken({...userDto})

        const userData = await User.findByIdAndUpdate(user.id, {token: refreshToken})

        return userData
    }
    //complete
    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token 
    }
    //complete
    async refresh(refreshToken) {
        if(!refreshToken) {
            throw ApiError.UnauthorizedError()
        }

        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.tokenFromDb(refreshToken)

        if(!userData || tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }
        const user = await User.findById(userData.id)
        const userDto = new UserDto(user);
        const tokens = tokenService.generateToken({...userDto})

        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto}

    }
    //complete
    async getAllUsers() {
        const users = await User.find()
        return users
    }
    //complete
    async subscriptionGroup(group, refreshToken) {

        const groupData = await Group.findById(group)

        if(!groupData) {
            throw ApiError.BadRequest(`No such group exists`)
        }
        // if(groupData.admin == refreshToken.id) {
        //     throw ApiError.BadRequest(`Вы автор данной группы`)
        // }

        if(groupData.follower.includes(refreshToken.id) == true) {
            const index = groupData.follower.indexOf(refreshToken.id)
            groupData.follower.splice(index, 1)
            await groupData.save()
            return groupData
        }

        groupData.follower.push(refreshToken.id)
        await groupData.save()
        return groupData

        
    }
     //complete
    async subscriptionUser(user, refreshToken) {
        const userData = await User.findById(user)
        const followerData = await User.findById(refreshToken.id)

        if(userData.id == followerData.id) {
            throw  ApiError.BadRequest(`You can't subscribe to yourself`)
        }

        if(followerData.userFollowing.includes(userData.id) == true) {
            const indexUserFollowing = followerData.userFollowing.indexOf(userData.id)
            const indexFollower = userData.follower.indexOf(followerData.id)

            followerData.userFollowing.splice(indexUserFollowing, 1)
            userData.follower.splice(indexFollower, 1)
            
            await userData.save()
            await followerData.save()

            return followerData
        }

        userData.follower.push(followerData.id)
        followerData.userFollowing.push(userData.id)

        await userData.save()
        await followerData.save()
        
        return followerData

    }

}

module.exports = new UserService();