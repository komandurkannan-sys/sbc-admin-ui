const BASE_URL = "https://clrhkahumi.execute-api.eu-west-1.amazonaws.com/dev";

async function post(body) {
  const res = await fetch(`${BASE_URL}/admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    return { ok: false, error: text };
  }
}

export function listHomes() {
  return post({ action: "listHomes" });
}

export function listDevices(homeId) {
  return post({ action: "listDevices", homeId });
}

export function syncDevices(homeId) {
  return post({ action: "syncDevices", homeId });
}

export function listUsers(homeId) {
  return post({ action: "listUsers", homeId });
}

export function upsertUser(payload) {
  return post({ action: "upsertUser", ...payload, create: true });
}

export function setPermissions(payload) {
  return post({ action: "setPermissions", ...payload });
}
