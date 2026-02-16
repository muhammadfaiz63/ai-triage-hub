"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Ticket {
  id: string;
  email: string;
  message: string;
  status: string;
  category?: string;
  sentiment?: number;
  urgency?: string;
  createdAt: Date;
}

export default function Home() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const url =
      statusFilter === "ALL"
        ? `${process.env.NEXT_PUBLIC_API_URL}/tickets`
        : `${process.env.NEXT_PUBLIC_API_URL}/tickets?status=${statusFilter}`;

    fetch(url)
      .then((res) => res.json())
      .then(setTickets);
  }, [statusFilter]);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        AI Support Triage Dashboard
      </h1>

      <div className="mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="READY">Ready</option>
          <option value="FAILED">Failed</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      <div className="space-y-4">
        {tickets.length ? tickets.map((ticket) => (
          <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
            <div className="flex flex-col border rounded-lg p-5 mb-4 shadow-sm hover:shadow-md transition bg-gray-50">
              <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-800">{ticket.email}</p>
                <p className="text-sm text-gray-800">
                  {ticket.category} | Sentiment: {ticket.sentiment}
                </p>
              </div>

              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  ticket.urgency === "High"
                    ? "bg-red-100 text-red-700"
                    : ticket.urgency === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}>
                  Urgency: {ticket.urgency}
                </span>

                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  ticket.status === "PENDING"
                    ? "bg-gray-200 text-gray-700"
                    : ticket.status === "PROCESSING"
                    ? "bg-blue-100 text-blue-700"
                    : ticket.status === "READY"
                    ? "bg-purple-100 text-purple-700"
                    : ticket.status === "FAILED"
                    ? "bg-red-200 text-red-800"
                    : ticket.status === "RESOLVED"
                    ? "bg-green-200 text-green-800"
                    : ""
                }`}>
                  {ticket.status}
                </span>
              </div>
            </div>

            <hr className="mt-3 border-gray-300" />

            <div className="flex items-center justify-between pt-3">
              <p className="text-gray-700">{ticket.message}</p>
              <p className="text-sm text-gray-600">
                {new Date(ticket.createdAt).toLocaleString()}
              </p>
            </div>

            </div>
          </Link>
        )): "No tickets found."}
      </div>
    </main>
  );
}
