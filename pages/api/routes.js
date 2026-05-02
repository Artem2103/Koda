import { getRouteDecision } from "@/lib/engine/decisionEngine";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const {
    origin,
    destination,
    cargoType,
    containerSize,
    weightKg,
    quantity,
    quantityUnit,
    priority,
    transportMode,
    insurance,
    urgency,
  } = req.body ?? {};

  if (!origin || !destination || !cargoType || !(weightKg || quantity)) {
    return res.status(400).json({ error: "origin, destination, cargoType and weightKg/quantity are required" });
  }

  const result = await getRouteDecision({
    origin,
    destination,
    cargoType,
    containerSize,
    weightKg: Number(weightKg || quantity || 0),
    quantity: Number(quantity || weightKg || 0),
    quantityUnit: quantityUnit || "kg",
    priority: priority || "standard",
    transportMode: transportMode || "auto",
    insurance: Boolean(insurance),
    urgency: Number(urgency || 0),
  });

  if (result?.error) return res.status(result.status ?? 400).json({ error: result.error });
  return res.status(200).json(result);
}
