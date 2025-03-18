const admin = require("firebase-admin");
require("dotenv").config();
const nodemailer = require("nodemailer");
const express = require("express");
const cors = require("cors");

const serviceAccount = require("./q-talk-3cf63-firebase-adminsdk-fbsvc-2eecdd3409.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://q-talk-3cf63-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const app = express();

app.use(express.json());
app.use(cors()); 

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log("Request body:", req.body);
  next();
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

// Simple route to verify server is running
app.get('/', (req, res) => {
  res.send('OTP Server is running');
});

app.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  console.log("Received request to send OTP to:", email);
  
  if (!email) {
    console.log("Email missing in request");
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const otp = generateOTP();
    console.log(`Generated OTP ${otp} for ${email}`);
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 min expiry

    // Get user by email
    const userSnapshot = await admin.database().ref('users')
      .orderByChild('email')
      .equalTo(email)
      .once('value');
    
    if (!userSnapshot.exists()) {
      console.log(`User with email ${email} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    let userId = null;
    userSnapshot.forEach((childSnapshot) => {
      userId = childSnapshot.key;
    });
    console.log(`Found user ID: ${userId}`);

    // Store OTP in Firebase
    await admin.database().ref(`otps/${userId}`).set({
      otp,
      email,
      createdAt: Date.now(),
      expiresAt
    });
    console.log(`OTP stored in Firebase for user ${userId}`);

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It expires in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Detailed error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
});

app.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  console.log(`Received OTP verification request for ${email} with code ${otp}`);
  
  if (!email || !otp) {
    console.log("Missing email or OTP in request");
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    // Get user by email
    const userSnapshot = await admin.database().ref('users')
      .orderByChild('email')
      .equalTo(email)
      .once('value');
    
    if (!userSnapshot.exists()) {
      console.log(`User with email ${email} not found during verification`);
      return res.status(404).json({ message: "User not found" });
    }

    // Get user ID
    let userId = null;
    userSnapshot.forEach((childSnapshot) => {
      userId = childSnapshot.key;
    });
    console.log(`Found user ID for verification: ${userId}`);

    // Get OTP from Firebase
    const otpRef = admin.database().ref(`otps/${userId}`);
    const otpSnapshot = await otpRef.once('value');
    
    if (!otpSnapshot.exists()) {
      console.log(`No OTP found for user ${userId}`);
      return res.status(400).json({ message: "OTP expired or invalid" });
    }

    const storedOtpData = otpSnapshot.val();
    console.log(`Stored OTP data:`, storedOtpData);
    
    if (Date.now() > storedOtpData.expiresAt) {
      // Remove expired OTP
      await otpRef.remove();
      console.log(`OTP expired for user ${userId}`);
      return res.status(400).json({ message: "OTP expired" });
    }

    if (storedOtpData.otp == otp) {
      // Remove used OTP
      await otpRef.remove();
      
      // Mark user as verified
      await admin.database().ref(`users/${userId}/emailVerified`).set(true);
      console.log(`OTP verified successfully for user ${userId}`);
      
      res.json({ message: "OTP verified successfully" });
    } else {
      console.log(`Invalid OTP provided for user ${userId}`);
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Detailed error verifying OTP:", error);
    res.status(500).json({ message: "Failed to verify OTP", error: error.message });
  }
});

app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

app.listen(5000, '0.0.0.0', () => {
  console.log("Server running on port 5000");
  console.log("Test the server by visiting:");
  console.log("- From this computer: http://localhost:5000/");
  console.log("- From other devices: http://192.168.254.103:5000/");
});