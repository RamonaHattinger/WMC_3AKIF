import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import api from "./apis.js"; // <-- neue Auslagerung

const app = new Hono();

app.route("/api", api); // alle API-Routen unter /api

app.get("/", serveStatic({ path: "./static/index.html" }));
app.get("*", serveStatic({ root: "./static" }));

Deno.serve({ port: 8000 }, app.fetch);
