import { useMemo, useState } from "react";

export default function MemberPicker({
  members = [],
  selectedMemberId = "",
  onSelect,
  label = "Assignee",
  emptyLabel = "Unassigned",
}) {
  const [search, setSearch] = useState("");

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return members;

    return members.filter((member) => {
      const name = member.user?.name ?? "";
      const email = member.user?.email ?? "";
      const role = member.role ?? "";

      return `${name} ${email} ${role}`
        .toLowerCase()
        .includes(query);
    });
  }, [members, search]);

  const selectedMember =
    members.find((member) => member.id === selectedMemberId) ||
    null;

  return (
    <div>
      <label className="font-semibold block mb-2">
        {label}
      </label>

      <div className="mb-3 rounded-lg bg-slate-50 px-4 py-3 text-sm">
        <span className="text-gray-500">Selected: </span>
        <span className="font-medium">
          {selectedMember?.user?.name ?? emptyLabel}
        </span>
      </div>

      <input
        className="border rounded-lg p-3 w-full mb-3"
        placeholder="Search members by name, email, or role"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="border rounded-lg bg-white max-h-56 overflow-y-auto">
        <button
          type="button"
          onClick={() => onSelect("")}
          className={`w-full text-left px-4 py-3 border-b ${
            !selectedMemberId
              ? "bg-indigo-50 text-indigo-700"
              : "hover:bg-slate-50"
          }`}
        >
          {emptyLabel}
        </button>

        {filteredMembers.length === 0 ? (
          <div className="px-4 py-3 text-gray-500">
            No members found
          </div>
        ) : (
          filteredMembers.map((member) => (
            <button
              key={member.id}
              type="button"
              onClick={() => onSelect(member.id)}
              className={`w-full text-left px-4 py-3 border-b last:border-b-0 ${
                selectedMemberId === member.id
                  ? "bg-indigo-50 text-indigo-700"
                  : "hover:bg-slate-50"
              }`}
            >
              <span className="font-medium block">
                {member.user?.name ?? "Unknown"}
              </span>
              <span className="text-sm text-gray-500">
                {member.user?.email ?? "No email"} - {member.role}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
