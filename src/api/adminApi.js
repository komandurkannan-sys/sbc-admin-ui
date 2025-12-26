const BASE_URL = "https://clrhkahumi.execute-api.eu-west-1.amazonaws.com/dev";

export async function listHomes() {
  const res = await fetch(`${BASE_URL}/admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "listHomes" })
  });
  return res.json();
}
