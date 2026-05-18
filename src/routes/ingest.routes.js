import express from "express";

import {
  ingestDocument,
} from "../vector/ingestion.service.js";

const router = express.Router();

router.post("/", async (req, res) => {

  try {

    const { text, source } =
      req.body;

    const result =
      await ingestDocument({
        text,
        source,
      });

    return res.json({
      success: true,
      data: result,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;