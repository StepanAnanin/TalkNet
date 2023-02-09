import nodemailer from "nodemailer";
import config from "../config";

class EMailService {
    protected transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: config.SMTP.HOST_NAME,
            port: config.SMTP.PORT,
            secure: false,
            auth: {
                user: config.SMTP.USER_NAME,
                pass: config.SMTP.PASSWORD,
            },
        });
    }

    public async sendActivationEMail(emailAddress: string, activationLink: string) {
        await this.transporter.sendMail({
            from: config.SMTP.USER_NAME,
            to: emailAddress,
            subject: "Активация аккаунта TalkNet",
            html: `
                <div>
                    <h1>Для активации аккаунта перейдите по ссылке</h1>
                    <a href="${activationLink}">${activationLink}</a>
                    <p>Если вы не создавали аккаунт на нашем сервисе, просто проигнорируйте это письмо.</p>
                </div>
            `,
        });
    }
}

export default new EMailService();
