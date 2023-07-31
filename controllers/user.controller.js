import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";
import cloudinary from "cloudinary";
// import fs from 'fs/promises';

const cookieOptions = {
    maxAge: 7 * 24 * 60 * 1000,  //7days
    httpOnly: true,
    secure: true
}

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return next(new AppError("all feilds are required", 400));
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return next(new AppError("User already exits", 400));
        }

        const user = await User.create({
            name,
            email,
            password,
            avatar: {
                public_id: email,
                secure_url: 'https://urlHere'
            }
        })

        if (!user) {
            return next(new AppError("User registration failed, please try again!!", 400));
        }

        // file upload
        // console.log("File details > ",JSON.stringify(req.file));

        if (req.file) {
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: 'lms',
                    width: 250,
                    height: 250,
                    gravity: 'faces',
                    crop: 'fill'
                });


                if (result) {
                    user.avatar.public_id = result.public_id;
                    user.avatar.secure_url = result.secure_url;
                    // remove file from srver 
                    // fs.rm(`uploads/${req.file.filename}`);
                }
            } catch (error) {
                return next(
                    new AppError(e || 'file not uploaded, please try again', 500)
                )
            }
        }


        await user.save();

        user.password = undefined;

        const token = await user.generateJWTToken();

        res.cookie('token', token, cookieOptions);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};



const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError("all feilds are required", 400));
        }

        const user = await User.findOne({
            email
        }).select('password');

        if (!user || !(await user.comparePassword(password))) {
            return next(new AppError('email and password does not match', 400));
        }

        const token = await user.generateJWTToken();
        user.password = undefined;

        res.cookie('token', token, cookieOptions);

        res.status(200).json({
            success: true,
            message: 'User loggedin successfully',
            user
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }

}

const logout = (req, res) => {
    try {
        res.cookie('token', null, {
            secure: true,
            maxAge: 0,
            httpOnly: true
        });

        res.status(200).json({
            success: true,
            message: 'User loggged out successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        res.status(200).json({
            success: true,
            message: 'User details',
            user
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message
        })
    }
}

export {
    register,
    login,
    logout,
    getProfile
}