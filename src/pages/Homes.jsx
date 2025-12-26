import { useEffect, useState } from "react";
import { listHomes } from "../api/adminApi";

export default function Homes() {
  const [homes, setHomes] = useState([]);
  const [selected, setSelected] = useState(null);
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
      <ul>
        {homes.map(h => {
          const homeId = h.homeId?.S;
          const name = h.homeName?.S;
          return (
            <li key={homeId}>
              <button onClick={() => setSelected(homeId)}>
                {name}
              </button>
            </li>
          );
        })}
      </ul>

      {selected && (
        <pre>
          Selected homeId:
          {"\n"}{selected}
        </pre>
      )}
    </div>
  );
}
