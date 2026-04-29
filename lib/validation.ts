import { z } from "zod";

export const waitlistSchema = z.object({
  email: z.string().trim().toLowerCase().email("A valid email is required"),
  name: z.string().trim().max(120).optional().or(z.literal("")),
  rank: z.string().max(60).optional().or(z.literal("")),
  vesselType: z.string().max(60).optional().or(z.literal("")),
  interest: z
    .enum(["engineer", "fleet_operator", "supplier", "recruiter", "other"])
    .optional(),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  // honeypot - bots fill this; humans never see it
  website: z.string().max(0).optional(),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;
