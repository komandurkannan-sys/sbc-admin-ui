import { useEffect, useState } from "react";
import { listHomes } from "../api/adminApi";

export default function Users() {
  const [homes, setHomes] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    userId: "",
    userName: "",
    role: "MEMBER",
    homeId: ""
  });

  useEffect(() => {
    listHomes().then(r => setHomes(r.items || []));
  }, []);

  const addUser = () => {
    if (!form.userId || !form.userName || !form.homeId) {
      alert("All fields are required");
      return;
    }
    setUsers([...users, form]);
    setForm({ userId: "", userName: "", role: "MEMBER", homeId: "" });
  };

  return (
    <div style={{ padding: 16, maxWidth: 600 }}>
      <h2>Users</h2>

      <label>
        <strong>User ID</strong>
        <div style={{ fontSize: 12, color: "#666" }}>
          Amazon / Alexa generated userId (e.g. amzn1.ask.account.…)
        </div>
        <input
          style={{ width: "100%" }}
          value={form.userId}
          onChange={e => setForm({ ...form, userId: e.target.value })}
          placeholder="amzn1.ask.account.…"
        />
      </label>

      <br /><br />

      <label>
        <strong>User Name</strong>
        <div style={{ fontSize: 12, color: "#666" }}>
          Friendly name for admin reference only
        </div>
        <input
          style={{ width: "100%" }}
          value={form.userName}
          onChange={e => setForm({ ...form, userName: e.target.value })}
          placeholder="Kannan / Guest / Child"
        />
      </label>

      <br /><br />

      <label>
        <strong>Role</strong>
        <div style={{ fontSize: 12, color: "#666" }}>
          OWNER = full access, MEMBER = restricted by permissions
        </div>
        <select
          style={{ width: "100%" }}
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
        >
          <option value="OWNER">OWNER</option>
          <option value="MEMBER">MEMBER</option>
        </select>
      </label>

      <br /><br />

      <label>
        <strong>Home</strong>
        <div style={{ fontSize: 12, color: "#666" }}>
          Home this user belongs to
        </div>
        <select
          style={{ width: "100%" }}
          value={form.homeId}
          onChange={e => setForm({ ...form, homeId: e.target.value })}
        >
          <option value="">Select home</option>
          {homes.map(h => (
            <option key={h.homeId.S} value={h.homeId.S}>
              {h.homeName.S}
            </option>
          ))}
        </select>
      </label>

      <br /><br />

      <button onClick={addUser}>Add User</button>

      <hr />

      <ul>
        {users.map((u, i) => (
          <li key={i}>
            {u.userName} — {u.role}
          </li>
        ))}
      </ul>
    </div>
  );
}
