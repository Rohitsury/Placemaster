const express = require('express')
const router = express.Router()
const admin = require('../SchemaModels/Admin/RegisterSchema')
const drive = require('../SchemaModels/Admin/DriveSchema')
const Video = require('../SchemaModels/Admin/UploadVideoSchema')
const placedstudent = require('../SchemaModels/Admin/PlacedStudentSchema')
const bcrypt = require('bcrypt')
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken")
const authenticate = require('../middleware/authenticate')
const nodemailer = require('nodemailer');
const adminfire = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

adminfire.initializeApp({
    credential: adminfire.credential.cert(serviceAccount),
    storageBucket: 'placemaster-50e4b.appspot.com'
});

const bucket = adminfire.storage().bucket();

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

router.post('/register', async (req, res) => {
    const { userid, password } = req.body;
    let secpassword = await bcrypt.hash(password, 12);
    try {
        const newadmin = new admin({ userid, password: secpassword })
        const usr = await newadmin.save();
        return res.status(200).json({ success: true })

    } catch (err) {
        console.log(err)
        res.status(400).json({ success: false })
    }

})

router.post('/login', async (req, res) => {
    let userid = req.body.userid;
    try {

        let adminData = await admin.findOne({ userid })

        if (!adminData) {
            return res.status(400).json("Invalid data")
        }

        else {
            const pwd = await bcrypt.compare(req.body.password, adminData.password)

            if (!pwd) {
                return res.status(400).json("Invalid Credential")
            }
            else {
                const authtoken = await adminData.generateAuthToken();
                return res.status(200).json({ success: true, authtoken })
            }

        }
    } catch (err) {
        console.log(err)
        res.status(404).json({ success: false })
    }
})

router.get('/checktoken', async (req, res) => {
    try {
        const token = req.cookies.jwttoken
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: Missing token' });
        }
        const verifytoken = jwt.verify(token, process.env.SECRETE_KEY)
        const usr = await admin.findOne({ _id: verifytoken._id, "tokens.token": token })
        res.send(usr)
    } catch (err) {
        console.log9err
    }
})

router.patch('/forgotpassword/:userid', async (req, res) => {
    const userid = req.params.userid
    let k = req.body.key
    console.log(k)
    console.log(userid)
    try {
        const query = { userid: new Object(userid) }

        let key = "hello";
        if (key === k) {
            const updates = {
                $set: {
                    password: await bcrypt.hash(req.body.password, 12)
                }
            };
            const data = await admin.findOne({ userid });
            if (!data) {
                return res.status(404).json("user Does not exist");
            }
            else {
                const result = await admin.updateOne(query, updates);
                return res.status(200).json({ success: true });
            }
        } else {
            return res.status(400).json("Invalid");

        }
    } catch (err) {
        console.log(err);
        res.status(404).json({ success: false });
    }
});

router.post('/createdrive', async (req, res) => {
    const { companyname, description, branch, eligibility, ctc, passyear, joblocation, jobrole, registerbefore, drivedate, reglink, compimg } = req.body;

    console.log(compimg)
    try {

        const newdrive = new drive({
            companyname,
            description,
            branch,
            eligibility,
            ctc,
            passyear,
            joblocation,
            jobrole,
            registerbefore,
            drivedate,
            reglink,
            compimg // Store the Firebase Storage URL
        });

        await newdrive.save();

        // Fetch registered users' email addresses from your database
        let collection = await mongoose.connection.db.collection("student_registers");
        let results = await collection.find({}).toArray();
        const registeredUsers = results.map((user)=>user.email);

        // Send emails to registered users
        for (const email of registeredUsers) {
            await transporter.sendMail({
                to: email,
                from: "suryavanshir72@gmail.com",
                subject: "New Drive Announcement",
                html: `
                <html>
                    <head>
                        <!-- Add your inline CSS styles here -->
                    </head>
                    <body>
                        <h1>New Drive Announcement</h1>
                        <p>A new drive has been announced. Check it out!</p>
                        <h4>Company Name : ${companyname}</h4>
                        <a href="http://localhost:4000/drives">
                            <button>View More Information</button>
                        </a>
                        <img src="${compimg}" alt="Company Logo">
                    </body>
                </html>
                `
            });
        }

        return res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false });
    }
});

