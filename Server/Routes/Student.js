const express = require("express");
const router = express.Router();
const UserOTPVerification = require('../SchemaModels/Student/UserOtpVerificationSchema');
const Student = require('../SchemaModels/Student/StudentRegisterSchema');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const studentProfile = require("../SchemaModels/Student/CreateStudentProfile");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

let transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.AUTH_USER,
    pass: process.env.AUTH_PASSWORD
  }
});


// Middleware
const authenticateUser = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new Error();
    }
    const token = authorizationHeader.split(' ')[1];



    const decoded = jwt.verify(token, process.env.SECRETE_KEY);
    const user = await Student.findOne({ _id: decoded._id, 'tokens.token': token });
    if (!user) {
      throw new Error();

    }
    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Authentication failed' });
  }
};


const restrictToOwnProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const profile = await studentProfile.findOne({ user: userId });
    if (!profile) {
      throw new Error();
      console.log("No profile found")
    }
    req.profile = profile;
    next();
  } catch (err) {
    res.status(403).json({ success: false, message: 'Access denied' });
  }
};

router.post('/register', async (req, res) => {
  const { name, email, phone, usn, password } = req.body;
  let secpassword = await bcrypt.hash(password, 12);

  try {
    const existingUser = await Student.findOne({ email });

    if (existingUser) {
      if (existingUser.verified) {
        return res.status(200).json({ message: "User Already Exist" });
      } else {
        SendOTPVerificationEmail(existingUser);
        return res.status(202).json({ message: "Verification OTP email sent", userId: existingUser._id });

      }
    } else {
      const newStudent = new Student({ name, email, phone, usn, password: secpassword, verified: false });
      const savedStudent = await newStudent.save();
      SendOTPVerificationEmail(savedStudent,);
      return res.status(202).json({ message: "Verification OTP email sent", userId: savedStudent._id });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
});

router.post('/verifyotp', async (req, res) => {
  try {
    let { id: userId, otp, name, email, phone, usn } = req.body;
    console.log(userId, otp, name, email, phone, usn)
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
        console.log("hashedOTP:", hashedOTP);

        if (expiresAt < Date.now()) {
          await UserOTPVerification.deleteOne({ userId });
          return res.status(400).json({ message: "Code has expired. Please request again." });
        } else {
          const validOTP = await bcrypt.compare(otp, hashedOTP);
          console.log("validOTP:", validOTP);

          if (!validOTP) {
            res.status(401).json({ message: "Invalid code passed. Check your inbox." });
          } else {
            await Student.updateOne({ _id: userId }, { verified: true, name, email, phone, usn });
            await UserOTPVerification.deleteOne({ userId });
            res.status(200).json({
              status: "VERIFIED",
              message: "User email verified successfully."
            });
          }
        }
      }
    }
  } catch (err) {
    console.log(err);
    res.json({
      status: "FAILED",
      message: err.message
    });
  }
});

router.post('/resendotp', async (req, res) => {
  try {
    let { id: userId, email } = req.body;
    if (!userId || !email) {
      throw Error("Empty user datails are not allowed")
    } else {
      await UserOTPVerification.deleteMany({ userId });
      SendOTPVerificationEmail({ _id: userId, email }, res);
      res.status(200).json({ message: 'Email sent successfully' })
    }
  } catch (Err) {
    console.log(Err)
    res.json({
      status: "FAILED",
      message: Err.message
    });
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Student.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: 'User Does not exist' })
    }
    else {
      const pwd = await bcrypt.compare(password, user.password)
      if (!pwd) {
        return res.status(400).json("Invalid Credential")
      }
      else {
        const authtoken = await user.generateAuthToken();
        const userid = user._id;
        return res.status(200).json({ success: true, authtoken, userid })
      }
    }
  }
  catch (err) {
    console.log(err)
    res.status(400).json({ success: false })
  }
})

