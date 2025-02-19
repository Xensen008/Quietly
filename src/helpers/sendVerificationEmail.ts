import { resend } from '../lib/resend';
import VerificationEmail from '../../emails/verificationEmails';
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(email: string,
    username: string,
    verifyCode: string,
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Quietly <no-reply@arnabjk008.tech>',
            to: email,
            subject: 'Quietly Verification code',
            react: VerificationEmail({
                username: username,
                otp: verifyCode,
            })
        });
        return {
            success: true, 
            message: "Verification email sent successfully"
        }
    }
    catch (emailError) {
        console.error("Error sending verification email", emailError)
        return {
            success: false,
            message: "Failed to send verification error"
        }
    }
}