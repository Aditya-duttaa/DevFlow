export default function OrganizationCard({
  organization,
  onOpen,
}) {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-bold">
        {organization.name}
      </h2>

      <p className="text-gray-500 mt-3">
        {organization.description}
      </p>

      <p className="mt-4 text-sm text-gray-500">
        Members :
        {" "}
        {organization.members.length}
      </p>

      <button
        onClick={() => onOpen(organization)}
        className="mt-6 bg-indigo-600 text-white px-5 py-2 rounded-lg"
      >
        Open
      </button>

    </div>
  );
}