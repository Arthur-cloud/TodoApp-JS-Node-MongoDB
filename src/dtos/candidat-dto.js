module.exports = class  UserDto {
    email;
    authCode;

    constructor(model) {
        this.email = model.email
        this.authCode = model.authCode
    }
}