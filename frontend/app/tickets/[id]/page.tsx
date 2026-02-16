"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function TicketDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [ticket, setTicket] = useState<any>(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTicket(data);
        setDraft(data.aiDraft || "");
      });
  }, [id]);

  const handleResolve = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets/${id}/resolve`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ finalDraft: draft }),
    });

    router.push("/");
  };

  if (!ticket) return <p className="p-8">Loading...</p>;

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-xl font-bold">Ticket Detail</h1>

      <div>
        <p><strong>Email:</strong> {ticket.email}</p>
        <p><strong>Message:</strong> {ticket.message}</p>
        <p><strong>Status:</strong> {ticket.status}</p>
      </div>

      <div>
        <h2 className="font-semibold mb-2">AI Draft</h2>
        <textarea
          className="w-full border p-2 rounded h-32"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
      </div>

      <button
        onClick={handleResolve}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Resolve
      </button>
    </main>
  );
}
