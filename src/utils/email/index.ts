import { ISendEmailOptions } from "../commen/interface";
import nodemailer, { Transporter } from "nodemailer";


export async function sendEmail({ to, subject, html }: ISendEmailOptions): Promise<void> {
    const transport: Transporter = nodemailer.createTransport({
        // host: process.env.EMAIL_HOST, // لو هتستخدم host
        service: process.env.EMAIL_SERVICE, // لو هتستخدم service زي "gmail"
        port: Number(process.env.EMAIL_PORT) || 465, // default Gmail SSL
        secure: true, // لازم true مع 465
        auth: {
            user: process.env.USER_EMAIL, // email بتاعك
            pass: process.env.PASSWORD_EMAIL, // الباسورد أو app password
        },
    });

    await transport.sendMail({
        from: `'Social Media' <${process.env.USER_EMAIL}>`, // الأفضل تخليها من الـ env
        to,
        subject,
        html,
    });
}