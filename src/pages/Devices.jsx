import { useEffect, useState } from "react";
import { listDevices, syncDevices } from "../api/adminApi";

export default function Devices() {
  const [homeId] = useState(localStorage.getItem("selectedHomeId") || "");
  const [devices, setDevices] = useState([]);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = () => {
    if (!homeId) return;
    listDevices(homeId)
      .then(r => setDevices(r.items || r))
      .catch(e => setErr(e.message));
  };

  useEffect(load, [homeId]);

  const sync = async () => {
    setBusy(true);
    setErr(null);
    try {
      await syncDevices(homeId);
      load();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Devices</h2>

      {!homeId && <div>Select a home in Homes tab</div>}

      <button onClick={sync} disabled={!homeId || busy}>
        {busy ? "Syncing…" : "Sync devices"}
      </button>

      {err && <pre>Error: {err}</pre>}

      <ul>
        {devices.map(d => (
          <li key={d.deviceId.S}>{d.deviceName.S}</li>
        ))}
      </ul>
    </div>
  );
}
