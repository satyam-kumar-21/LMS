import { Schema,model} from "mongoose";
import bcrypt from "bcryptjs"
import  Jwt  from "jsonwebtoken";

const userSchema = new Schema({
    name:{
        type:String,
        required:[true, 'name is required'],
        minLength:[4, 'name must be at least 5 character'],
        lowercase:true,
        trim:true
    },
    email:{
        type:String,
        required:[true, 'Email must be required'],
        lowercase:true,
        trim:true,
        unique : true
    },
    password:{
        type:String,
        required: [true,'password is required'],
        minLength: [8, 'password must be atleast 8 charactyer'],
        select : false
    },
    avatar:{
        public_id:{
            type: String
        },
        secure_url: {
            type: String
        }
    },
    role:{
        type:String,
        enum: ['USER','ADMIN'],
        default : 'USER'
    },
    forgetPasswordToken:{
        type: String
    },
    forgetPasswordExpiry :{
        type: Date
    }
},{
    timestamps : true
});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')){
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);
})

const JWT_SECRET = process.env.JWT_SECRET || "abcsdbdbfbf";
const JWT_EXPIRY = process.env.JWT_EXPIRY || "24h";

userSchema.methods = {
  generateJWTToken: async function () {
    return await Jwt.sign(
      {
        id: this._id,
        email: this.email,
        subscription: this.subscription,
        role: this.role,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRY,
      }
    );
  },
  comparePassword: async function (plainTextPassword) {
    return await bcrypt.compare(plainTextPassword, this.password); // Fixed the typo here from "bycrypt" to "bcrypt"
  },
};
const User = model('User',userSchema);

export default User;