router.post('/uploadvideo', async (req, res) => {
    const { title, caption, video } = req.body;

    console.log(video)
    try {

        const newdrive = new Video({
            title,
            caption,
            video // Store the Firebase Storage URL
        });

        await newdrive.save();

        // // Fetch registered users' email addresses from your database
        // let collection = await mongoose.connection.db.collection("student_registers");
        // let results = await collection.find({}).toArray();
        // const registeredUsers = ['suryavanshir20@gmail.com','rohitsuryavanshi160@gmail.com'];

        // // Send emails to registered users
        // for (const email of registeredUsers) {
        //     await transporter.sendMail({
        //         to: email,
        //         from: "suryavanshir72@gmail.com",
        //         subject: "New Drive Announcement",
        //         html:`
        //         <html>
        //             <head>
        //                 <!-- Add your inline CSS styles here -->
        //             </head>
        //             <body>
        //                 <h1>New Drive Announcement</h1>
        //                 <p>A new drive has been announced. Check it out!</p>
        //                 <h4>Company Name : ${companyname}</h4>
        //                 <a href="http://localhost:4000/drives">
        //                     <button>View More Information</button>
        //                 </a>
        //                 <img src="${compimg}" alt="Company Logo">
        //             </body>
        //         </html>
        //         `
        //     });
        // }

        return res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false });
    }
});

router.get('/videos', async (req, res) => {
    try {
        let collection = await mongoose.connection.db.collection("uploaded_videos");
        let results = await collection.find({}).toArray();
        res.send(results).status(200);
    } catch (err) {
        console.log(err)
    }
})

router.get('/companies', async (req, res) => {
    try {
        let collection = await mongoose.connection.db.collection("drives");
        let results = await collection.find({}).toArray();
        res.send(results).status(200);
    } catch (err) {
        console.log(err)
    }
})

router.get('/placedstudents', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).send("Database connection not ready");
        }
        let collection = await mongoose.connection.db.collection("placed_students");
        let results = await collection.find({}).toArray();
        res.status(200).send({ results, message: 'success' })
    } catch (err) {
        console.log(err)
    }
})

router.get("/:id", async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ObjectId' });
    }

    let collection = await mongoose.connection.db.collection("drives");
    let query = { _id: new ObjectId(id) };
    let result = await collection.findOne(query);

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

router.patch('/placedstd/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid ObjectId' });
        }

        const query = { _id: new ObjectId(id) };
        const updates = {
            $set: {
                studentname: req.body.studentname,
                companyname: req.body.companyname,
                branch: req.body.branch,
                ctc: req.body.ctc,
                year: req.body.year,
            }
        }

     
        if (req.body.compimg !== undefined) {
            updates.$set.compimg = req.body.compimg;
        }


        const collection = await mongoose.connection.db.collection('placed_students');
        const result = await collection.updateOne(query, updates);

        res.status(200).json({ success: true, result });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/placedstudent/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).send('Invalid ObjectId');
        }
        const query = { _id: new ObjectId(id) };
        const collection = await mongoose.connection.db.collection("placed_students");
        let result = await collection.deleteOne(query);
        res.send(result).status(200);
    } catch (err) {
        console.log(err)
    }

})

router.patch('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid ObjectId' });
        }

        const query = { _id: new ObjectId(id) };
        const updates = {
            $set: {
                companyname: req.body.companyname,
                description: req.body.description,
                branch: req.body.branch,
                eligibility: req.body.eligibility,
                ctc: req.body.ctc,
                passyear: req.body.passyear,
                joblocation: req.body.joblocation,
                jobrole: req.body.jobrole,
                registerbefore: req.body.registerbefore,
                drivedate: req.body.drivedate,
                reglink: req.body.reglink,
            }
        }

        if (req.body.compimg !== undefined) {
            updates.$set.compimg = req.body.compimg;
        }

        const collection = await mongoose.connection.db.collection('drives');
        const result = await collection.updateOne(query, updates);

        res.status(200).json({ success: true, result });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).send('Invalid ObjectId');
        }
        const query = { _id: new ObjectId(id) };
        const collection = await mongoose.connection.db.collection("drives");
        let result = await collection.deleteOne(query);
        res.send(result).status(200);
    } catch (err) {
        console.log(err)
    }

})

// router.get('/logout', (req, res) => {
//     res.clearCookie('jwttoken', { path: '/' })
//     res.status(200).send('User Logout')
// })

router.post('/addplacedstudent', async (req, res) => {
    const { companyname, studentname, branch, ctc, year, compimg } = req.body;

    try {
        const placedstd = new placedstudent({
            studentname,
            companyname,
            branch,
            ctc,
            year,
            compimg
        });
        await placedstd.save();
        return res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false });
    }
});




module.exports = router