import { createClient } from "@supabase/supabase-js";

const isValidEmail = (email) => {
  const value = String(email || "").trim();
  const emailPattern = /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,}$/i;
  if (!emailPattern.test(value) || value.includes("..")) return false;

  const domain = value.split("@")[1] || "";
  return domain
    .split(".")
    .every((part) => part.length > 0 && !part.startsWith("-") && !part.endsWith("-"));
};

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

  const sanitizedLeadForm = {
    ...leadForm,
    name: String(leadForm?.name || "").trim(),
    email: String(leadForm?.email || "").trim().toLowerCase(),
    phone: String(leadForm?.phone || "").trim(),
  };

  if (!sanitizedLeadForm.name) {
    return res.status(400).json({ success: false, error: "Name is required." });
  }

  if (!isValidEmail(sanitizedLeadForm.email)) {
    return res.status(400).json({ success: false, error: "A valid email address is required." });
  }

  if (!/^\d{10}$/.test(sanitizedLeadForm.phone)) {
    return res.status(400).json({ success: false, error: "Phone number must be exactly 10 digits." });
  }

  try {
    const { data, error } = await supabase.from("leads").insert({
      name: sanitizedLeadForm.name,
      email: sanitizedLeadForm.email,
      phone: sanitizedLeadForm.phone,
      company: sanitizedLeadForm.company || "Unknown",
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
