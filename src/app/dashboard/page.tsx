"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [groups, setGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newGroup, setNewGroup] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/groups", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("feez_token")}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setGroups(res.data || []);
        setLoading(false);
      });
  }, [showModal]);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!newGroup.trim()) {
      setError("Group name required");
      return;
    }
    const res = await fetch("/api/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("feez_token")}`,
      },
      body: JSON.stringify({ groupName: newGroup.trim() }),
    });
    const data = await res.json();
    if (data.success) {
      setShowModal(false);
      setNewGroup("");
      setGroups((prev) => [...prev, newGroup.trim()]);
    } else {
      setError(data.error || data.message || "Error creating group");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white p-8 flex flex-col items-center">
      <h1 className="text-5xl font-extrabold mb-8 text-center">YOUR GROUPS</h1>
      <button
        className="bg-green-600 hover:bg-green-700 text-3xl font-bold py-6 px-12 rounded-xl mb-10 transition-all"
        onClick={() => setShowModal(true)}
      >
        CREATE NEW GROUP
      </button>
      {loading ? (
        <div className="text-3xl text-center text-gray-300">Loading groups...</div>
      ) : groups.length === 0 ? (
        <div className="text-3xl text-center text-gray-300">No groups found. Create your first group!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
          {groups.map((group) => (
            <button
              key={group}
              className="bg-gray-800 hover:bg-blue-700 text-4xl font-bold py-10 rounded-2xl shadow-lg w-full mb-4 transition-all"
              onClick={() => router.push(`/dashboard/group/${encodeURIComponent(group)}`)}
            >
              {group}
            </button>
          ))}
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <form
            onSubmit={handleCreateGroup}
            className="bg-gray-900 rounded-2xl p-10 shadow-2xl flex flex-col gap-8 w-full max-w-md"
          >
            <h2 className="text-4xl font-extrabold mb-4 text-center">CREATE GROUP</h2>
            <input
              type="text"
              placeholder="GROUP NAME"
              className="text-3xl px-6 py-4 rounded-xl bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
              required
            />
            {error && <div className="text-2xl text-red-500 text-center font-bold">{error}</div>}
            <div className="flex gap-6 justify-center">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-3xl font-bold py-4 px-10 rounded-xl transition-all"
              >
                CREATE
              </button>
              <button
                type="button"
                className="bg-gray-700 hover:bg-gray-800 text-3xl font-bold py-4 px-10 rounded-xl transition-all"
                onClick={() => { setShowModal(false); setError(""); }}
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
