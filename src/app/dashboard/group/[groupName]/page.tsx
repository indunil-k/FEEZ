"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Entry {
  name: string;
  monthlyPaymentStatus: { [month: number]: boolean };
}

export default function GroupDetails() {
  const params = useParams();
  const router = useRouter();
  const groupName = typeof params.groupName === "string" ? params.groupName : "";
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!groupName) return;
    // Use raw groupName, do NOT encode
    fetch(`/api/groups/${groupName}/entries`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("feez_token")}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setEntries(res.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load entries");
        setLoading(false);
      });
  }, [groupName]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white p-8 flex flex-col items-center">
      <h1 className="text-5xl font-extrabold mb-8 text-center">GROUP: {groupName}</h1>
      {loading ? (
        <div className="text-3xl text-center text-gray-300">Loading entries...</div>
      ) : error ? (
        <div className="text-3xl text-center text-red-500">{error}</div>
      ) : entries.length === 0 ? (
        <div className="text-3xl text-center text-gray-300">No entries found. Add your first entry!</div>
      ) : (
        <div className="w-full max-w-4xl">
          {entries.map((entry) => (
            <div key={entry.name} className="bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg">
              <div className="text-4xl font-bold mb-4">{entry.name}</div>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <button
                    key={month}
                    className={`text-2xl font-extrabold py-6 px-2 rounded-lg text-center w-full transition-all uppercase tracking-wide border-4 ${
                      entry.monthlyPaymentStatus[month]
                        ? "bg-green-700 text-white border-green-400"
                        : "bg-gray-700 text-gray-300 border-gray-500"
                    }`}
                    onClick={async () => {
                      if (!window.confirm(`CONFIRM PAYMENT FOR ${entry.name} - MONTH ${month}?`)) return;
                      setLoading(true);
                      const res = await fetch(`/api/groups/${groupName}/entries/payment`, {
                        method: "PATCH",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${localStorage.getItem("feez_token")}`,
                        },
                        body: JSON.stringify({
                          entryName: entry.name,
                          month,
                          status: !entry.monthlyPaymentStatus[month],
                        }),
                      });
                      const data = await res.json();
                      if (data.success) {
                        alert("PAYMENT STATUS UPDATED!");
                        // Refresh entries
                        fetch(`/api/groups/${groupName}/entries`, {
                          headers: {
                            Authorization: `Bearer ${localStorage.getItem("feez_token")}`,
                          },
                        })
                          .then((res) => res.json())
                          .then((res) => {
                            setEntries(res.data || []);
                            setLoading(false);
                          });
                      } else {
                        alert("FAILED TO UPDATE PAYMENT STATUS!");
                        setLoading(false);
                      }
                    }}
                  >
                    {`MONTH ${month}`}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        className="bg-green-600 hover:bg-green-700 text-3xl font-bold py-6 px-12 rounded-xl mb-10 transition-all"
        onClick={() => router.push(`/dashboard/group/${groupName}/add-entry`)}
      >
        ADD NEW ENTRY
      </button>
      {/* TODO: Add entry management (add/edit/remove/toggle payment) */}
    </main>
  );
}
