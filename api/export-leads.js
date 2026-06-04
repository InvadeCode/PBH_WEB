import { createClient } from "@supabase/supabase-js";
import ExcelJS from "exceljs";

const ROUTES_INFO = {
  'BB': 'Brand Boulevard',
  'SAS': 'SciArt Saga',
  'STC': 'Storytelling Corner'
};

const DELIVERABLES_MASTER = [
  { id: 'D001', name: 'Brand Discovery Workshop' }, { id: 'D002', name: 'Brand Audit' }, { id: 'D003', name: 'Stakeholder Interviews Summary' },
  { id: 'D004', name: 'Competitor Landscape Mapping' }, { id: 'D005', name: 'Audience Understanding Snapshot' }, { id: 'D006', name: 'Brand Gap Analysis' },
  { id: 'D007', name: 'Positioning Territories' }, { id: 'D008', name: 'Workshop Summary Deck' }, { id: 'D009', name: 'Logo (Primary)' },
  { id: 'D010', name: 'Logo Variations' }, { id: 'D011', name: 'Logo Usage Guidelines' }, { id: 'D012', name: 'Typography System' },
  { id: 'D013', name: 'Color Palette' }, { id: 'D014', name: 'Visual Language' }, { id: 'D015', name: 'Iconography Style' },
  { id: 'D016', name: 'Imagery Direction' }, { id: 'D017', name: 'Brand Guidelines' }, { id: 'D018', name: 'Quick Brand Reference Sheet' },
  { id: 'D019', name: 'Layout Grid System' }, { id: 'D020', name: 'Typography Hierarchy' }, { id: 'D021', name: 'Color Application Rules' },
  { id: 'D022', name: 'Visual Consistency Rules' }, { id: 'D023', name: 'Social Templates' }, { id: 'D024', name: 'Presentation Templates' },
  { id: 'D025', name: 'Document Templates' }, { id: 'D026', name: 'UI Components' }, { id: 'D027', name: 'Design System Manual' },
  { id: 'D028', name: 'Visiting Cards' }, { id: 'D029', name: 'Letterheads' }, { id: 'D030', name: 'Email Signatures' },
  { id: 'D031', name: 'Merchandise' }, { id: 'D032', name: 'Brochures / Flyers' }, { id: 'D033', name: 'Lanyards / Badges' },
  { id: 'D034', name: 'Event Collaterals' }, { id: 'D035', name: 'Packaging Design' }, { id: 'D036', name: 'Packaging System' },
  { id: 'D037', name: 'Innovation Framework' }, { id: 'D038', name: 'Concept Simplification Models' }, { id: 'D039', name: 'Science-to-Human Translation' },
  { id: 'D040', name: 'Narrative Framework' }, { id: 'D041', name: 'Metaphor Systems' }, { id: 'D042', name: 'Knowledge Architecture' },
  { id: 'D043', name: 'Framework Deck' }, { id: 'D044', name: 'Brand IP Concepts' }, { id: 'D045', name: 'Experience Concepts' },
  { id: 'D046', name: 'Signature Properties' }, { id: 'D047', name: 'Campaignable Formats' }, { id: 'D048', name: 'Ecosystem Hooks' },
  { id: 'D049', name: 'Story Arcs' }, { id: 'D050', name: 'IP Strategy Document' }, { id: 'D051', name: 'Product Narrative' },
  { id: 'D052', name: 'Feature-Benefit Mapping' }, { id: 'D053', name: 'Use-case Storytelling' }, { id: 'D054', name: 'Product Positioning' },
  { id: 'D055', name: 'Product Naming' }, { id: 'D056', name: 'Packaging Story' }, { id: 'D057', name: 'Product Story Deck' },
  { id: 'D058', name: 'GTM Narrative' }, { id: 'D059', name: 'Messaging Framework' }, { id: 'D060', name: 'Audience Segmentation' },
  { id: 'D061', name: 'Campaign Hooks' }, { id: 'D062', name: 'Launch Concepts' }, { id: 'D063', name: 'Content Direction' },
  { id: 'D064', name: 'Rollout Plan' }, { id: 'D065', name: 'GTM Playbook' }, { id: 'D066', name: 'Campaign Concepts' },
  { id: 'D067', name: 'Visual Direction Boards' }, { id: 'D068', name: 'Content Themes' }, { id: 'D069', name: 'Art Direction' },
  { id: 'D070', name: 'Shoot Direction' }, { id: 'D071', name: 'Creative Deck' }, { id: 'D072', name: 'Content Strategy' },
  { id: 'D073', name: 'Content Buckets' }, { id: 'D074', name: 'Monthly Plan' }, { id: 'D075', name: 'Influencer Strategy' },
  { id: 'D076', name: 'Campaign Ideas' }, { id: 'D077', name: 'Post/Reel Directions' }, { id: 'D078', name: 'Engagement Hooks' },
  { id: 'D079', name: 'Social Playbook' }, { id: 'D080', name: 'Information Architecture' }, { id: 'D081', name: 'Page Flow' },
  { id: 'D082', name: 'User Journey Mapping' }, { id: 'D083', name: 'Copy Direction' }, { id: 'D084', name: 'Interaction Ideas' },
  { id: 'D085', name: 'CTA Strategy' }, { id: 'D086', name: 'Developer Brief' }, { id: 'D087', name: 'Event Theme' },
  { id: 'D088', name: 'Event Identity' }, { id: 'D089', name: 'Stage Design' }, { id: 'D090', name: 'Collateral System' },
  { id: 'D091', name: 'Delegate Kits' }, { id: 'D092', name: 'Signage System' }, { id: 'D093', name: 'Hybrid Integration' },
  { id: 'D094', name: 'Event Toolkit' }
];

