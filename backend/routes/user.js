import express from 'express';
import { loginUser, profilePage, registerUser, verifyUser } from '../controller/user.js';
import { isAuth } from '../middleware/isAuth.js';

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify", verifyUser);
router.post("/login", loginUser);
router.get("/profile", isAuth, profilePage);

export default router;