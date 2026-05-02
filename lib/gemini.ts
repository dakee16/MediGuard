import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY ?? "";

export const gemini = new GoogleGenerativeAI(apiKey);

export const PILL_ANALYSIS_PROMPT = `You are a clinical pharmacology assistant analyzing a medication image.
Identify the medication and return a JSON object only — no markdown, no prose:

{
  "name": "Generic name (Brand if visible)",
  "dosage": "e.g., 500mg",
  "form": "tablet | capsule | liquid | injection | other",
  "shape": "physical description",
  "color": "primary colors",
  "imprint": "any text/code on the pill, or null",
  "uses": ["primary indication", "secondary use"],
  "howItWorks": "1-2 sentence mechanism in plain language",
  "commonSideEffects": ["effect 1", "effect 2", "effect 3"],
  "seriousSideEffects": ["effect 1", "effect 2"],
  "interactions": ["drug class or food to avoid"],
  "dosageGuidance": "typical adult dosing",
  "warnings": ["important warning 1", "important warning 2"],
  "confidence": "low | medium | high"
}

If you cannot identify the medication with reasonable confidence, set confidence to "low" and explain in a "note" field. Never fabricate identifications. This information is educational and not medical advice — note that in a "disclaimer" field.`;
