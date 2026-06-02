import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Global parsed rules
  app.use(express.json());

  let vite: any = null;
  if (process.env.NODE_ENV !== "production") {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
  }

  // Intercept collection routes beautifully (registered before Vite / static middlewares)
  app.get(["/collect/:username", "/collect/:username/"], async (req, res, next) => {
    try {
      const collectHtmlPath = path.resolve(process.cwd(), "collect.html");
      if (process.env.NODE_ENV !== "production") {
        let template = fs.readFileSync(collectHtmlPath, "utf-8");
        template = await vite.transformIndexHtml(req.originalUrl || req.url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } else {
        res.sendFile(path.join(process.cwd(), "dist", "collect.html"));
      }
    } catch (err) {
      next(err);
    }
  });

  // Clean URLs routing handler (registered before Vite / static middlewares)
  app.use(async (req, res, next) => {
    const urlPath = req.path;
    
    // Ignore files with extensions (e.g. .css, .js, .png), except .html
    const ext = path.extname(urlPath);
    if (ext && ext.toLowerCase() !== ".html" && ext.toLowerCase() !== ".htm") {
      return next();
    }

    if (urlPath === "/" || urlPath === "/index" || urlPath === "/index.html") {
      return serveHtmlFile(req, res, "index.html", vite, next);
    }
    
    const matchedFiles = [
      "login", "signup", "dashboard", "profile", "collect", 
      "minimal-auth-test", "supabase-test"
    ];
    
    const cleanName = urlPath.replace(/^\//, "").replace(/\.html$/, "");
    if (matchedFiles.includes(cleanName)) {
      return serveHtmlFile(req, res, `${cleanName}.html`, vite, next);
    }
    
    next();
  });

  // Setup Vite middleware in dev or static public file hosting in production AFTER custom paths are matched
  if (process.env.NODE_ENV !== "production") {
    if (vite) {
      app.use(vite.middlewares);
    }
  } else {
    // Serve static files in dist first
    app.use(express.static(path.join(process.cwd(), "dist"), {
      index: false,
    }));
  }

  // Fallback catch-all for routing to SPA
  app.get("*", async (req, res, next) => {
    const ext = path.extname(req.path);
    // If it asks for a static asset that wasn't found, let it 404 (excluding .html files)
    if (req.path.startsWith("/src/") || req.path.startsWith("/@") || (ext && ext.toLowerCase() !== ".html" && ext.toLowerCase() !== ".htm")) {
      return next();
    }

    if (process.env.NODE_ENV === "production") {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    } else {
      serveHtmlFile(req, res, "index.html", vite, next);
    }
  });

  async function serveHtmlFile(req: any, res: any, fileName: string, viteInstance: any, next: any) {
    try {
      const filePath = path.resolve(process.cwd(), fileName);
      if (!fs.existsSync(filePath)) {
        return next();
      }
      if (viteInstance) {
        let html = fs.readFileSync(filePath, "utf-8");
        html = await viteInstance.transformIndexHtml(req.originalUrl || req.url, html);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } else {
        const prodFilePath = path.join(process.cwd(), "dist", fileName);
        if (fs.existsSync(prodFilePath)) {
          res.sendFile(prodFilePath);
        } else {
          next();
        }
      }
    } catch (err) {
      next(err);
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Production-ready controller running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
