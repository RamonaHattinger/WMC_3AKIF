import { Hono } from "hono";

const api = new Hono();

const WISHLIST_FILE = "./wishlist.json";
const LIBRARY_FILE = "./library.json";

//  Hilfsfunktionen lokal
async function loadData(path) {
  try {
    const data = await Deno.readTextFile(path);
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveData(path, data) {
  await Deno.writeTextFile(path, JSON.stringify(data, null, 2));
}


//  Wishlist API

api.get("/wishlist", async (c) => {
  const data = await loadData(WISHLIST_FILE);
  return c.json(data);
});

api.post("/wishlist", async (c) => {
  const item = await c.req.json();
  const data = await loadData(WISHLIST_FILE);
  data.push(item);
  await saveData(WISHLIST_FILE, data);
  return c.json({ ok: true });
});

api.delete("/wishlist/:index", async (c) => {
  const index = Number(c.req.param("index"));
  const data = await loadData(WISHLIST_FILE);
  data.splice(index, 1);
  await saveData(WISHLIST_FILE, data);
  return c.json({ ok: true });
});

api.post("/wishlist-reset", async (c) => {
  await saveData(WISHLIST_FILE, []);
  return c.json({ ok: true });
});


// Library API

api.get("/library", async (c) => {
  const data = await loadData(LIBRARY_FILE);
  return c.json(data);
});

api.post("/library", async (c) => {
  const item = await c.req.json();
  const data = await loadData(LIBRARY_FILE);
  data.push(item);
  await saveData(LIBRARY_FILE, data);
  return c.json({ ok: true });
});

api.delete("/library/:index", async (c) => {
  const index = Number(c.req.param("index"));
  const data = await loadData(LIBRARY_FILE);
  data.splice(index, 1);
  await saveData(LIBRARY_FILE, data);
  return c.json({ ok: true });
});

api.post("/library-reset", async (c) => {
  await saveData(LIBRARY_FILE, []);
  return c.json({ ok: true });
});

export default api;
