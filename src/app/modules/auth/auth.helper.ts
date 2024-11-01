const OTPEmailTemplate = ({
  userName,
  otp,
}: {
  userName: string;
  otp: string;
}) => `
<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; padding-bottom: 20px;">
            <h2 style="margin: 0; font-size: 24px; color: #333;">Verify Your Email for WeeURL</h2>
        </div>
        <p style="font-size: 16px; color: #333;">Hi ${userName},</p>
        <p style="font-size: 16px; color: #333;">
            Please verify your email address by entering the following One-Time Password (OTP):
        </p>
        <p style="font-size: 20px; color: #007bff; font-weight: bold; text-align: center;">${otp}</p>
        <p style="font-size: 16px; color: #333;">
            This code is valid for the next 10 minutes. If you didn't request this, please ignore this email.
        </p>
        <p style="font-size: 16px; color: #333;">
            Once verified, you'll be able to enjoy the full features of our URL shortening service.
        </p>
        <p style="font-size: 16px; color: #333;">Thank you,<br>The WeeURL Team</p>
    </div>
</div>
`;

export const AuthHelper = {
  OTPEmailTemplate,
};
