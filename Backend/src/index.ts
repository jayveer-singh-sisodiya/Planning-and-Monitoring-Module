import express, { Request, Response } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import os from "os";
import csv from "csv-parser";
import ExcelJS from "exceljs";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

const downloadsPath = path.join(os.homedir(), "Downloads");

/* ===============================
   📘 READ CSV API
================================ */
app.get("/read-csv", (req: Request, res: Response) => {
  const fileParam = req.query.file;

  let fileName: string;

  // Safely check if it’s a string or array of strings
  if (typeof fileParam === "string") {
    fileName = fileParam;
  } else if (Array.isArray(fileParam) && typeof fileParam[0] === "string") {
    fileName = fileParam[0];
  } else {
    fileName = "GAA DHBVNL.csv"; // fallback
  }

  const filePath = path.join(downloadsPath, fileName);

  if (!fs.existsSync(filePath)) {
    return res
      .status(404)
      .json({ error: "CSV file not found in Downloads folder." });
  }

  const results: Record<string, string>[] = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => results.push(row))
    .on("end", () => res.json(results))
    .on("error", (err) => res.status(500).json({ error: err.message }));
});

/* ===============================
   📗 READ EXCEL API
================================ */
app.get("/read-excel", async (req: Request, res: Response): Promise<void> => {
  try {
    const fileParam = req.query.file;

    let fileName: string;

    // Safely check if it’s a string or array of strings
    if (typeof fileParam === "string") {
      fileName = fileParam;
    } else if (Array.isArray(fileParam) && typeof fileParam[0] === "string") {
      fileName = fileParam[0];
    } else {
      fileName = "GAA.xlsx"; // fallback
    }

    const filePath = path.join(downloadsPath, fileName);
    if (!fs.existsSync(filePath)) {
      res
        .status(404)
        .json({ error: "Excel file not found in Downloads folder." });
      return;
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      res.status(400).json({ error: "No worksheet found in Excel file." });
      return;
    }

    const data: Record<string, any>[] = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header
      const rowData: Record<string, any> = {};
      row.eachCell((cell, colNumber) => {
        const header = worksheet.getRow(1).getCell(colNumber).value;
        rowData[String(header)] = cell.value;
      });
      data.push(rowData);
    });
    res.json(data); // ✅ Must send array
  } catch (error) {
    console.error("Error reading Excel file:", error);
    res.status(500).json({ error: "Failed to read Excel file." });
  }
});

/* ===============================
   📗 READ EXCEL System ConfigAPI
================================ */
app.get(
  "/read-systemconf-excel",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const fileParam = req.query.file;

      let fileName: string;

      // Safely check if it’s a string or array of strings
      if (typeof fileParam === "string") {
        fileName = fileParam;
      } else if (Array.isArray(fileParam) && typeof fileParam[0] === "string") {
        fileName = fileParam[0];
      } else {
        fileName = "SystemConfiiguration.xlsx"; // fallback
      }

      const filePath = path.join(downloadsPath, fileName);
      if (!fs.existsSync(filePath)) {
        res
          .status(404)
          .json({ error: "Excel file not found in Downloads folder." });
        return;
      }

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);

      const worksheet = workbook.worksheets[0];
      if (!worksheet) {
        res.status(400).json({ error: "No worksheet found in Excel file." });
        return;
      }

      const data: Record<string, any>[] = [];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header
        const rowData: Record<string, any> = {};
        row.eachCell((cell, colNumber) => {
          const header = worksheet.getRow(1).getCell(colNumber).value;
          rowData[String(header)] = cell.value;
        });
        data.push(rowData);
      });
      res.json(data); // ✅ Must send array
    } catch (error) {
      console.error("Error reading Excel file:", error);
      res.status(500).json({ error: "Failed to read Excel file." });
    }
  }
);

/* ===============================
   🏠 DEFAULT ROUTE
================================ */
app.get("/", (_req: Request, res: Response) => {
  res.send("✅ Backend running successfully! Use /read-csv or /read-excel");
});

/* ===============================
   🚀 START SERVER
================================ */
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
