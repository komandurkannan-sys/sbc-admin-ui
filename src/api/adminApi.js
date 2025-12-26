const BASE_URL = "https://clrhkahumi.execute-api.eu-west-1.amazonaws.com/dev";

export async function listHomes() {
  const res = await fetch(`${BASE_URL}/admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "listHomes" })
  });
  return res.json();
}

export async function listDevices(homeId) {
  const res = await fetch(`${BASE_URL}/admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "listDevices", homeId })
  });
  return res.json();
}

export async function syncDevices(homeId) {
  const res = await fetch(`${BASE_URL}/admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "syncDevices", homeId })
  });
  return res.json();
}

export async function listUsers() {
  const res = await fetch(`${BASE_URL}/admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "listUsers" })
  });
  return res.json();
}

export async function setPermissions(payload) {
  const res = await fetch(`${BASE_URL}/admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "setPermissions", ...payload })
  });
  return res.json();
}
