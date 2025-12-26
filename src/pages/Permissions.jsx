import { useEffect, useState } from "react";
import { listUsers, listHomes, listDevices, setPermissions } from "../api/adminApi";

export default function Permissions() {
  const [users, setUsers] = useState([]);
  const [homes, setHomes] = useState([]);
  const [devices, setDevices] = useState([]);
  const [userId, setUserId] = useState("");
  const [homeId, setHomeId] = useState("");
  const [selected, setSelected] = useState(new Set());

  useEffect(() => {
    listUsers().then(r => setUsers(r.items || []));
    listHomes().then(r => setHomes(r.items || []));
  }, []);

  useEffect(() => {
    if (!homeId) return;
    listDevices(homeId).then(r => setDevices(r.items || []));
    setSelected(new Set());
  }, [homeId]);

  const toggle = (id) => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };

  const save = async () => {
    await setPermissions({
      userId,
      homeId,
      deviceIds: [...selected]
    });
    alert("Saved");
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Permissions</h2>

      <select onChange={e => setUserId(e.target.value)}>
        <option value="">Select user</option>
        {users.map(u => (
          <option key={u.userId.S} value={u.userId.S}>
            {u.userName?.S || u.userId.S}
          </option>
        ))}
      </select>

      <select onChange={e => setHomeId(e.target.value)}>
        <option value="">Select home</option>
        {homes.map(h => (
          <option key={h.homeId.S} value={h.homeId.S}>
            {h.homeName.S}
          </option>
        ))}
      </select>

      <ul>
        {devices.map(d => (
          <li key={d.deviceId.S}>
            <label>
              <input
                type="checkbox"
                checked={selected.has(d.deviceId.S)}
                onChange={() => toggle(d.deviceId.S)}
              />
              {d.deviceName.S}
            </label>
          </li>
        ))}
      </ul>

      <button disabled={!userId || !homeId} onClick={save}>
        Save
      </button>
    </div>
  );
}
