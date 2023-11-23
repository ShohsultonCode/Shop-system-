// email.service.ts

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        // Initialize Nodemailer transporter with your email service configuration
        this.transporter = nodemailer.createTransport({
            service: 'Gmail', // Example: Gmail
            auth: {
                user: 'shohsulton.3039@gmail.com',
                pass: 'jcvv qxrs jttz uzjz',
            },
        });
    }

    async sendCodeEmail(to: string, code: string): Promise<void> {
        // Define the email content
        const mailOptions = {
            from: 'shohsulton.3039@gmail.com',
            to: 'shohsulton.198@gmail.com',
            subject: 'Verification Code',
            text: `Your verification code is: ${code}`,
        };

        // Send the email
        await this.transporter.sendMail(mailOptions);
    }
}
