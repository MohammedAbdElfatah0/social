import { ISendEmailOptions } from "../commen/interface";
import nodemailer, { Transporter } from "nodemailer";


export async function sendEmail({ to, subject, html }: ISendEmailOptions): Promise<void> {
    const transport: Transporter = nodemailer.createTransport({
    
        service: process.env.EMAIL_SERVICE, 
        port: Number(process.env.EMAIL_PORT) || 465, 
        secure: true, 
        auth: {
            user: process.env.USER_EMAIL, 
            pass: process.env.PASSWORD_EMAIL, 
        },
    });

    await transport.sendMail({
        from: `'Social Media' <${process.env.USER_EMAIL}>`, 
        to,
        subject,
        html,
    });
}