import { Request, Response } from 'express';
import { transporter } from '../config/nodemailer';

export const ContactController = {
    sendMessage: async (req: Request, res: Response) => {
        try {
            const { name, email, message } = req.body;

            if (!name || !email || !message) {
                return res.status(400).json({ message: "All fields are required (Name, Email, Message)" });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: "Invalid email format" });
            }

            const mailOptions = {
                from: `"${name}" <${email}>`, 
                to: process.env.EMAIL_USER, 
                subject: `New Portfolio Message from ${name}`, 
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                        <h2 style="color: #4F46E5; text-align: center;">New Contact Message</h2>
                        <hr style="border: 0; border-top: 1px solid #eee;" />
                        
                        <div style="padding: 15px 0;">
                            <p><strong>Name:</strong> ${name}</p>
                            <p><strong>Email:</strong> ${email}</p>
                        </div>
                        
                        <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; border-left: 4px solid #4F46E5;">
                            <p style="margin: 0; color: #374151;">${message}</p>
                        </div>

                        <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px;">
                            Sent from your Portfolio Website
                        </p>
                    </div>
                `,
            };

            await transporter.sendMail(mailOptions);

            return res.status(200).json({ message: "Message sent successfully!" });

        } catch (error: any) {
            console.error("Email Error:", error);
            return res.status(500).json({ message: "Failed to send message. Please try again later." });
        }
    }
};