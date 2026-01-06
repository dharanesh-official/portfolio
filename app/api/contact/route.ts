import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import dbConnect from '@/lib/db';
import { Contact } from '@/lib/models';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { firstName, lastName, email, message } = body;

        // Validate key fields
        if (!firstName || !lastName || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // 1. Save to Database (Backup in case email fails)
        try {
            await dbConnect();
            await Contact.create({ firstName, lastName, email, message });
        } catch (dbError) {
            console.error('Failed to save contact to database:', dbError);
            // Continue to send email even if DB fails
        }

        // 2. Configure Email Transporter
        // NOTE: For Gmail, you need to use an App Password if 2FA is enabled.
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER, // Verify that your provider allows this 'from'
            to: process.env.EMAIL_USER,   // You want to receive the email
            replyTo: email,               // So you can hit reply and email the user back
            subject: `Portfolio Contact: ${firstName} ${lastName}`,
            text: `
You have a new contact form submission:

Name: ${firstName} ${lastName}
Email: ${email}
Message:
${message}
            `,
            html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${firstName} ${lastName}</p>
<p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
<hr />
<h3>Message:</h3>
<p>${message.replace(/\n/g, '<br />')}</p>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { error: 'Failed to send email. Please check server logs.' },
            { status: 500 }
        );
    }
}
