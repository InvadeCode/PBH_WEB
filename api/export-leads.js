import { createClient } from "@supabase/supabase-js";
import * as xlsx from "xlsx";

export default async function handler(req, res) {
  // Simple security check so only you can download this
  const { key } = req.query;
  if (key !== "pbhadmin2024") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: "Missing Supabase configuration." });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // 1. Fetch ALL leads from Supabase
    const { data: leads, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    if (!leads || leads.length === 0) {
      return res.status(404).json({ message: "No leads found." });
    }

    // 2. Format the data perfectly for Excel
    const formattedData = leads.map((lead) => {
      // Start with the standard columns
      const row = {
        "Date Submitted": new Date(lead.created_at).toLocaleString(),
        Name: lead.name,
        Email: lead.email,
        Company: lead.company,
        "Brand Stage": lead.brand_stage || "N/A",
        "Timeline": lead.timeline || "N/A",
        "Depth": lead.depth || "N/A",
        "Starting Point": lead.starting_point || "N/A",
        "Identified Gaps": Array.isArray(lead.identified_gaps) ? lead.identified_gaps.join(", ") : "",
        "Recommended Routes": Array.isArray(lead.recommended_routes) ? lead.recommended_routes.join(", ") : "",
        "Selected Routes": Array.isArray(lead.selected_routes) ? lead.selected_routes.join(", ") : "",
        "Selected Deliverables": Array.isArray(lead.selected_deliverables) ? lead.selected_deliverables.join(", ") : "",
      };

      // Extract the ugly JSON and make it beautiful columns
      if (lead.answers_raw && typeof lead.answers_raw === "object") {
        Object.values(lead.answers_raw).forEach((ans) => {
          if (ans.questionText && ans.label) {
            // This creates a column for the Question and puts the Answer in it!
            row[`Q: ${ans.questionText}`] = ans.label;
          }
        });
      }

      return row;
    });

    // 3. Create the Excel Workbook
    const worksheet = xlsx.utils.json_to_sheet(formattedData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "All Leads");

    // Adjust column widths slightly for better reading
    const cols = Object.keys(formattedData[0] || {}).map(() => ({ wch: 30 }));
    worksheet["!cols"] = cols;

    // 4. Generate buffer
    const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

    // 5. Send as a direct file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="PBH_Master_Lead_Report.xlsx"'
    );
    return res.status(200).send(buffer);

  } catch (err) {
    console.error("Export error:", err);
    return res.status(500).json({ error: "Failed to export leads." });
  }
}
