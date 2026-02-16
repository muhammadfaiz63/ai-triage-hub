import { z } from "zod";

export const aiResponseSchema = z.object({
  category: z.enum(["Billing", "Technical", "FeatureRequest"]),
  sentiment: z.number().min(1).max(10),
  urgency: z.enum(["High", "Medium", "Low"]),
  draft: z.string().min(40),
});
