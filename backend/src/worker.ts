import dotenv from "dotenv";
dotenv.config();

import { Worker } from "bullmq";
import { prisma } from "./lib/prisma";
import { analyzeTicket } from "./services/ai.service";
import { aiResponseSchema } from "./schemas/ai.schema";

const worker = new Worker(
  "ticket-triage",
  async (job) => {
    const { ticketId } = job.data;

    try {
      await prisma.ticket.update({
        where: { id: ticketId },
        data: { status: "PROCESSING" },
      });

      const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId },
      });

      if (!ticket || ticket.status !== "PENDING") {
        return;
      }

      if (!ticket) {
        throw new Error("Ticket not found");
      }

      const raw = await analyzeTicket(ticket.message);

      if (!raw) {
        throw new Error("AI returned empty response");
      }

      const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

      const parsed = JSON.parse(cleaned);
      const validated = aiResponseSchema.parse(parsed);

      await prisma.ticket.update({
        where: { id: ticketId },
        data: {
          status: "READY",
          category: validated.category,
          sentiment: validated.sentiment,
          urgency: validated.urgency,
          aiDraft: validated.draft,
          processedAt: new Date(),
        },
      });

    } catch (error: any) {
      await prisma.ticket.update({
        where: { id: ticketId },
        data: {
          status: "FAILED",
          errorReason: error.message,
        },
      });
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    },
  }
);

worker.on("completed", (job) => {
  console.log("Job completed:", job.id);
});

worker.on("failed", (job, err) => {
  console.error("Job failed:", err);
});

console.log("Worker running...");
