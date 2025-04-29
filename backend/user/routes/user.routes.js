import express from "express";
import {
  loginUser,
  profilePage,
  registerUser,
  verifyUser,
  fetchAllUsers,
  addNewUser,
  updateUser,
  deleteUser
} from "../controller/user.controller.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify", verifyUser);
router.post("/login", loginUser);
router.post("/add", isAuth, isAdmin, addNewUser);
router.get("/all", isAuth, isAdmin, fetchAllUsers );
router.put("/:id", isAuth, isAdmin, updateUser)
router.delete("/:id", isAuth, isAdmin, deleteUser)
router.get("/profile", isAuth, profilePage);

export default router;
