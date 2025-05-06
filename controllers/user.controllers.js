
import User from "../models/user.models.js";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/sendMailer.js";
import jwt from 'jsonwebtoken'



// Controller for user registration
const registerUser = async (req, res) => {
  // Extract data from the request body
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({
      status: false,
      message: 'Name, email, and password are required.'
    });
  }

  // Validate password length
  // if (password.length < 6) {
  //   return res.status(400).json({
  //     status: false,
  //     message: 'Password must be at least 6 characters long.'
  //   });
  // }

  try {
    // Check if user already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: 'User with this email already exists.'
      });
    }

    // Generate a verification token and its expiry time
    const token = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = Date.now() + 10 * 60 * 60 * 1000; // Token expires in 10 hours

    // Create a new user instance and save to the database
    const user = await User.create({
      name,
      email,
      password, // Ensure password is hashed in your model's pre-save middleware
      verificationToken: token,
      verificationTokenExpiry: verificationTokenExpiry
    });

    // Check if user creation was successful
    if (!user) {
      return res.status(400).json({
        status: false,
        message: 'Failed to create user.'
      });
    }

    await user.save()// save the user to the databae
    // Send verification email to the user
    await sendVerificationEmail(user.email, token);
    console.log('Verification email sent:', token);

    // await user.save();

    // Send success response
    return res.status(200).json({
      status: true,
      message: 'User registered successfully.'
    });

  } catch (error) {
    // Handle server-side errors
    return res.status(500).json({
      status: false,
      message: 'Server error occurred. Please try again later.'
    });
  }
};

// Controller for user email verification
const verify = async (req, res) => {
  try {
    // Retrieve verification token from request parameters
    const token = req.params.token;

    // Find the user associated with the provided verification token
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() } // Check if token is not expired
    });

    // Handle case where user is not found
    if (!user) {
      return res.status(400).json({
        status: false,
        message: 'Invalid token or user not found.'
      });
    }

    // Update user verification status and clear verification token
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;

    await user.save();

    // Send success response
    return res.status(200).json({
      status: true,
      message: 'User verified successfully.'
    });

  } catch (error) {
    console.log('Email verification failed:', error);

    return res.status(500).json({
      status: false,
      message: 'Failed to verify email. Please try again later.'
    });
  }
};

// Controller for user login
const logingUser = async (req, res) => {
  // Extract login data from the request body
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({
      status: false,
      message: 'Email and password are required.'
    });
  }

  try {
    // Check if user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: 'Invalid email or password.'
      });
    }

    // Ensure user's email is verified
    if (!user.isVerified) {
      return res.status(400).json({
        status: false,
        message: 'Please verify your email address.'
      });
    }

    // Validate user password
    const isPasswordMatch = await user.comparePassword(password);
    console.log('password', isPasswordMatch)
    if (!isPasswordMatch) {
      return res.status(400).json({
        status: false,
        message: 'Invalid password.'
      });
    }

    // Generate a JWT token for the user
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });



    // Set HTTP-only cookies for added security
    const cookieOptions = {
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // Cookie expires in 15 days
      httpOnly: true, // Prevent XSS attacks
    };

    // Attach cookie and send success response
    res.cookie('jwtToken', jwtToken, cookieOptions);
    return res.status(200).json({
      status: true,
      message: 'User logged in successfully.'
    });

  } catch (error) {
    console.log('User login failed:', error);

    return res.status(400).json({
      status: false,
      message: 'Login failed. Please try again later.'
    });
  }
};

// Controller for getting user profile  details
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')

    // validation user
    if (!user) {
      return res.status(400).json({
        status: false,
        message: 'User not found'
      })
    }

    // send resposne
    return res.status(200).json({
      status: true,
      message: 'User Profile details',
      use: {
        id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
        isVerified: user.isVerified,
        role: user.role
      }
    })

  } catch (error) {
    console.log('User profile failed', error)
    return res.status(400).json({
      status: false,
      message: 'User profile failed'
    })

  }

}



// logout user controller
const logoutUser = async (req, res) => {
  try {
    // 2. clear cookie
    res.cookie("jwtToken", "", {
      httpOnly: true,
    });

    // 3. send response
    return res.status(200).json({
      status: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("User logout failed", error);
    return res.status(500).json({
      status: false,
      message: "User logout failed",
    });
  }
}

// user forget password  

const forgetPassword = async (req, res) => {
  try {
    // 1. get email from request body
    const { email } = req.body

    // 2. check if user exists
    if (!email) {
      return res.status(400).json({
        status: false,
        message: 'Email is required'
      })
    }

    // 3. check if user exists in the database
    const user = await User.findOne({ email })
    // console.log('exists user', user)
    console.log('user', user)

    if (!user) {
      return res.status(400).json({
        status: false,
        message: 'User not found'
      })
    }



    //4. generate reset password token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = Date.now() + 10 * 60 * 60 * 1000// 10 hours
    user.resetPasswordToken = resetToken,
      user.resetPasswordTokenExpiry = resetTokenExpiry,
      await user.save()



    // 5. send reset passwpord email
    await sendVerificationEmail(user.email, resetToken, 'forgetpassword')
    console.log('Forget password email send:', resetToken)

    // 6. send response
    return res.status(200).json({
      status: true,
      message: 'Forget password email send successfully'
    })

  } catch (error) {
    console.log('Forget Password Failed', error)
    return res.status(400).json({
      status: false,
      message: 'Forget password failed'
    })

  }

}

// Reset password controller
const resetPassword = async (req, res) => {
  try {
    //1. get data from request body
    const { token } = req.params
    const { password } = req.body
    //2. check if password is provided
    if (!token || !password) {
      return res.status(400).json({
        status: false,
        message: 'Password is required'
      })
    }
    //3. check if user exists in the database
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiry: { $gt: Date.now() }
    })

    // 4. check if user exists
    if (!user) {
      return res.status(400).json({
        status: false,
        message: 'User not found'
      })
    }
    //5. update user password
    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordTokenExpiry = undefined
    await user.save()

    //6. send response
    return res.status(200).json({
      status: true,
      message: 'Password reset successfully'
    })


  } catch (error) {
    console.log('Reset Password Failed', error)
    return res.status(400).json({
      status: false,
      message: 'Reset password failed'
    })

  }

}





export { registerUser, verify, logingUser, getProfile, logoutUser, forgetPassword, resetPassword };
