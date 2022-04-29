const nodemailer = require('nodemailer')
const config = require('../../config')

class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: config.SMTP_HOST,
            port: config.SMTP_PORT,
            secure: false,
            auth: {
                user: config.SMTP_USER,
                pass: config.SMTP_PASSWORD
            }
        })
    }

    async sendActivationMail(to, code) {
        await this.transporter.sendMail({
            from: config.SMTP_USER,
            to,
            subject: 'Account activation for ' + config.API_URL,
            text: `${code}`
        })
    }
}

module.exports = new MailService()