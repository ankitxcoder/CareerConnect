import Profile from "../models/profile.model.js";
import User from "../models/users.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import doc from "pdfkit";
import PDFDocument from "pdfkit";
import fs from "fs";
import { connections } from "mongoose";



const convertUserDataToPDF = async (userData) =>{
    const doc = new PDFDocument();

    const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
    const stream = fs.createWriteStream("uploads/" + outputPath);

    doc.pipe(stream);

    doc.image(`uploads/${userData.userId.profilePicture}`,{align: "center", width:100})
    doc.fontSize(14).text(`Name:  ${userData.userId.name}`);
    doc.fontSize(14).text(`UserName : ${userData.userId.userName}`);
    doc.fontSize(14).text(`Email : ${userData.userId.email}`);
    doc.fontSize(14).text(`Position:${userData.position}`);

    doc.fontSize(14).text("Past Work : ")
    userData.pastWork.forEach((work,index)=>{
        doc.fontSize(14).text(`Company Name : ${work.company}`);
        doc.fontSize(14).text(`Position L ${work.position}`);
        doc.fontSize(14).text(`Year: ${work.year}`);
    })

    doc.end();

    return outputPath;
}

export const register = async (req, res) =>{
    try {
        const {name,email,password,userName} = req.body;

        if (!name || !email || !password || !userName) return res.status(400).json({message: "All Field Required"})
        
        const user = await User.findOne(
            {email}
        );

        if (user) return res.status(400).json({message : "User Already Exist"})

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User(
                {
                    name,
                    email,
                    password : hashedPassword,
                    userName
                }
            );

            await newUser.save();

            const profile = new Profile({userId: newUser._id});

            await profile.save()

            return res.json({message:"User Created"});

    } catch (error){
        return res.status(500).json({message: error.message})
    }
}


export const login = async (req,res)=>{
    try {
        const { email,password } = req.body;

        if ( !email, !password) return res.status(400).json({message : "All Field Required"});

        const user = await User.findOne(
            {
                email
            }
        );

        if (!user) return res.status(404).json({message : "user not Exist"})

        const isMatch =  await bcrypt.compare(password,user.password);
        if (!isMatch) return res.status(400).json({message:"Invalid Credentials"})

        const token = crypto.randomBytes(32).toString("hex");
        

        await User.updateOne({_id: user._id},{$set: { token }})
        return res.json({ token: token })
    } catch (error){
        return res.status(500).json({message : error.message})
    }
}




export const uploadProfilePicture = async (req,res)=>{
    const {token } = req.body;

    try {
        const user =  await User.findOne({token : token});

        if (!user) {
            res.status(404).json({message:"User Not Found"});
        }

        user.profilePicture = req.file.filename;
        await user.save();

        return res.json({message: "Profile Picture Updated"})


    } catch (err){
        res.status(500).json(err.message);
    }

}



export const updateUserProfile = async (req,res) => {
    
    try {
        const { token , ...newUserData } = req.body;

        const user = await User.findOne({token:token});

        if (!user){
            return res.status(404).json({message: "user not found"});
        }

        const { userName , email } = newUserData;
        
        const existingUser = await User.findOne({ $or : [{userName},{email}]});

        if (existingUser){
            if (existingUser || String(existingUser._id) !== String(user._id)){
                return res.status(404).json({message:"user already exist"});
            }
        }

        Object.assign(user, newUserData);

        await user.save();

        return res.json({message: "User Updated"});
    } catch (err){
        res.status(500).json(err.message);
    }
    
}



export const getUserAndProfile = async (req,res)=>{
    try {
        const { token } = req.body;

        const user = await User.findOne({token : token});

        if (!user){
            return res.status(404).json({message : "user not found"})
        }


        const userProfile = await Profile.findOne({userId: user._id}).populate("userId","name email userName profilePicture");

        return res.json(userProfile);

    } catch (err){
        return res.status(500).json({message: error.message});
    }
}



export const updateProfileData = async (req,res) => {

    try {
        const { token, ...newProfileData } = req.body;

        const userProfile = await User.findOne({token : token});

        if (!userProfile){
            return res.status(404).json({message:"user not found"});
        }

        const profile_to_updated = await Profile.findOne({userId : userProfile._id});

        Object.assign(profile_to_updated,newProfileData);

        await profile_to_updated.save();

        return res.json({message : "Profile Updated"});


    } catch (err){
        return res.status(500).json({message: err.message});
    }
}



export const getAllUserProfile = async (req,res)=>{
    try{
        const profiles = await Profile.find().populate("userId","name userName emailprofilePicture");
        
        return res.json({profiles});

    }catch(err){
        return res.status(500).json({message:err.message});
    }
}



export const downloadProfile = async (req,res)=>{
    const user_id = req.query.id;

    const userProfile = await Profile.findOne({userId: user_id})
    .populate("userId","name userName email profilePicture");

    let outputPath = await convertUserDataToPDF(userProfile);  //upr bnaya hu convertUserDataToPDF esko

    return res.json({"message" : outputPath});
}





        // Checking Connection is Already send or not 
    
export const sendConnectionRequest = async (req,res)=>{

     try {
    
        const user = await User.findOne({token})
        
        if(!user){
          return res.status(404).json({message: "User not found"});
        }

        const connectionUser = await User.findOne({_id: connectionId });

        if(!connectionUser){
            return res.status(404).json({message:"Connection User nOt Found"});
        }


        const existingUser = await ConnectionRequest.findOne({
                userId : user._id,
                connectionId : connectionUser._id
            })

        if(!existingUser){
                return res.status(400).json({messgae:"request Already Send"});

            }

        const request = new ConnectionRequest({
                userId: user._id,
                connectionId: connectionUser._id
            });

        await request.save();

        return res.json({message:"request send"});
        }catch (err){
        res.status(500).json({message: err.message});
    }
}




//connection layengye aise 
export const getMyConnectionRequest = async (req,res)=>{
    const {token} = req.body;

    try{
        const user = await User.findOne({token});
        if(!user){

            return res.status(404).json({message: "user not Found"});

        }

        const connections = await ConnectionRequest.findOne({userId: user._id})
              .popuulate("connections","name userName profilePicture");

              return res.json({connections})
        
    }catch(err){
        return res.status(500).json({messafe: err.message});
    }
}




export const whatAreMyConnections = async (req,res)=>{
    const {token } = req.body;

    try { 
        const user = await User.findOne({token});
        
        if(!user){
            return res.status(404).json({message:"User not found"});

            const connecctions = await ConnectionRequest.fiind({connectionId: user._id})
            .populate("userId ", "name userName email profilePicture");

            return res.json(connections);
        }
    }catch(err){
        return res.status(500).json({message: err.messagge});
    }
} 





export const acceptConnectionRequest = async (req,res)=>{

     const {token , reuestId, action_type} = req.body;

    try{
        const user = await User.findOne({token});

        if(!user){
            return res.status(404).json({message: "User not found"});

        }

        const connection = await ConnectionRequest.findOne({_id: requestId});

        if(!connection){
            return res.status(404).json({messagge:"connnection not found"});

        }

        if(acction_type === "accept"){
            connecction.status_accepted = true;
            }else {
                connection.status_accepted = false;
        }

        await connection.save();

        return res.json({message:"Request upadted"});;

    }catch(err){
        res.status(500).json({message: err.message});

    }
}