import AppError from "../utils/error.util.js";
import  Jwt  from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'abcsdbdbfbf';

const isLoggedIn = async (req,res, next)=>{
    const {token} = req.cookies;

    if(!token){
        return next (new AppError('please loginagain',400))
    }

    const userDetails = await Jwt.verify(token, JWT_SECRET);

    req.user = userDetails;

    next();
}

export {
    isLoggedIn
}