import { Router } from "express";
import { acceptConnectionRequest, downloadProfile, getAllUserProfile, getMyConnectionRequest, getUserAndProfile, login, register, sendConnectionRequest, updateProfileData, updateUserProfile, uploadProfilePicture, whatAreMyConnections } from "../controllers/users.controller.js";
import multer from "multer";
const router = Router();


const storage = multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null,"uploads")
    },
    filename:(req,file,cb) =>{
        cb(null , file.originalname)
    }
})

const upload = multer({storage: storage});



router.route("/upload_profile_picture").post(upload.single("profile_picture"),uploadProfilePicture);//uploadProfilePicture user controller ke andar jayega
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/user_profile").post(updateUserProfile);
router.route("/getUserAndProfile").get(getUserAndProfile);
router.route("/update_profile_data").post(updateProfileData);
router.route("/get_all_users").get(getAllUserProfile);
router.route("/downloadProfile");
router.route("/user/download_resume").get(downloadProfile);
router.route("/user/send_connecction_request").post(sendConnectionRequest);
router.route("/user/get_Connection_request").get(getMyConnectionRequest);
router.route("/user/user_connection_request").get(whatAreMyConnections);
router.route("/user/accept_connection_request").post(acceptConnectionRequest); 


export default router;  