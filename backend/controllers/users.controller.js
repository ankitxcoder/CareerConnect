import Profile from "../models/profile.model.js";
import User from "../models/users.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

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
        return res.json({ token })
    } catch (error){
        return res.status(404).json({message : error.message})
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