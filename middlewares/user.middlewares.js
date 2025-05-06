import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
const isLoggedIn = async (req, res, next) => {
  try {
    // 1. extract token from request of the user API call (from cookies)
    // const token = req.cookies.jwtToken;
    const jwtToken = req.cookies?.jwtToken;

    if (!jwtToken) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized access",
      });
    }
    //refresh token hai
    const refreshDecoded = jwt.verify(jwtToken, process.env.JWT_SECRET)
    console.log(refreshDecoded.id);


    const user = await User.findOne({ _id: refreshDecoded.id });
    console.log(user.email);

    if (!user) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized access",
      });
    }

    req.user = refreshDecoded;
    next();


  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

export default isLoggedIn;
