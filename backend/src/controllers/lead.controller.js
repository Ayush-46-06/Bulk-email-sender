import XLSX from "xlsx";
import Lead from "../models/Lead.js";

export const uploadLeads =
async (req, res) => {

  const workbook =
    XLSX.readFile(req.file.path);

  const sheet =
    workbook.Sheets[
      workbook.SheetNames[0]
    ];

  const rows =
    XLSX.utils.sheet_to_json(
      sheet
    );

  let duplicates = 0;
  let imported = 0;

  for (const row of rows) {

    const exists =
      await Lead.findOne({
        email: row.email
      });

    if (exists) {
      duplicates++;
      continue;
    }

    await Lead.create(row);
    imported++;
  }

  res.json({
    imported,
    duplicates
  });
};