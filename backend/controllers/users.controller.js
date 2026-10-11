import Profile from "../models/profile.model.js";
import User from "../models/users.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import { connections } from "mongoose";
import ConnectionRequest from "../models/connections.model.js";

const convertUserDataToPDF = async (userData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!fs.existsSync("uploads")) {
        fs.mkdirSync("uploads");
      }

      const doc = new PDFDocument();
      const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
      const stream = fs.createWriteStream("uploads/" + outputPath);

      doc.pipe(stream);

      if (userData.userId?.profilePicture) {
        try {
          if (userData.userId.profilePicture.startsWith("http")) {
            const response = await fetch(userData.userId.profilePicture);
            const arrayBuffer = await response.arrayBuffer();
            doc.image(Buffer.from(arrayBuffer), {
              align: "center",
              width: 100,
            });
          } else if (
            fs.existsSync(`uploads/${userData.userId.profilePicture}`)
          ) {
            doc.image(`uploads/${userData.userId.profilePicture}`, {
              align: "center",
              width: 100,
            });
          }
        } catch (err) {
          console.log("PDF Image skipped safely:", err.message);
        }
      }

      doc.fontSize(18).text(`CareerConnect Profile`, { align: "center" });
      doc.moveDown(1.5);

      doc.fontSize(14).text(`Name: ${userData.userId?.name || "N/A"}`);
      doc.fontSize(14).text(`UserName: ${userData.userId?.userName || "N/A"}`);
      doc.fontSize(14).text(`Email: ${userData.userId?.email || "N/A"}`);
      doc.fontSize(14).text(`Position: ${userData.position || "N/A"}`);
      doc.moveDown();

      doc.fontSize(14).text("Past Work Experience:");
      userData.pastWork?.forEach((work) => {
        doc
          .fontSize(12)
          .text(
            `• Company: ${work.company || "N/A"} | Role: ${work.position || "N/A"} (${work.year || "N/A"})`,
          );
      });

      stream.on("finish", () => {
        resolve(outputPath);
      });
      stream.on("error", (err) => {
        reject(err);
      });
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, userName } = req.body;

    if (!name || !email || !password || !userName)
      return res.status(400).json({ message: "All Field Required" });

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "User Already Exist" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const defaultProfilePic =
      "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      userName,
      profilePicture: defaultProfilePic,
    });

    await newUser.save();

    const profile = new Profile({ userId: newUser._id });

    await profile.save();

    return res.json({ message: "User Created" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if ((!email, !password))
      return res.status(400).json({ message: "All Field Required" });

    const user = await User.findOne({
      email,
    });

    if (!user) return res.status(404).json({ message: "user not Exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    const token = crypto.randomBytes(32).toString("hex");

    await User.updateOne({ _id: user._id }, { $set: { token } });
    return res.json({ token: token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token: token });

    if (!user) {
      res.status(404).json({ message: "User Not Found" });
    }

    user.profilePicture = req.file.path;

    await user.save();

    return res.json({ message: "Profile Picture Updated" });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;

    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const { userName, email } = newUserData;

    const existingUser = await User.findOne({ $or: [{ userName }, { email }] });

    if (existingUser) {
      if (existingUser || String(existingUser._id) !== String(user._id)) {
        return res.status(404).json({ message: "user already exist" });
      }
    }

    Object.assign(user, newUserData);

    await user.save();

    return res.json({ message: "User Updated" });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const getUserAndProfile = async (req, res) => {
  try {
    const { token } = req.query;
    console.log({ token: token });

    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email userName profilePicture",
    );

    return res.json(userProfile);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateProfileData = async (req, res) => {
  try {
    const { token, ...newProfileData } = req.body;

    const userProfile = await User.findOne({ token: token });

    console.log("token se koin sa user mila :", userProfile?.email);

    if (!userProfile) {
      return res.status(404).json({ message: "user not found" });
    }

    const profile_to_updated = await Profile.findOne({
      userId: userProfile._id,
    });

    // Object.assign(profile_to_updated,newProfileData);  mongoose object assign new schema trcak ni krt ath safe hhai set() function use kro
    profile_to_updated.set(newProfileData);

    await profile_to_updated.save();

    return res.json({ message: "Profile Updated" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getAllUserProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate(
      "userId",
      "name userName email profilePicture",
    );

    return res.json({ profiles });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const downloadProfile = async (req, res) => {
  try {
    const user_id = req.query.id;

    const userProfile = await Profile.findOne({ userId: user_id }).populate(
      "userId",
      "name userName email profilePicture",
    );

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    const outputPath = await convertUserDataToPDF(userProfile); //upr bnaya hu convertUserDataToPDF esko

    return res.json({ message: outputPath });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "PDF Generation failed" });
  }
};

// Checking Connection is Already send or not

export const sendConnectionRequest = async (req, res) => {
  try {
    const { token, connectionId } = req.body;
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connectionUser = await User.findOne({ _id: connectionId });

    if (!connectionUser) {
      return res.status(404).json({ message: "Connection User nOt Found" });
    }

    const existingRequest = await ConnectionRequest.findOne({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    if (existingRequest) {
      return res.status(400).json({ messgae: "request Already Send" });
    }

    const request = new ConnectionRequest({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    await request.save();

    return res.json({ message: "request send" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//connection layengye aise
export const getMyConnectionRequest = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "user not Found" });
    }

    const connections = await ConnectionRequest.find({
      connectionId: user._id,
      statusAccepted: null,
    }).populate("userId", "name userName profilePicture");

    return res.json({ connections });
  } catch (err) {
    return res.status(500).json({ messafe: err.message });
  }
};

export const whatAreMyConnections = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const connections = await ConnectionRequest.find({
      userId: user._id,
    });

    return res.json({ connections });
  } catch (err) {
    return res.status(500).json({ message: err.messagge });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  const { token, requestId, action_type } = req.body;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connection = await ConnectionRequest.findOne({ _id: requestId });

    if (!connection) {
      return res.status(404).json({ messagge: "connnection not found" });
    }

    if (action_type === "accept") {
      connection.statusAccepted = true;
    } else {
      connection.statusAccepted = false;
    }

    await connection.save();

    return res.json({ message: "Request upadted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserProfileAndUserBasedOnUserName = async (req, res) => {
  const { userName } = req.query;

  try {
    const user = await User.findOne({ userName });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name userName email profilePicture",
    );

    return res.json({ profile: userProfile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserConnections = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "user Not Found" });
    }

    const myconnections = await ConnectionRequest.find({
      $or: [{ userId: user._id }, { connectionId: user._id }],
      statusAccepted: true,
    }).populate("userId connectionId", "name userName  profilePicture");

    return res.json({ myconnections });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
