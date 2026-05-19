import { Router } from "express";

import {
  createLead,
  getLeads,
  getSingleLead,
  updateLead,
  deleteLead,
  exportLeadsToCSV,
} from "../controllers/lead.controller";

import { protect } from "../middlewares/auth.middleware";

import { authorizeRoles } from "../middlewares/role.middleware";

import { leadValidation } from "../validations/lead.validation";

import { validate } from "../middlewares/validation.middleware";

const router = Router();

router.post(
  "/",
  protect,
  authorizeRoles("admin", "sales"),
  leadValidation,
  validate,
  createLead
);

router.get(
  "/",
  protect,
  authorizeRoles("admin", "sales"),
  getLeads
);

router.get(
  "/export/csv",
  protect,
  authorizeRoles("admin"),
  exportLeadsToCSV
);

router.get(
  "/:id",
  protect,
  authorizeRoles("admin", "sales"),
  getSingleLead
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "sales"),
  leadValidation,
  validate,
  updateLead
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteLead
);

export default router;