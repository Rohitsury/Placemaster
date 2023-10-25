
const express = require("express");
const router = express.Router();
const UserOTPVerification = require('../SchemaModels/Student/UserOtpVerificationSchema');
const Employee = require('../SchemaModels/Employee/EmployeeRegisterSchema');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose");

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

    console.log(token);

    const decoded = jwt.verify(token, process.env.SECRETE_KEY);
    const user = await Student.findOne({ _id: decoded._id, 'tokens.token': token });
    if (!user) {
      throw new Error();
      console.log('err')
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
  const { name, email, phone, password } = req.body;
  let secpassword = await bcrypt.hash(password, 12);

  try {
    const existingUser = await Employee.findOne({ email });

    if (existingUser) {
      if (existingUser.verified) {
        return res.status(200).json({ message: "User Already Exist" });
      } else {
        SendOTPVerificationEmail(existingUser);
        return res.status(202).json({ message: "Verification OTP email sent", userId: existingUser._id });

      }
    } else {
      const newEmp = new Employee({ name, email, phone, password: secpassword, verified: false });
      const savedEmp = await newEmp.save();
      SendOTPVerificationEmail(savedEmp,);
      return res.status(202).json({ message: "Verification OTP email sent", userId: savedEmp._id });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
});

router.post('/verifyotp', async (req, res) => {
  try {
    let { id: userId, otp, name, email, phone, password } = req.body;
    console.log(userId, otp, name, email, phone, password)
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
            await Student.updateOne({ _id: userId }, { verified: true, name, email, phone, password });
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
    const user = await Employee.findOne({ email });
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
// router.post('/createprofile', authenticateUser, async (req, res) => {
//   const { name, email, phone, address, dob, usn, branch, sem, cgpa, skills, hobbies, languagesknown, projects, profileimg, resume } = req.body;
//   console.log(req.body)

//   try {
//     const userId = req.user._id;
//     console.log(userId)

//     const existingProfile = await studentProfile.findOne({ user: userId });

//     if (existingProfile) {
//       existingProfile.name = name;
//       existingProfile.email = email;
//       existingProfile.phone = phone;
//       existingProfile.address = address;
//       existingProfile.dob = dob;
//       existingProfile.usn = usn;
//       existingProfile.branch = branch;
//       existingProfile.sem = sem;
//       existingProfile.cgpa = cgpa;
//       existingProfile.skills = skills;
//       existingProfile.hobbies = hobbies;
//       existingProfile.languagesknown = languagesknown;
//       existingProfile.projects = projects;
//       existingProfile.profileimg = profileimg;
//       existingProfile.resume = resume;

//       await existingProfile.save();
//     } else {
//       const profile = new studentProfile({
//         name,
//         email,
//         phone,
//         address,
//         dob,
//         usn,
//         branch,
//         sem,
//         cgpa,
//         skills,
//         hobbies,
//         languagesknown,
//         projects,
//         profileimg,
//         resume,
//         user: userId, 
//       });

//       await profile.save();
//     }

//     return res.status(200).json({ success: true });
//   } catch (err) {
//     console.log(err);
//     return res.status(400).json({ success: false });
//   }
// });


router.get('/studentData', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).send("Database connection not ready");
    }
    let collection = await mongoose.connection.db.collection("student_profiles");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
  } catch (err) {
    console.log(err)
  }
})

// router.put('/updateprofile', authenticateUser, async (req, res) => {
//   try {
//     const { name, email, phone, address, dob, usn, branch, sem, cgpa, skills, hobbies, languagesknown, projects, profileimg } = req.body;

//     const profile = await StudentProfile.findOne({ userId: req.user._id });

//     if (!profile) {
//       return res.status(404).json({ message: 'Student profile not found' });
//     }

//     profile.name = name;
//     profile.email = email;
//     profile.phone = phone;
//     profile.address = address;
//     profile.dob = dob;
//     profile.usn = usn;
//     profile.branch = branch;
//     profile.sem = sem;
//     profile.cgpa = cgpa;
//     profile.skills = skills;
//     profile.hobbies = hobbies;
//     profile.languagesknown = languagesknown;
//     profile.projects = projects;
//     profile.profileimg = profileimg;

//     await profile.save();

//     res.status(200).json({ success: true, message: 'Profile updated successfully' });
//   } catch (err) {
//     console.log(err);
//     res.status(400).json({ success: false, message: 'Failed to update profile' });
//   }
// });

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




