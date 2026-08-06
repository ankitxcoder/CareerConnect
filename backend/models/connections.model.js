import mongoose, { connection } from "mongoose";

const connectionsRequestSchema = new mongoose.Schema(
    {
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        connectionId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        statusAccepted : {
            type : Boolean,
            default :null
        }
    }
);

const ConnectionRequest = mongoose.model("ConnectionRequest",connectionsRequestSchema);
export default ConnectionRequest;