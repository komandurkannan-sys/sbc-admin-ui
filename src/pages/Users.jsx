import { useEffect, useState } from "react";
import { listHomes, listUsers, upsertUser } from "../api/adminApi";

export default function Users() {
  const [homes, setHomes] = useState([]);
  const [homeId, setHomeId] = useState("");
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    personId: "",
    personName: ""
  });

  // helper to read DynamoDB attributes
  const val = v => (v && v.S) || "";

  useEffect(() => {
    listHomes().then(r => {
      setHomes(r.items || []);
    });
  }, []);

  useEffect(() => {
    if (!homeId) {
      setUsers([]);
      return;
    }
    listUsers(homeId).then(r => {
      setUsers(r.items || []);
    });
  }, [homeId]);

  async function addUser() {
    if (!form.personId || !form.personName || !homeId) {
      alert("All fields required");
      return;
    }

    const r = await upsertUser({
      homeId,
      personId: form.personId,
      personName: form.personName
    });

    if (!r.ok) {
      alert(r.error);
      return;
    }

    setForm({ personId: "", personName: "" });

    const u = await listUsers(homeId);
    setUsers(u.items || []);
  }

  return (
    <div style={{ padding: 16, maxWidth: 600 }}>
      <h2>Users</h2>

      <label>
        <strong>Home</strong>
        <select
          style={{ width: "100%" }}
          value={homeId}
          onChange={e => setHomeId(e.target.value)}
        >
          <option value="">Select home</option>
          {homes.map(h => (
            <option key={val(h.homeId)} value={val(h.homeId)}>
              {val(h.homeName)}
            </option>
          ))}
        </select>
      </label>

      <br /><br />

      <label>
        <strong>User ID</strong>
        <div style={{ fontSize: 12, color: "#666" }}>
          Alexa personId
        </div>
        <input
          style={{ width: "100%" }}
          value={form.personId}
          onChange={e => setForm({ ...form, personId: e.target.value })}
        />
      </label>

      <br /><br />

      <label>
        <strong>User Name</strong>
        <input
          style={{ width: "100%" }}
          value={form.personName}
          onChange={e => setForm({ ...form, personName: e.target.value })}
        />
      </label>

      <br /><br />

      <button onClick={addUser} disabled={!homeId}>
        Add MEMBER
      </button>

      <hr />

      <ul>
        {users
          .filter(u => val(u.personId) !== "__TABLE__")
          .map((u, i) => (
            <li key={i} style={{ marginBottom: 8 }}>
              <div>{val(u.personName)}</div>
              <div style={{ fontSize: 11, color: "#888" }}>
                {val(u.personId)}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
