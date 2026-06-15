import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function Organizations() {
  const [organizations, setOrganizations] = useState([]);
  const [name, setName] = useState("");

  const getOrganizations = async () => {
    const res = await api.get("/organizations");
    setOrganizations(res.data.data || res.data.organizations || []);
    console.log(res.data);
  };

  const createOrganization = async (e) => {
    e.preventDefault();

    const res = await api.post("/organizations", {
      name,
    });

    console.log(res.data);

    setName("");

    getOrganizations();
  };

  useEffect(() => {
    getOrganizations();
  }, []);

  return (
    <div>
      <Navbar />
      <h1>Organizations</h1>

      <form onSubmit={createOrganization}>
        <input placeholder="Organization name" value={name} onChange={(e) => setName(e.target.value)} />
        <button>Create</button>
      </form>

      {organizations.map((org) => (
        <div key={org.id}>
          <h3>{org.name}</h3>
          <p>{org.slug}</p>
          <p>{org.id}</p>
        </div>
      ))}
    </div>
  );
}