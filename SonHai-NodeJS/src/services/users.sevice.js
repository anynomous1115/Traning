const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getData } = require("./service");
const User = require("../models/users.model");

const saltRound = 10;

const registerService = async ({ email, password }) => {
  const isExistingUser = await User.findOne({ email });
  if (isExistingUser) {
    throw new Error({ message: "User already exists !" });
  }
  password = await bcrypt.hash(password, saltRound);

  const user = await User.create({ email, password });
  return user;
};

const loginService = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error({ message: "Email or password is incorrect !" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error({ message: "Email or password is incorrect !" });
    }
    const ageToken = 3600;
    const accessToken = jwt.sign(
      { _id: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    return {
      accessToken,
      ageToken,
    };
  } catch (error) {
    console.log(error);
    console.log({ message: "Something went wrong!" });
  }
};

const checkUserLoginService = async (accessTokenVerify) => {
  try {
    const { _id } = accessTokenVerify;
    const isExistingUser = await User.findOne({ _id });
    
    return isExistingUser;
  } catch (error) {
    console.log({ message: "Something went wrong!" });
  }
};

module.exports = {
  registerService,
  loginService,
  checkUserLoginService,
};
