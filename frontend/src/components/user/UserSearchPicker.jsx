import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { searchUsers } from "../../api/userApi";

export default function UserSearchPicker({
  selectedUser,
  onSelect,
}) {
  const [query, setQuery] = useState("");

  const usersQuery = useQuery({
    queryKey: ["users", "search", query],
    queryFn: () => searchUsers(query),
    enabled: query.trim().length >= 2,
  });

  return (
    <div>
      <label className="font-semibold block mb-2">
        User
      </label>
      <div className="mb-3 rounded-lg bg-slate-50 px-4 py-3 text-sm">
        <span className="text-gray-500">Selected: </span>
        <span className="font-medium">
          {selectedUser
            ? `${selectedUser.name} (${selectedUser.email})`
            : "No user selected"}
        </span>
      </div>
      <input
        className="border rounded-lg p-3 w-full mb-3"
        placeholder="Search users by name or email"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query.trim().length >= 2 && (
        <div className="border rounded-lg bg-white max-h-56 overflow-y-auto">
          {usersQuery.isLoading ? (
            <div className="px-4 py-3 text-gray-500">
              Searching...
            </div>
          ) : (usersQuery.data ?? []).length === 0 ? (
            <div className="px-4 py-3 text-gray-500">
              No users found
            </div>
          ) : (
            usersQuery.data.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => onSelect(user)}
                className="w-full text-left px-4 py-3 border-b last:border-b-0 hover:bg-slate-50"
              >
                <span className="font-medium block">
                  {user.name}
                </span>
                <span className="text-sm text-gray-500">
                  {user.email}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
