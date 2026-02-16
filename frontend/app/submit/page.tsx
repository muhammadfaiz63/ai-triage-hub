"use client";

import { useState } from "react";

export default function SubmitPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, message }),
    });

    alert("Ticket submitted!");
    setEmail("");
    setMessage("");
  };

  return (
    <main className="p-8 space-y-4">
      <h1 className="text-xl font-bold">Submit Support Ticket</h1>

      <input
        className="border p-2 rounded w-full"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <textarea
        className="border p-2 rounded w-full h-32"
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </main>
  );
}
