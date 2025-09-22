import { devConfig } from "../../config/env/dev.config";
import { ISendEmailOptions } from "../commen/interface";
import nodemailer, { Transporter } from "nodemailer";


export async function sendEmail({ to, subject, html }: ISendEmailOptions): Promise<void> {
    const transport: Transporter = nodemailer.createTransport({

        service: devConfig.EMAIL_SERVICE,
        port: Number(devConfig.EMAIL_PORT) || 465,
        secure: true,
        auth: {
            user: devConfig.USER_EMAIL,
            pass: devConfig.PASSWORD_EMAIL,
        },
    });

    await transport.sendMail({
        from: `'Social Media' <${devConfig.USER_EMAIL}>`,
        to,
        subject,
        html,
    });
}