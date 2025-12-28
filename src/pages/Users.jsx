import { useEffect, useState } from "react";
import { listHomes, listUsers, upsertUser, deleteUser } from "../api/adminApi";

export default function Users() {
  const [homes, setHomes] = useState([]);
  const [homeId, setHomeId] = useState("");
  const [users, setUsers] = useState([]);

  const [editing, setEditing] = useState(null); // user being edited

  const [form, setForm] = useState({
    user_code: "",
    personId: "",
    personName: "",
    role: "MEMBER"
  });

  const val = v => (v && v.S) || "";

  useEffect(() => {
    listHomes().then(r => setHomes(r.items || []));
  }, []);

  useEffect(() => {
    if (!homeId) {
      setUsers([]);
      return;
    }
    refreshUsers();
  }, [homeId]);

  function refreshUsers() {
    listUsers(homeId).then(r => {
      console.log("TEMPLOG listUsers raw:", r.items);
      setUsers(r.items || []);
    });
  }

  function startEdit(u) {
    setEditing(u);
    setForm({
      user_code: val(u.user_code),
      personId: val(u.personId),
      personName: val(u.personName),
      role: val(u.role) || "MEMBER"
    });
  }

  function resetForm() {
    setEditing(null);
    setForm({
      user_code: "",
      personId: "",
      personName: "",
      role: "MEMBER"
    });
  }

  async function saveUser() {
    if (!form.personId || !form.personName || !homeId) {
      alert("All fields required");
      return;
    }

    const r = await upsertUser({
      homeId,
      user_code: form.user_code,   // REQUIRED for update
      personId: form.personId,
      personName: form.personName,
      role: form.role              // REQUIRED always
    });



    if (!r.ok) {
      alert(r.error);
      return;
    }

    resetForm();
    refreshUsers();
  }

  async function removeUser(u) {
    if (val(u.role) === "OWNER") {
      alert("OWNER cannot be deleted");
      return;
    }

    if (!confirm("Delete this user?")) return;

    await deleteUser({
      homeId,
      personId: val(u.personId)
    });

    refreshUsers();
  }

  return (
    <div style={{ padding: 16, maxWidth: 700 }}>
      <h2>Users</h2>

      {/* Home */}
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

      <hr />

      {/* Form */}
      <label>
        <strong>User Name</strong>
        <input
          style={{ width: "100%" }}
          value={form.personName}
          onChange={e => setForm({ ...form, personName: e.target.value })}
        />
      </label>

      <br /><br />

      <label>
        <strong>Alexa personId</strong>
        <div style={{ fontSize: 12, color: "#777" }}>
          Editable in case voice profile changes
        </div>
        <input
          style={{ width: "100%" }}
          value={form.personId}
          readOnly={!!editing}
          onChange={e =>
            !editing && setForm({ ...form, personId: e.target.value })
          }
        />
        {editing && (
          <div style={{ fontSize: 12, color: "#888" }}>
            personId cannot be changed
          </div>
        )}

      </label>

      <br /><br />

      <label>
        <strong>Role</strong>
        <select
          style={{ width: "100%" }}
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
        >
          <option value="OWNER">OWNER</option>
          <option value="ADMIN">ADMIN</option>
          <option value="MEMBER">MEMBER</option>
        </select>
      </label>

      <br /><br />

      {editing && (
        <div style={{ fontSize: 12, color: "#888" }}>
          user_code: {form.user_code}
        </div>
      )}

      <br />

      <button onClick={saveUser} disabled={!homeId}>
        {editing ? "Update User" : "Add MEMBER"}
      </button>

      {editing && (
        <button style={{ marginLeft: 8 }} onClick={resetForm}>
          Cancel
        </button>
      )}

      <hr />

      {/* User list */}
      <ul>
        {users
          .filter(u => val(u.personId) !== "__TABLE__")
          .map(u => (
            <li key={val(u.user_code)} style={{ marginBottom: 12 }}>
              <div>
                <strong>{val(u.personName)}</strong> ({val(u.role)})
              </div>
              <div style={{ fontSize: 12, color: "#888" }}>
                user_code: {val(u.user_code)}
              </div>

              <button onClick={() => startEdit(u)}>Edit</button>

              {val(u.role) !== "OWNER" && (
                <button
                  style={{ marginLeft: 8 }}
                  onClick={() => removeUser(u)}
                >
                  Delete
                </button>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}
