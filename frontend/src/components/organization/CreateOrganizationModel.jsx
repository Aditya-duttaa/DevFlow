import { useState } from "react";

export default function CreateOrganizationModal({
  onCreate,
}) {
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  function submit(e) {
    e.preventDefault();

    onCreate(form);

    setForm({
      name: "",
      description: "",
    });
  }

  return (
    <form
      onSubmit={submit}
      className="bg-white shadow rounded-xl p-6 mb-8"
    >
      <h2 className="text-xl font-bold mb-4">
        Create Organization
      </h2>

      <input
        className="w-full border rounded-lg p-3 mb-4"
        placeholder="Organization Name"
        value={form.name}
        onChange={(e) =>
          setForm({
            ...form,
            name: e.target.value,
          })
        }
      />

      <textarea
        rows="3"
        className="w-full border rounded-lg p-3 mb-4"
        placeholder="Description"
        value={form.description}
        onChange={(e) =>
          setForm({
            ...form,
            description: e.target.value,
          })
        }
      />

      <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg">
        Create
      </button>
    </form>
  );
}