const getRouteName = (id) => ROUTES_INFO[id] || id;
const getDeliverableName = (id) => {
  const match = DELIVERABLES_MASTER.find(d => d.id === id);
  return match ? match.name : id;
};

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
        "Identified Gaps": Array.isArray(lead.identified_gaps) ? lead.identified_gaps.map(g => `• ${g}`).join("\n") : "",
        "Recommended Routes": Array.isArray(lead.recommended_routes) ? lead.recommended_routes.map(r => `• ${getRouteName(r)}`).join("\n") : "",
        "Selected Routes": Array.isArray(lead.selected_routes) ? lead.selected_routes.map(r => `• ${getRouteName(r)}`).join("\n") : "",
        "Selected Deliverables": Array.isArray(lead.selected_deliverables) ? lead.selected_deliverables.map(d => `• ${getDeliverableName(d)}`).join("\n") : "",
      };

      // Extract the ugly JSON and make it beautiful columns
      if (lead.answers_raw && typeof lead.answers_raw === "object") {
        Object.values(lead.answers_raw).forEach((ans) => {
          if (ans.questionText && ans.label) {
            row[`Q: ${ans.questionText}`] = ans.label;
          }
        });
      }

      return row;
    });

    // 3. Create the Excel Workbook using exceljs
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("All Leads");

    // Extract all unique headers across all leads
    const allHeaders = new Set();
    formattedData.forEach(row => {
      Object.keys(row).forEach(key => allHeaders.add(key));
    });

    const columns = Array.from(allHeaders).map(header => ({
      header,
      key: header,
      width: header === "Selected Deliverables" ? 50 : 35
    }));
    
    worksheet.columns = columns;

    formattedData.forEach(row => {
      worksheet.addRow(row);
    });

    // Make header row bold and style all cells
    worksheet.getRow(1).font = { bold: true };
    
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        // Enable text wrapping and top alignment for all cells
        cell.alignment = { vertical: 'top', wrapText: true };
      });
    });

    // 4. Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // 5. Send as a direct file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="PBH_Master_Lead_Report.xlsx"'
    );
    return res.status(200).send(Buffer.from(buffer));

  } catch (err) {
    console.error("Export error:", err);
    return res.status(500).json({ error: "Failed to export leads." });
  }
}
