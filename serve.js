// Multi-use
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { print } from "./lib/utility.js";

// Hono Server
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger"; // Middleware
import { wrapper } from "./lib/wrapper.js";

// Initialization
const app = new Hono(),
cwd = dirname(fileURLToPath(import.meta.url)),
reservedPaths = [
  "cdn",
  "web",
  "src"
];

// Definitions
function isReserved (path,routes) {
  for (let i = routes.length;i;--i) {
    if (path.startsWith(`/${routes[i - 1]}`)) return false;
  }
  return true;
}

// Routes
app.get(
  "/cdn/*",
  serveStatic({
    root: "./nav",
    rewriteRequestPath: (path) => path.replace(/^\/cdn\/([^\/]+)\/(.+)$/, "/$1/media/$2")
  })
);

app.get(
  "/web/*",
  serveStatic({
    root: "./nav",
    rewriteRequestPath: (path) => path.replace(/^\/web\/(\/?.+)?$/, "/$1")
  })
);

app.get(
  "/src/*",
  serveStatic({
    root: "./dploy",
    rewriteRequestPath: (path) => path.replace(/^\/src\/(\/?.+)?$/, "/$1")
  })
);


// Serve static files for non-reserved paths
app.use("*", async (c, next) => {
  if (isReserved(c.req.path, reservedPaths)) {
    const cmd = Bun.spawn(["bun", "build.js"],
    {
      env: {
      ...process.env,
      PATH: `${process.env.PATH}:/root/.bun/bin/`
    },
      stdin: "inherit",
      stdout: "inherit"
    });
    await cmd.exited;
    return await serveStatic({ 
      root: "./nav/",
      index: "index.html"
    })(c, next);
  }
  await next();
});

export default { 
  port: 3000, 
  fetch: app.fetch, 
} 
print(`Running on http://127.0.0.1:3000`);