import mongoose, {
  Schema,
  Document,
} from "mongoose";

import { ILead } from "../interfaces/lead.interface";

export interface ILeadDocument
  extends ILead,
    Document {}

const leadSchema = new Schema<ILeadDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
    },

    status: {
      type: String,
      enum: [
        "New",
        "Contacted",
        "Qualified",
        "Lost",
      ],
      default: "New",
    },

    source: {
      type: String,
      enum: [
        "Website",
        "Instagram",
        "Referral",
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Lead = mongoose.model<ILeadDocument>(
  "Lead",
  leadSchema
);