import Post from "../models/posts.model.js";
import User from "../models/users.model.js";
import Comment from "../models/comments.model.js";

//checking api that it working or not 

export const activeCheck = async (req,res) =>{
    return res.status(200).json({message : "RUNNING"})
}



export const createPost = async (req,res)=>{

    const {token} = req.body;

    try{

        const user = await User.findOne({token:token});

        if(!user){
            return res.status(404).json({message:"User not Found"});
        }

        const post = new Post({
            userId: user._id,
            body: req.body.body,
            media: req.file !=undefined ? req.file.path : "",
            fileType: req.file != undefined ? req.file.mimetype.split("/")[1] : ""
        })

        await post.save();

        return res.status(200).json({message:"Post craeted"});

    }catch(err){
        return res.status(500).json({message:err.message});
    }
}




export const getAllPost = async (req,res)=>{
    try{
        const posts= await Post.find().populate("userId","name userName email profilePicture");
        return res.json({posts});
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}



export const deletePost = async (req,res)=>{
    const {token,post_id} = req.body;

    try{

        const user = await User
            .findOne({ token: token })
            .select("_id");

            if(!user){
                return res.status(404).json({message:"user not Found"})
            }


            const post = await Post.findOne({_id:post_id});

            if(!post){
                return res.status(404).json({message:"Page Not Found"});
            }

            if (post.userId.toString() !== user._id.toString()){
                return res.status(403).json({message:"Unauthorized"});
            }

            await Post.deleteOne({_id:post_id});

            return res.json({message:"post Deleted"});
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}



export const commentPost = async (req,res)=>{
    try{
        
    const {token,post_id,commentBody} = req.body;
    const user = await User.findOne({token:token}).select("_id");

    if(!user){
        return res.status(404).json({message:"User not found"});
    }

    const post = await Post.findOne({_id:post_id});

    if(!post){
       return res.status(404).json({message:"Post Not Found"});
    }

    const comment = new Comment({
        userId:user._id,
        postId:post_id,
        body:commentBody
    });

    await comment.save();

    return res.status(200).json({message:"Comment saved"});


    }catch(err){
     res.status(500).json({message:err.message});
    }
}



export const get_comment_by_post = async (req,res)=>{

     const {post_id} = req.query;
    try{

        const post = await Post.findOne({_id:post_id});

        if(!post){
            return res.status(404).json({message:"Post not found hai"});
        }

        const comments = await Comment
        .find({postId:post_id})          //.find() yani array jayega 
        .populate("userId","userName name profilePicture");

        return res.json({
            comments : comments,
            post_id:post_id
        });


        // return res.json({comments:post.comments,
        //     post_id:post._id
        // });
        
        
        


    }catch(err){
        res.status(500).json({message:err.message});
    }
}



export const delete_comment_by_id = async (req,res)=>{

    const {token,comment_id} = req.body;

    try{
        const user = await User.findOne({token:token}).select("_id");

        if(!user){
            res.status(404).json({message:"User not Found"});
        }

        const comment = await Comment.findOne({"id":comment_id})

        if(!comment){
            res.status(404).json({message:"Comment not Found"});
        }

        if (comment.userId.toString() ==user._id.toString()){
            return res.status(404).json({message:"unauthorized"});
        }

        await Comment.deleteOne({"_id":comment_id});

        return res.json({message:"comment Deleted"});
    }catch(err){
        res.status(500).json({message:err.message});
    }
}




export const increment_likes = async (req,res)=>{
    const {token,post_id} = req.body;
    try{

        // const post = await Post.findById(post_id);  aise bhe likh skte ho 
    const post = await Post.findOne({_id:post_id});

        if(!post){
            res.status(404).json({message:" Post not found"});
        }

        post.likes= post.likes + 1;

        await post.save();

        res.status(200).json({message:"liked"});
    }catch(err){
        res.status(500).json({message:err.message});
    }
}



