import User from '../model/User.js';
import generateToken from '../utils/generateToken.js';
import expressAsyncHandler from 'express-async-handler';
import crypto from 'crypto';



export const register = expressAsyncHandler(async (req, res, next) => {    
    let { username, email, password, confirmPassword } = req.body;
    console.log(req.file);
    
        //verify user is in db already
        let existingUser=await User.findOne({email})
        if(existingUser){
           throw new Error("User already exists,Please Login")
        }
        //creating a new user
        let newUser = await User.create({
            username,
            email,
            role: req.body?.role || 'user',
            password,
            confirmPassword,
            photo:req.file?.path
        })
        //generate token
        let token=await generateToken(newUser._id);
        //sending response
        res.status(201).json({newUser,token});
});

export const login = expressAsyncHandler(async (req, res, next) => {
    let {  email, password} = req.body;
        //verify user is in db already
        let existingUser=await User.findOne({email})
        if(!existingUser){
            throw new Error("User doesnt exist,Please Register")
        }
        //verify password
        let result=await existingUser.verifyPassword(password,existingUser.password)
        if(!result){
            throw new Error("Password is not correct")
        }
        //token
        let token=await generateToken(existingUser._id)
        //sending response
        res.status(201).json({existingUser,token});
});


export const updateProfile = expressAsyncHandler( async(req , res , next) =>{
    let {id} = req.params;
    await User.findByIdAndUpdate(id , {photo : req.file?.path}, {new : true});
    res.sendStatus(201);
})

export const forgotPassword = expressAsyncHandler( async(req , res , next) =>{
    let {email} = req.params;

  let exisitingUser = await User.findOne(email);
  if(!exisitingUser){
 throw new Error("User dosen't exhists");
  }

  let resetPasswordToken = crypto.randomBytes(32);
  let resetPasswordTokenExpiresAt = new Date() + 60 * 60 * 1000;

  exisitingUser.resetPasswordToken = resetPasswordToken;
  exisitingUser.resetPasswordTokenExpiresAt = resetPasswordTokenExpiresAt;

  // we are saving the new values for the exhisting user , but not validating all the values 
  // as confirm password is required

  await exisitingUser.save({validateBeforeSave:false});



})

