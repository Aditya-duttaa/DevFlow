import { useEffect, useState } from "react";
import { Building2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import useWorkspaceStore from "../../store/workspaceStore";
import {
  createOrganization,
  getOrganizations,
} from "../../api/organizationApi";

export default function Organizations() {
  const navigate = useNavigate();
  const { setCurrentOrganization } = useWorkspaceStore();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  async function loadOrganizations() {
    try {
      const res = await getOrganizations();

      setOrganizations(
        res.organizations ||
          res.data ||
          res
      );
    } catch {
      toast.error(
        "Failed to fetch organizations"
      );
    }

    setLoading(false);
  }

  useEffect(() => {
    loadOrganizations();
  }, []);

  async function submit(e) {
    e.preventDefault();

    try {
      await createOrganization(form);

      toast.success(
        "Organization Created"
      );

      setForm({
        name: "",
        description: "",
      });

      setShowModal(false);

      loadOrganizations();
    } catch (err) {
      toast.error(
        err.response?.data?.message
      );
    }
  }

  return (
    <div>

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-3xl font-bold">
            Organizations
          </h1>

          <p className="text-gray-500">
            Manage your workspace
          </p>

        </div>

        <button
          onClick={() =>
            setShowModal(true)
          }
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Organization
        </button>

      </div>

      {loading ? (
        <p>Loading...</p>
      ) : organizations.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-20 text-center">

          <Building2
            size={60}
            className="mx-auto text-gray-400"
          />

          <h2 className="mt-4 text-2xl font-semibold">
            No Organizations
          </h2>

        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">

          {organizations.map((org) => (
            <div
              key={org.id}
              className="bg-white rounded-xl shadow p-6"
            >
              <h2 className="font-bold text-xl">
                {org.name}
              </h2>

              <p className="mt-3 text-gray-500">
                {org.description}
              </p>

<button
  onClick={() => {
    setCurrentOrganization(org);
    navigate("/projects");
  }}
  className="mt-6 w-full rounded-lg bg-indigo-600 py-3 text-white hover:bg-indigo-700"
>
  Open Workspace
</button>
            </div>
          ))}

        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

          <form
            onSubmit={submit}
            className="bg-white rounded-xl p-8 w-[450px]"
          >

            <h2 className="text-2xl font-bold mb-5">
              Create Organization
            </h2>

            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              className="w-full border rounded-lg p-3 mb-4"
            />

            <textarea
              placeholder="Description"
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description:
                    e.target.value,
                })
              }
              className="w-full border rounded-lg p-3"
            />

            <div className="flex justify-end gap-3 mt-6">

              <button
                type="button"
                onClick={() =>
                  setShowModal(false)
                }
                className="border px-5 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button className="bg-indigo-600 text-white px-5 py-2 rounded-lg">
                Create
              </button>

            </div>

          </form>

        </div>
      )}
    </div>
  );
}