// Student Profile
router.post('/createprofile', authenticateUser, async (req, res) => {
  const { name, email, phone, address, dob, usn, branch, sem, cgpa, skills, hobbies, languagesknown, projects, profileimg, resume } = req.body;
  try {
    const userId = req.user._id;

    const existingProfile = await studentProfile.findOne({ user: userId });

    if (existingProfile) {
      existingProfile.name = name;
      existingProfile.email = email;
      existingProfile.phone = phone;
      existingProfile.address = address;
      existingProfile.dob = dob;
      existingProfile.usn = usn;
      existingProfile.branch = branch;
      existingProfile.sem = sem;
      existingProfile.cgpa = cgpa;
      existingProfile.skills = skills;
      existingProfile.hobbies = hobbies;
      existingProfile.languagesknown = languagesknown;
      existingProfile.projects = projects;
      if (profileimg !== '') {
        existingProfile.profileimg = profileimg;
      }
      if (resume !== undefined) {
        existingProfile.resume = resume;
      }

      await existingProfile.save();
    } else {
      const profile = new studentProfile({
        name,
        email,
        phone,
        address,
        dob,
        usn,
        branch,
        sem,
        cgpa,
        skills,
        hobbies,
        languagesknown,
        projects,
        profileimg,
        resume,
        user: userId,
      });

      await profile.save();
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ success: false });
  }
});


router.get('/profile', authenticateUser, restrictToOwnProfile, (req, res) => {
  res.status(200).json({ success: true, profile: req.profile });
});

router.put('/updateprofile', authenticateUser, async (req, res) => {
  try {
    const { name, email, phone, address, dob, usn, branch, sem, cgpa, skills, hobbies, languagesknown, projects, profileimg } = req.body;

    const profile = await StudentProfile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    profile.name = name;
    profile.email = email;
    profile.phone = phone;
    profile.address = address;
    profile.dob = dob;
    profile.usn = usn;
    profile.branch = branch;
    profile.sem = sem;
    profile.cgpa = cgpa;
    profile.skills = skills;
    profile.hobbies = hobbies;
    profile.languagesknown = languagesknown;
    profile.projects = projects;
    if (profileimg !== undefined) {
      profile.profileimg = profileimg;
    }

    await profile.save();

    res.status(200).json({ success: true, message: 'Profile updated successfully' });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: 'Failed to update profile' });
  }
});

router.put('/changepassword', authenticateUser, async (req, res) => {
  const { originalPassword, newPassword, confirmPassword } = req.body;
  try {
    const profile = await Student.findOne({ email: req.body.email });

    if (!profile) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    // Check if the original password is correct
    const isPasswordCorrect = await bcrypt.compare(originalPassword, profile.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid existing password' });
    }

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New password and confirm password do not match' });
    }

    // Hash and update the password
    const newHashedPassword = await bcrypt.hash(newPassword, 12);
    profile.password = newHashedPassword;
    await profile.save();

    return res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: 'Failed to update password' });
  }
});

router.delete('/deleteotp/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find and delete the OTP entry associated with the user ID
    await UserOTPVerification.deleteOne({ userId });

    // Respond with a success message
    res.status(200).json({ success: true, message: 'OTP entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting OTP entry:', error);
    res.status(500).json({ success: false, message: 'Failed to delete OTP entry' });
  }
});

// Add a new route for fetching user ID by email
router.get('/getUserIdByEmail', async (req, res) => {
  try {
    const { email } = req.query;

    // Query your database to find the user ID by email
    const user = await Student.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user ID
    res.status(200).json({ userId: user._id });
  } catch (error) {
    console.error('Error fetching user ID by email:', error);
    res.status(500).json({ message: 'Failed to fetch user ID' });
  }
});

const SendOTPVerificationEmail = ({ _id, email }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
      const hashedOTP = await bcrypt.hash(otp, 12);

      const newOTPVerification = await new UserOTPVerification({
        userId: _id,
        otp: hashedOTP,
        createdAt: Date.now(),
        expiresAt: Date.now() + 10 * 60 * 1000,
      });

      await newOTPVerification.save();

      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Verify Your Email",
        html: `<p> Your OTP is ${otp} </p>`,
      };

      await transporter.sendMail(mailOptions);

      console.log("Verification OTP email sent");
      resolve();
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};


module.exports = router;




