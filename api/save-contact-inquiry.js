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

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields: name, email, message.",
    });
  }

  try {
    const { data, error } = await supabase.from("contact_inquiries").insert({
      name,
      email,
      message,
    }).select();

    if (error) throw error;

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error saving contact inquiry to Supabase:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
