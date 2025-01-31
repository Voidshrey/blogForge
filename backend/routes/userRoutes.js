import express from 'express'
import { login, register, updateProfile } from '../controller/userController.js';
import multer from 'multer';
import storage from '../middleware/fileUpload.js';
import { auth } from '../middleware/auth.js';

let upload = multer({ storage: storage, limits: { fileSize: 1 * 1024 * 1024 } })
let router = express.Router();


router.post("/register", upload.single("photo"), register);
router.post("/login", login);

router.patch("/profile/:id",upload.single("photo"),updateProfile);


export default router;