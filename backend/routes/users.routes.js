import { Router } from "express";
import { login, register, uploadProfilePicture } from "../controllers/users.controller.js";
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

export default router;  