const {Schema, model} = require("mongoose");
const handleMongooseError = require("../utils/handle-mongoose-error");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new Schema({
  password: {
    type: String,
    minLength: 6,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    match: emailRegex,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  token: {
    type: String,
    default: null,
  },
  avatarUrl: {
    type: String,
    required: true,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, 'Verify token is required'],
  },
}, 
{versionKey: false, timestamps: true});

userSchema.post("save", handleMongooseError);

const User = model("user", userSchema);

module.exports = User;