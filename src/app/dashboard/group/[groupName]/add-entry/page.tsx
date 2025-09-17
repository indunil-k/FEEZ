"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function AddEntryPage() {
  const router = useRouter();
  const params = useParams();
  const groupName = typeof params.groupName === "string" ? params.groupName : "";
  const [entryName, setEntryName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!entryName.trim()) {
      setError("Entry name required");
      return;
    }
    setLoading(true);
    // Remove encodeURIComponent everywhere, use raw groupName
    console.log("Frontend groupName param:", groupName);
    const res = await fetch(`/api/groups/${groupName}/entries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("feez_token")}`,
      },
      body: JSON.stringify({ entryName: entryName.trim() }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      router.push(`/dashboard/group/${groupName}`);
    } else {
      setError(data.error || data.message || "Error adding entry");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white p-8 flex flex-col items-center">
      <h1 className="text-5xl font-extrabold mb-8 text-center">ADD ENTRY TO {groupName}</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 rounded-2xl p-10 shadow-2xl flex flex-col gap-8 w-full max-w-md"
      >
        <input
          type="text"
          placeholder="ENTRY NAME"
          className="text-3xl px-6 py-4 rounded-xl bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={entryName}
          onChange={(e) => setEntryName(e.target.value)}
          required
        />
        {error && <div className="text-2xl text-red-500 text-center font-bold">{error}</div>}
        <div className="flex gap-6 justify-center">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-3xl font-bold py-4 px-10 rounded-xl transition-all"
            disabled={loading}
          >
            {loading ? "ADDING..." : "ADD ENTRY"}
          </button>
          <button
            type="button"
            className="bg-gray-700 hover:bg-gray-800 text-3xl font-bold py-4 px-10 rounded-xl transition-all"
            onClick={() => router.push(`/dashboard/group/${groupName}`)}
          >
            CANCEL
          </button>
        </div>
      </form>
    </main>
  );
}
