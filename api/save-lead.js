import { createClient } from "@sanity/client";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const writeToken = process.env.SANITY_WRITE_TOKEN;

  if (!writeToken) {
    return res
      .status(500)
      .json({
        success: false,
        error: "Missing SANITY_WRITE_TOKEN environment variable.",
      });
  }

  const sanityClient = createClient({
    projectId: "5nzj8z3i",
    dataset: "production",
    apiVersion: "2024-05-27",
    useCdn: false,
    token: writeToken,
  });

  const { leadForm, answers, selectedDeliverables, startingPoint } = req.body;

  try {
    const doc = {
      _type: "lead",
      name: leadForm?.name || "Unknown",
      email: leadForm?.email || "Unknown",
      company: leadForm?.company || "Unknown",
      submittedAt: new Date().toISOString(),
      startingPoint: startingPoint || "",
      answers: answers ? JSON.stringify(answers) : "{}",
      selectedDeliverables: selectedDeliverables || [],
    };

    const response = await sanityClient.create(doc);
    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error("Error saving lead to Sanity:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
