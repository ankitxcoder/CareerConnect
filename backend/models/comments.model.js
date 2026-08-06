import mongoose from "mongoose";

const commentsSchema = new mongoose.Schema(
    {
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        postId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        body : {
            type : String,
            required : true
        }
    }
);

const Comment = mongoose.model("Comment", commentsSchema);
export default Comment;