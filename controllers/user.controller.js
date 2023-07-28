import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";

const cookieOptions = {
    maxAge: 7 * 24 * 60 * 1000,  //7days
    httpOnly: true,
    secure: true
}

const register = async (req,res, next) =>{
    const {name,email,password} = req.body;

    if(!name || !email || !password){
        return next(new AppError("all feilds are required",400));
    }

    const userExists = await User.findOne({email});

    if(userExists){
        return next(new AppError("User already exits",400));
    }

    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id: email,
            secure_url: 'https://urlHere'
        }
    })

    if(!user){
        return next(new AppError("User registration failed, please try again!!",400));
    }

    //TODO file upload

    await user.save();

    user.password = undefined;

    const token = await user.generateJWTToken();

    res.cookie('token',token, cookieOptions);

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user
    });
};



const login = async (req, res,next) =>{
    const {email, password} = req.body;

    if(!email || !password){
        return next(new AppError("all feilds are required",400));
    }

    const user = await User.findOne({
        email
    }).select('password');

    if(!user || !user.comparePassword(password)){
        return next(new AppError('email and password does not match',400));
    }

    const token = await user.generateJWTToken();
    user.password = undefined;

    res.cookie('token', token, cookieOptions);

    res.status(200).json({
        success: true,
        message : 'User loggedin successfully',
        user
    });

}

const logout = (req,res) =>{
    res.cookie('token', null,{
        secure: true,
        maxAge: 0,
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'User loggged out successfully'
    })
}

const getProfile = async (req, res) =>{
    const userId = req.user.id;
    const user = await User.findById(userId);

    res.status(200).json({
        success: true,
        message: 'User details',
        user
    });
}

export {
    register,
    login,
    logout,
    getProfile
}