import { NextRequest, NextResponse } from "next/server";
import { gemini, PILL_ANALYSIS_PROMPT } from "../../../lib/gemini";
import type { AnalyzedMedication } from "../../../types";

export const runtime = "nodejs";
export const maxDuration = 30;

// Demo fallback when no API key is configured — keeps the UI functional during dev.
const DEMO_RESULT: AnalyzedMedication = {
  name: "Atorvastatin (Lipitor)",
  dosage: "10 mg",
  form: "tablet",
  shape: "Oval, film-coated",
  color: "White",
  imprint: "10 / PD 155",
  uses: [
    "Lowering LDL cholesterol",
    "Reducing risk of cardiovascular events",
    "Familial hypercholesterolemia",
  ],
  howItWorks:
    "Atorvastatin blocks an enzyme called HMG-CoA reductase that the liver uses to make cholesterol, which lowers LDL levels in the blood.",
  commonSideEffects: ["Muscle aches", "Diarrhea", "Nausea", "Mild headache"],
  seriousSideEffects: [
    "Unexplained muscle pain or tenderness",
    "Yellowing of skin or eyes",
    "Dark-colored urine",
  ],
  interactions: [
    "Grapefruit juice (more than 1 quart daily)",
    "Other statins",
    "Strong CYP3A4 inhibitors (e.g., clarithromycin)",
  ],
  dosageGuidance: "Adult: 10–80 mg once daily, usually in the evening. Take with or without food.",
  warnings: [
    "Discontinue and consult a doctor if muscle pain occurs",
    "Avoid in pregnancy",
    "Liver function should be monitored",
  ],
  confidence: "high",
  disclaimer: "This information is educational and not a substitute for medical advice.",
};

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();
    if (!image || typeof image !== "string") {
      return NextResponse.json({ error: "Missing image" }, { status: 400 });
    }

    // No API key — return demo data so the UI still works
    if (!process.env.GEMINI_API_KEY) {
      await new Promise((r) => setTimeout(r, 1500));
      return NextResponse.json(DEMO_RESULT);
    }

    // image is a data URL — strip prefix
    const base64 = image.includes(",") ? image.split(",")[1] : image;
    const mimeType = image.match(/data:(image\/\w+);base64/)?.[1] ?? "image/jpeg";

    const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
    const response = await model.generateContent([
      PILL_ANALYSIS_PROMPT,
      { inlineData: { data: base64, mimeType } },
    ]);

    const text = response.response.text().replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(text) as AnalyzedMedication;

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("[scan]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Analysis failed" },
      { status: 500 }
    );
  }
}
