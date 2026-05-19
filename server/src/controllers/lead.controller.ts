import { Request, Response } from "express";
import { Parser } from "json2csv";

import { Lead } from "../models/lead.model";

export const createLead = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lead = await Lead.create(req.body);

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getLeads = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      status,
      source,
      search,
      sort,
      page = "1",
    } = req.query;

    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (source) {
      query.source = source;
    }

    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    let sortOption = {};

    if (sort === "latest") {
      sortOption = { createdAt: -1 };
    }

    if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    }

    const limit = 10;

    const currentPage = Number(page);

    const skip =
      (currentPage - 1) * limit;

    const totalLeads =
      await Lead.countDocuments(query);

    const leads = await Lead.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,

      pagination: {
        total: totalLeads,
        currentPage,
        totalPages: Math.ceil(
          totalLeads / limit
        ),
        limit,
      },

      results: leads.length,

      data: leads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getSingleLead = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      res.status(404).json({
        success: false,
        message: "Lead not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateLead = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!lead) {
      res.status(404).json({
        success: false,
        message: "Lead not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: lead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const deleteLead = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndDelete(
      req.params.id
    );

    if (!lead) {
      res.status(404).json({
        success: false,
        message: "Lead not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const exportLeadsToCSV = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const leads = await Lead.find();

    const fields = [
      "name",
      "email",
      "status",
      "source",
      "createdAt",
    ];

    const json2csvParser = new Parser({
      fields,
    });

    const csv =
      json2csvParser.parse(leads);

    res.header(
      "Content-Type",
      "text/csv"
    );

    res.attachment("leads.csv");

    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "CSV export failed",
    });
  }
};