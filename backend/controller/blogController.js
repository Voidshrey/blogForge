import Blog from "../model/Blog.js";
import asyncHandler from "express-async-handler";

//@desc     Post a Blog
//@route    /api/blog
//@access   Private
export const postBlog = asyncHandler(async (req, res, next) => {
  let { title, content , categories } = req.body;

  if(!title || !content || !categories){
   throw new Error("title or content or categories is missing..!")
  }
  let newBlog = await Blog.create({
    title,
    content,
    categories,
    author: req?.userId,
    featuredImage: req.file?.path,
  });
  res.status(201).json(newBlog);
});

//@desc     Get Blogs
//@route    /api/blog
//@access   Public
export const getBlogs = asyncHandler(async (req, res) => {
  let blogs = await Blog.find();
  res.status(200).json(blogs);
});

//@desc     Get a Blog
//@route    /api/blog/:slug
//@access   Public
export const getBlog = asyncHandler(async (req, res) => {
  let { slug } = req.params;
  let blog = await Blog.findOne({ slug });
  res.status(200).json(blog);
});

//@desc     Update a Blog
//@route    /api/blog/:slug
//@access   Private
export const updateBlog = asyncHandler(async (req, res) => {
  let { slug } = req.params;

  let blog = await Blog.findOne({ slug });

  if (req.body.title) {
    blog.title = req.body.title;
  }
  if (req.body.content) {
    blog.content = req.body.content;
  }
  if (req.file) {
    blog.featuredImage = req.file?.path;
  }

  await blog.save();

  res.status(200).json(blog);
});

//@desc     Delete a Blog
//@route    /api/blog/:slug
//@access   Private
export const deleteBlog = asyncHandler(async (req, res) => {
  let { slug } = req.params;
  await Blog.findOneAndDelete({ slug });
  res.sendStatus(204);
});
