import { Router } from "express";
import {
  createTicket,
  getTickets,
  getTicketById,
  resolveTicket,
} from "../controllers/tickets.controller";

const router = Router();

router.post("/", createTicket);
router.get("/", getTickets);
router.get("/:id", getTicketById);
router.patch("/:id/resolve", resolveTicket);

export default router;
