import { BookingData, PROJECT_TYPES } from "./booking-types";

export type Estimate = {
  complexity: "Simple" | "Moderate" | "Complex" | "Enterprise-scale";
  timeline: string;
  suggestedBudget: string;
  summary: string;
};

export function computeEstimate(data: BookingData): Estimate {
  const typeInfo = PROJECT_TYPES.find((t) => t.id === data.projectType);
  const baseWeight = typeInfo?.weight ?? 3;
  const featureWeight = data.features.length * 0.7;
  const totalWeight = baseWeight + featureWeight;

  let complexity: Estimate["complexity"] = "Simple";
  if (totalWeight > 12) complexity = "Enterprise-scale";
  else if (totalWeight > 7) complexity = "Complex";
  else if (totalWeight > 3) complexity = "Moderate";

  const timelineMap: Record<Estimate["complexity"], string> = {
    Simple: "3–7 days",
    Moderate: "1–3 weeks",
    Complex: "4–8 weeks",
    "Enterprise-scale": "8+ weeks, phased",
  };

  const budgetMap: Record<Estimate["complexity"], string> = {
    Simple: "$300 – $800",
    Moderate: "$800 – $2,500",
    Complex: "$2,500 – $6,000",
    "Enterprise-scale": "$6,000+",
  };

  const deadlineNote =
    data.deadline === "asap"
      ? " Given the tight timeline, scope may need to be trimmed for a first release."
      : "";

  const summary = `A ${complexity.toLowerCase()} ${
    typeInfo?.label.toLowerCase() ?? "project"
  } with ${data.features.length || "no"} extra feature${
    data.features.length === 1 ? "" : "s"
  } selected. Realistic timeline is ${timelineMap[complexity]}.${deadlineNote}`;

  return {
    complexity,
    timeline: timelineMap[complexity],
    suggestedBudget: budgetMap[complexity],
    summary,
  };
}
