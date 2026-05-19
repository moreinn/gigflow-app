import { Router } from "express";

import {
  registerUser,
  loginUser,
} from "../controllers/auth.controller";

import {
  registerValidation,
  loginValidation,
} from "../validations/auth.validation";

import { validate } from "../middlewares/validation.middleware"

const router = Router();

router.post(
  "/register",
  registerValidation,
  validate,
  registerUser
);

router.post(
  "/login",
  loginValidation,
  validate,
  loginUser
);

export default router;