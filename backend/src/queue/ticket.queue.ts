import { Queue } from "bullmq";

export const ticketQueue = new Queue("ticket-triage", {
  connection: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});