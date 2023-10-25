const express = require('express');
const User = require('../SchemaModels/Student/StudentRegisterSchema');
const Employee = require('../SchemaModels/Employee/EmployeeRegisterSchema');
const UserOTPVerification = require('../SchemaModels/Student/UserOtpVerificationSchema');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const router = express.Router();

// Initialize the nodemailer transporter with your email credentials
let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.AUTH_USER,
        pass: process.env.AUTH_PASSWORD 
    },
});

// Generate an OTP for verification
const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

// Send OTP verification email
const sendOTPVerificationEmail = async (email, otp) => {
    try {
        const mailOptions = {
            from: process.env.AUTH_EMAIL, // Replace with your email address
            to: email,
            subject: 'Forgot Password - Verification OTP',
            html: `<p>Your OTP is ${otp}</p>`,
        };

        await transporter.sendMail(mailOptions);
        console.log('Verification OTP email sent');
    } catch (error) {
        console.error(error);
        throw new Error('Error sending OTP. Please try again later.');
    }
};
router.post('/forgotpassword', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Please provide an email.' });
        }
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: 'User does not exist with the provided email.' });
        }

        const otp = generateOTP();
        console.log(otp);
        const hashedOTP = await bcrypt.hash(otp, 12);

        const expirationTime = new Date(Date.now() + 10 * 60 * 1000); // Set expiration time to 10 minutes from now

        const newOTPVerification = await new UserOTPVerification({
            userId: existingUser._id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: expirationTime,
        });

        console.log(`newOTPVerification : ${newOTPVerification}`);

        await newOTPVerification.save();

        await sendOTPVerificationEmail(email, otp);

        return res.status(200).json({ message: 'Verification OTP has been sent to your email.', user: existingUser });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error sending OTP. Please try again later.' });
    }
});


router.post('/resetpassword', async (req, res) => {
    try {
        const { userId, email, otp, newPassword } = req.body;

        console.log(userId);
        console.log(email);
        console.log(otp);
        console.log(newPassword);
        if (!userId || !otp) {
            throw new Error('Empty OTP details are not allowed');
        } else {
            const userOTPVerificationRecord = await UserOTPVerification.findOne({
                userId
            });
            console.log("UserOTPVerificationRecord:", userOTPVerificationRecord);

            if (!userOTPVerificationRecord) {
                throw new Error("Account record does not exist");
            } else {
                const { expiresAt, otp: hashedOTP } = userOTPVerificationRecord;

                console.log(`Expires At : ${expiresAt}`)
                const currentUTC = new Date().getTime();
                const expiresTime = new Date(expiresAt).getTime();

                if (expiresTime < currentUTC) {
                    await UserOTPVerification.deleteOne({ userId });
                    return res.status(400).json({ message: "Code has expired. Please request again." });
                } else {
                    const validOTP = await bcrypt.compare(otp, hashedOTP);

                    if (!validOTP) {
                        return res.status(401).json({ message: 'Invalid OTP. Please enter the correct OTP.' });
                    }

                    const salt = await bcrypt.genSalt(12);
                    const hashedPassword = await bcrypt.hash(newPassword, salt);

                    await User.updateOne({ _id: userId }, { password: hashedPassword });

                    await UserOTPVerification.deleteOne({ userId });
                    return res
                        .status(200)
                        .json({ message: 'Password reset successful. You can now log in with your new password.' });
                }
            }
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error resetting password. Please try again later.' });
    }
});


router.post('/eforgotpassword', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Please provide an email.' });
        }
        const existingUser = await Employee.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: 'User does not exist with the provided email.' });
        }

        const otp = generateOTP();
        console.log(otp);
        const hashedOTP = await bcrypt.hash(otp, 12);

        const expirationTime = new Date(Date.now() + 10 * 60 * 1000); // Set expiration time to 10 minutes from now

        const newOTPVerification = await new UserOTPVerification({
            userId: existingUser._id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: expirationTime,
        });

        console.log(`newOTPVerification : ${newOTPVerification}`);

        await newOTPVerification.save();

        await sendOTPVerificationEmail(email, otp);

        return res.status(200).json({ message: 'Verification OTP has been sent to your email.', user: existingUser });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error sending OTP. Please try again later.' });
    }
});


router.post('/eresetpassword', async (req, res) => {
    try {
        const { userId, email, otp, newPassword } = req.body;

        console.log(userId);
        console.log(email);
        console.log(otp);
        console.log(newPassword);
        if (!userId || !otp) {
            throw new Error('Empty OTP details are not allowed');
        } else {
            const userOTPVerificationRecord = await UserOTPVerification.findOne({
                userId
            });
            console.log("UserOTPVerificationRecord:", userOTPVerificationRecord);

            if (!userOTPVerificationRecord) {
                throw new Error("Account record does not exist");
            } else {
                const { expiresAt, otp: hashedOTP } = userOTPVerificationRecord;

                console.log(`Expires At : ${expiresAt}`)
                const currentUTC = new Date().getTime();
                const expiresTime = new Date(expiresAt).getTime();

                if (expiresTime < currentUTC) {
                    await UserOTPVerification.deleteOne({ userId });
                    return res.status(400).json({ message: "Code has expired. Please request again." });
                } else {
                    const validOTP = await bcrypt.compare(otp, hashedOTP);

                    if (!validOTP) {
                        return res.status(401).json({ message: 'Invalid OTP. Please enter the correct OTP.' });
                    }

                    const salt = await bcrypt.genSalt(12);
                    const hashedPassword = await bcrypt.hash(newPassword, salt);

                    await Employee.updateOne({ _id: userId }, { password: hashedPassword });

                    await UserOTPVerification.deleteOne({ userId });
                    return res
                        .status(200)
                        .json({ message: 'Password reset successful. You can now log in with your new password.' });
                }
            }
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error resetting password. Please try again later.' });
    }
});

 

module.exports = router;
