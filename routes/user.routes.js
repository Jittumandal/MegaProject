import express from 'express'
import { forgetPassword, getProfile, logingUser, logoutUser, registerUser, resetPassword, verify} from '../controllers/user.controllers.js';
import isloggedIn from '../middlewares/user.middlewares.js'


const router = express.Router();

router.post("/register", registerUser);
router.get("/verify/:token", verify);
router.post("/login", logingUser);
router.get('/profile', isloggedIn, getProfile )
router.get('/logout',isloggedIn, logoutUser )
router.post('/forgetpassword', forgetPassword)
router.post('/resetpassword/:token', resetPassword)




export default router