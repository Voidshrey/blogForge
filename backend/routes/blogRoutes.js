import express from 'express'
import multer from 'multer'
import storage from '../middleware/fileUpload.js';
import { deleteBlog, getBlog, getBlogs, postBlog, updateBlog } from "../controller/blogController.js";
import { auth ,checkRole } from "../middleware/auth.js";


let router = express.Router();

let upload=multer({storage:storage})


//public routes
router.get("/",getBlogs);
router.get("/:slug",getBlog);

//private routes
router.post("/",auth,checkRole('author','admin'),upload.single("featuredImage"),postBlog);
router.patch("/:slug",auth,checkRole('author','admin'),upload.single("featuredImage"),updateBlog);
router.delete("/:slug",auth,checkRole('admin','author'),deleteBlog);

export default router;






