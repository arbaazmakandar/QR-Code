const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Experiment = require("../models/experimentsModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const Appointment = require("../models/appointmentModel");
const timingsModel = require("../models/timingsModel");

const moment = require("moment");

var cors = require('cors');
router.use(cors()); 


router.post("/register", async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newuser = new User(req.body);
    await newuser.save();
    res
      .status(200)
      .send({ message: "User created successfully", success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error creating user", success: false, error });
  }
});

router.post("/update-user-profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(200).send({
      success: true,
      message: "User profile updated successfully",
      data: user,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting user info", success: false, error });
  }
});


router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Password is incorrect", success: false });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res
        .status(200)
        .send({ message: "Login successful", success: true, data: token });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error logging in", success: false, error });
  }
});

router.post("/get-user-info-by-id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting user info", success: false, error });
  }
});


router.post("/get-experiment-info-by-id", authMiddleware, async (req, res) => {
  try {
    const expt = await Experiment.findOne({ _id: req.body.experimentId });
    res.status(200).send({
      success: true,
      message: "Experiment info fetched successfully",
      data: expt,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting experiment info", success: false, error });
  }
});

router.post("/mark-all-notifications-as-seen",authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.body.userId });
      const unseenNotifications = user.unseenNotifications;
      const seenNotifications = user.seenNotifications;
      seenNotifications.push(...unseenNotifications);
      user.unseenNotifications = [];
      user.seenNotifications = seenNotifications;
      const updatedUser = await user.save();
      updatedUser.password = undefined;
      res.status(200).send({
        success: true,
        message: "All notifications marked as seen",
        data: updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error applying doctor account",
        success: false,
        error,
      });
    }
  }
);

router.post("/delete-all-notifications", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.seenNotifications = [];
    user.unseenNotifications = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "All notifications cleared",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error applying doctor account",
      success: false,
      error,
    });
  }
});

router.get("/get-all-experiments", authMiddleware, async (req, res) => {
  try {
    const expts = await Experiment.find({});
    res.status(200).send({
      message: "Experiments fetched successfully",
      success: true,
      data: expts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error getting all experiments",
      success: false,
      error,
    });
  }
});

router.post("/book-appointment", authMiddleware, async (req, res) => {
  try {
    req.body.status = "pending";
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();

    


              
    const newAppointment = new Appointment(req.body);
    // const exp = await Experiment.findOne({
    //   _id:req.body.experimentId
    // });
    await newAppointment.save();
    //pushing notification to admin based on his userid
    const user = await User.findOne({ isAdmin: true });
    user.unseenNotifications.push({
      type: "new-appointment-request",
      message: `A new appointment request has been made by ${req.body.userInfo.name} for ${req.body.experimentName}`,
      onClickPath: "/admin/appointmentList",
    });
  
    await user.save();
    
    res.status(200).send({
      message: "Appointment booked successfully",
      success: true,
    });
    

    // exp.numOfBoards = exp.numOfBoards - 1;
    // console.log(exp);
    // exp.save(function(){});

  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error booking appointment",
      success: false,
      error,
    });
  }
});

router.post("/check-booking-avilability", authMiddleware, async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1.5, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1.5, "hours").toISOString();
    const experimentId = req.body.experimentId;
    const appointments = await Appointment.find({
      experimentId,
      date,
      time: { $gte: fromTime, $lte: toTime },
    });

    // const exp = await Experiment.find({
    //   _id:experimentId,
    // });
    // console.log(fromTime);
    // console.log("/n");
    // console.log(appointments.length);
    // console.log(appointments[0].status);
    // console.log(exp.length);
    console.log(moment(req.body.date, "DD-MM-YYYY").toISOString())
    console.log(moment(req.body.time, "HH:mm").toISOString())

    const timings = await timingsModel.find({date:moment(req.body.date, "DD-MM-YYYY").toISOString(),
                                             time:moment(req.body.time, "HH:mm").toISOString()});

    //If slots are full => timings.numOfBoads==0
    console.log("I am inside user")
     console.log(timings);

    if ((appointments.length > 0 && appointments[0].status == "approved") && (timings.length!=0 && timings[0].numOfBoads==0)) {
      // console.log("I am in IF");ß
      return res.status(200).send({
        message: "Appointments not available",
        success: false,
      });
      
    }
     else{
      // console.log("I am in Else");
      return res.status(200).send({
        message: "Appointments available",
        success: true,
      });
      
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error booking appointment",
      success: false,
      error,
    });
  }
});

router.get("/get-appointments-by-user-id", authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.body.userId });
    res.status(200).send({
      message: "Appointments fetched successfully",
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error fetching appointments",
      success: false,
      error,
    });
  }
});
module.exports = router;
