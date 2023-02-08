import nodemailer from "nodemailer";
import config from "../config";

class EMailService {
    // private transporter: nodemailer.Transporter;
    // constructor() {
    //     this.transporter = nodemailer.createTransport({
    //         host: config.SMTP_HOST_NAME,
    //         port: config.SMTP_PORT,
    //         secure: false,
    //         auth: {
    //             user: config.SMTP_USER_NAME,
    //             pass: config.SMTP_USER_PASSWORD,
    //         },
    //     });
    // }
    // public async sendActivationEMail(emailAddress: string, activationLink: string) {
    //     await this.transporter.sendMail({
    //         from: config.SMTP_USER_NAME,
    //         to: emailAddress,
    //         subject: "Активация аккаунта HomeCloud",
    //         html: `
    //             <div>
    //                 <h1>Для активации аккаунта перейдите по ссылке</h1>
    //                 <a href="${activationLink}">${activationLink}</a>
    //                 <p>Если вы не создавали аккаунт на нашем сервисе, просто проигнорируйте это письмо.</p>
    //             </div>
    //         `,
    //     });
    // }
    // public async sendEMailChangeEMail(emailAddress: string, emailChangeCode: number) {
    //     await this.transporter.sendMail({
    //         from: config.SMTP_USER_NAME,
    //         to: emailAddress,
    //         subject: "HomeCloud Смена адреса электронной почты",
    //         html: `
    //             <div>
    //                 <h1>
    //                     Для смены адреса электронной почты введите код, указанный внизу на специальной странице.
    //                 </h1>
    //                 <h3>
    //                     Данный код необходимо ввести на странице настроек, в разделе Безопасность.
    //                 </h3>
    //                 <h2>
    //                     ${emailChangeCode}
    //                 </h2>
    //                 <p>
    //                     Если вы не пытались сменить адрес электронной почты, то рекомендуем немеделенно обновить пароль на нашем сервисе.
    //                 </p>
    //             </div>
    //         `,
    //     });
    // }
}

export default new EMailService();
