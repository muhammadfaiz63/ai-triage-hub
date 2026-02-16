import { Request, Response } from "express";
import { ticketQueue } from "../queue/ticket.queue";
import { prisma } from "../lib/prisma";

export async function createTicket(req: Request, res: Response) {
  try {
    const { email, message } = req.body;

    if (!email || !message) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const ticket = await prisma.ticket.create({
      data: {
        email,
        message,
        status: "PENDING",
      },
    });

    await ticketQueue.add("triage", {
      ticketId: ticket.id,
    });

    return res.status(201).json({
      id: ticket.id,
      status: ticket.status,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export const getTickets = async (req: Request, res: Response) => {
  const { status } = req.query;

  const tickets = await prisma.ticket.findMany({
    where: status ? { status: String(status) as any } : undefined,
    orderBy: { createdAt: "desc" },
  });

  res.json(tickets);
};

export const getTicketById = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  
  const ticket = await prisma.ticket.findUnique({
    where: { id },
  });

  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  res.json(ticket);
};

export const resolveTicket = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { finalDraft } = req.body;

  if (!finalDraft || finalDraft.length < 10) {
    return res.status(400).json({ message: "Invalid draft" });
  }

  const updated = await prisma.ticket.update({
    where: { id },
    data: {
      status: "RESOLVED",
      aiDraft: finalDraft,
      resolvedAt: new Date(),
    },
  });

  res.json(updated);
};
