import { useEffect, useState } from "react";
import { listHomes } from "../api/adminApi";


export default function Homes() {
  const [homes, setHomes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    listHomes()
      .then(res => setHomes(res.items || []))
      .catch(e => setError(e.message));
  }, []);

  if (error) return <pre>Error: {error}</pre>;
  if (!homes.length) return <div>Loading…</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Homes</h2>
      <select
        onChange={e => localStorage.setItem("selectedHomeId", e.target.value)}
      >
        <option value="">Select home</option>
        {homes.map(h => (
          <option key={h.homeId.S} value={h.homeId.S}>
            {h.homeName.S}
          </option>
        ))}
      </select>
    </div>
  );
}
