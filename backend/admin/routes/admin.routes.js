import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import { isAdmin } from "../middleware/isAdmin.js";
import {
  addNewUser,
  deleteUser,
  getAllUsers,
  updateUser,
} from "../controller/admin.controller.js";

const router = express.Router();

router.get("/users", isAuth, isAdmin, getAllUsers);
router.post("/new", isAuth, isAdmin, addNewUser);
router.put("/users/:id", isAuth, isAdmin, updateUser);
router.delete("/users/:id", isAuth, isAdmin, deleteUser);

export default router;
