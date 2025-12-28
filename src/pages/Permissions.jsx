import { useEffect, useState } from "react";
import {
  listHomes,
  listUsers,
  listDevices,
  syncDevices,
  setPermissions
} from "../api/adminApi";

// DynamoDB / plain value helper
const val = v => (v && v.S) || v || "";

export default function Permissions() {
  const [homes, setHomes] = useState([]);
  const [homeId, setHomeId] = useState("");

  const [users, setUsers] = useState([]); // MEMBER only
  const [userCode, setUserCode] = useState("");

  const [devices, setDevices] = useState([]);
  const [selected, setSelected] = useState(new Set());

  // load homes once
  useEffect(() => {
    listHomes().then(r => setHomes(r.items || []));
  }, []);

  // load users + devices when home changes
  useEffect(() => {
    if (!homeId) {
      setUsers([]);
      setDevices([]);
      setSelected(new Set());
      return;
    }

    // MEMBER users only
    listUsers(homeId).then(r => {
      const members = (r.items || []).filter(
        u =>
          val(u.role) === "MEMBER" &&
          val(u.user_code) &&
          val(u.personId) !== "__TABLE__"
      );
      setUsers(members);
    });

    refreshDevices(homeId);
  }, [homeId]);

  async function refreshDevices(hid = homeId) {
    if (!hid) return;

    // same behaviour as Devices page
    await syncDevices(hid);
    const r = await listDevices(hid);

    // sort by name
    const sorted = (r.items || []).sort((a, b) =>
      val(a.deviceName).localeCompare(val(b.deviceName))
    );

    setDevices(sorted);
    setSelected(new Set());
  }

  function toggle(deviceId) {
    const next = new Set(selected);
    next.has(deviceId) ? next.delete(deviceId) : next.add(deviceId);
    setSelected(next);
  }

  function selectAll() {
    const all = new Set(devices.map(d => val(d.deviceId)));
    setSelected(all);
  }

  function deselectAll() {
    setSelected(new Set());
  }

  async function save() {
    if (!homeId || !userCode) return;

    await setPermissions({
      homeId,
      user_code: userCode,
      deviceIds: [...selected]
    });

    alert("Permissions saved");
  }

  return (
    <div style={{ padding: 16, maxWidth: 760 }}>
      <h2>Permissions</h2>

      {/* Home */}
      <label>
        <strong>Home</strong>
        <select
          style={{ width: "100%" }}
          value={homeId}
          onChange={e => {
            setHomeId(e.target.value);
            setUserCode("");
          }}
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

      {/* User */}
      <label>
        <strong>User (MEMBER)</strong>
        <select
          style={{ width: "100%" }}
          value={userCode}
          onChange={e => setUserCode(e.target.value)}
          disabled={!homeId}
        >
          <option value="">Select user</option>
          {users.map(u => (
            <option key={val(u.user_code)} value={val(u.user_code)}>
              {val(u.personName)}
            </option>
          ))}
        </select>
      </label>

      <hr />

      {/* Controls */}
      <div style={{ marginBottom: 8 }}>
        <button onClick={selectAll} disabled={!userCode}>
          Select all
        </button>{" "}
        <button onClick={deselectAll} disabled={!userCode}>
          Deselect all
        </button>{" "}
        <button onClick={() => refreshDevices()} disabled={!homeId}>
          Refresh devices
        </button>
      </div>

      {/* Devices */}
      <div>
        <strong>Devices</strong>
        <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>
          Includes devices and scene-switches. Sorted by name.
        </div>

        {devices.map(d => {
          const id = val(d.deviceId);
          return (
            <label key={id} style={{ display: "block", marginBottom: 4 }}>
              <input
                type="checkbox"
                checked={selected.has(id)}
                onChange={() => toggle(id)}
                disabled={!userCode}
              />{" "}
              {val(d.deviceName)}
            </label>
          );
        })}
      </div>

      <br />

      <button onClick={save} disabled={!homeId || !userCode}>
        Save
      </button>
    </div>
  );
}
