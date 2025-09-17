'use client';

import { useEffect, useState } from 'react';

interface Entry {
  entryName: string;
  monthlyPaymentStatus: Record<number, boolean>;
}
interface Group {
  groupName: string;
  entries: Entry[];
}
interface UserEntries {
  userID: string;
  userName: string;
  groups: Group[];
}

const MONTHS = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
];

export default function PublicFeeTracker() {
  const [data, setData] = useState<UserEntries[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [search, setSearch] = useState('');
  const [filterPaid, setFilterPaid] = useState<'paid' | 'unpaid'>('unpaid');
  const [groupOptions, setGroupOptions] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');

  useEffect(() => {
    // Fetch all groups for dropdown
    fetch('/api/public-fees')
      .then(res => res.json())
      .then(res => {
        const groups = new Set<string>();
        (res.data || []).forEach((user: UserEntries) => {
          user.groups.forEach(g => groups.add(g.groupName));
        });
        setGroupOptions(Array.from(groups));
      });
  }, []);

  useEffect(() => {
    const params = [`month=${selectedMonth}`, `paid=${filterPaid === 'paid'}`];
    if (selectedGroup) params.push(`group=${encodeURIComponent(selectedGroup)}`);
    fetch(`/api/public-fees/filter?${params.join('&')}`)
      .then(res => res.json())
      .then(res => setData(res.data || []));
  }, [selectedMonth, filterPaid, selectedGroup, search]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white p-8">
      <h1 className="text-5xl font-extrabold mb-8 text-center">FEE STATUS TRACKER</h1>
      <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-8">
        <div className="flex gap-2 flex-wrap justify-center mb-4">
          {MONTHS.map((month, idx) => (
            <button
              key={month}
              className={`text-2xl font-extrabold px-6 py-4 rounded-xl transition-all ${selectedMonth === idx + 1 ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-700`}
              onClick={() => setSelectedMonth(idx + 1)}
            >
              {month}
            </button>
          ))}
        </div>
        <div className="flex gap-4 mb-4">
          <button
            className={`text-2xl font-extrabold px-6 py-4 rounded-xl transition-all ${filterPaid === 'paid' ? 'bg-green-600' : 'bg-gray-700'} hover:bg-green-700`}
            onClick={() => setFilterPaid('paid')}
          >
            PAID
          </button>
          <button
            className={`text-2xl font-extrabold px-6 py-4 rounded-xl transition-all ${filterPaid === 'unpaid' ? 'bg-red-600' : 'bg-gray-700'} hover:bg-red-700`}
            onClick={() => setFilterPaid('unpaid')}
          >
            UNPAID
          </button>
        </div>
        <div className="flex gap-4 mb-4">
          <select
            className="text-2xl px-6 py-4 rounded-xl bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedGroup}
            onChange={e => setSelectedGroup(e.target.value)}
          >
            <option value="">All Groups</option>
            {groupOptions.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="SEARCH STUDENT..."
            className="text-2xl px-6 py-4 rounded-xl bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="max-w-4xl mx-auto">
        {data.length === 0 ? (
          <div className="text-2xl text-center text-gray-300">No fee data available.</div>
        ) : (
          data.map(user => (
            <div key={user.userID} className="mb-10">
              <h2 className="text-3xl font-bold mb-4">{user.userName}</h2>
              {user.groups
                .filter(g => !selectedGroup || g.groupName === selectedGroup)
                .map(group => (
                  <div key={group.groupName} className="mb-6">
                    <h3 className="text-2xl font-semibold mb-2">Group: {group.groupName}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {group.entries
                        .filter(entry => entry.entryName.toLowerCase().includes(search.toLowerCase()))
                        .map(entry => (
                          <div key={entry.entryName} className="bg-gray-800 rounded-lg p-6 shadow-lg">
                            <div className="text-2xl font-bold mb-2">{entry.entryName}</div>
                            <div className="flex gap-2 flex-wrap justify-center">
                              {MONTHS.map((month, idx) => (
                                <div key={month} className="flex flex-col items-center">
                                  <span className="text-lg font-bold mb-1">{month.slice(0,3)}</span>
                                  <span className={`w-10 h-10 flex items-center justify-center rounded-full text-2xl font-bold ${entry.monthlyPaymentStatus[idx+1] ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                    {entry.monthlyPaymentStatus[idx+1] ? '✓' : '✗'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          ))
        )}
      </div>
    </main>
  );
}
