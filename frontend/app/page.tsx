"use client";

import { useEffect, useState } from "react";

interface Ticket {
  id: string;
  email: string;
  message: string;
  status: string;
  category?: string;
  sentiment?: number;
  urgency?: string;
}

export default function Home() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets`)
      .then((res) => res.json())
      .then((data) => setTickets(data));
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">AI Triage Dashboard</h1>

      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="border rounded p-4 shadow-sm"
          >
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">{ticket.email}</p>
                <p className="text-sm text-gray-500">
                  {ticket.category} | Sentiment: {ticket.sentiment}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded text-white text-sm ${
                  ticket.urgency === "High"
                    ? "bg-red-500"
                    : ticket.urgency === "Medium"
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
              >
                {ticket.urgency}
              </span>
            </div>

            <p className="mt-3 text-gray-700">{ticket.message}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
