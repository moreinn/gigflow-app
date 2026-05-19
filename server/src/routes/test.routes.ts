import { Router, Response } from "express";

import {
  protect,
  AuthRequest,
} from "../middlewares/auth.middleware";

import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  (req: AuthRequest, res: Response) => {
    res.status(200).json({
      success: true,
      message: "Welcome Admin",
      user: req.user,
    });
  }
);

export default router;