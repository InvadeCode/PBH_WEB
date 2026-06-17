import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({
      success: false,
      error: "Missing Supabase environment variables.",
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const {
    leadForm,
    answers,
    formattedAnswers,
    selectedDeliverables,
    startingPoint,
    clusters,
    routes,
    selectedRoutes,
    priorities,
    context,
  } = req.body;

  try {
    const { data, error } = await supabase.from("leads").insert({
      name: leadForm?.name || "Unknown",
      email: leadForm?.email || "Unknown",
      phone: leadForm?.phone || "",
      company: leadForm?.company || "Unknown",
      identified_gaps: clusters || [],
      recommended_routes: routes || [],
      selected_routes: selectedRoutes || [],
      selected_deliverables: selectedDeliverables || [],
      priorities: priorities || {},
      depth: context?.depth || "",
      brand_stage: answers?.stage?.label || "",
      timeline: context?.timeline || "",
      duration: context?.duration || "",
      starting_point: startingPoint || "",
      answers_raw: formattedAnswers || answers || {},
    }).select();

    if (error) throw error;

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error saving lead to Supabase:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
