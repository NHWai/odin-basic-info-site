const http = require("node:http");
const path = require("node:path");
const fs = require("node:fs/promises");
const PORT = process.env.PORT || 8080;

async function readFile(path) {
  try {
    const data = await fs.readFile(path);
    return data;
  } catch (error) {
    console.error("error read file", error.errno);
    return error.errno;
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === "GET") {
    let filePath, bufferData;
    switch (req.url) {
      case "/":
        try {
          const filePath = path.join(__dirname, "public", "index.html");
          const bufferData = await readFile(filePath);
          if (typeof bufferData === "number") {
            throw bufferData;
          }
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(bufferData);
          res.end();
        } catch (error) {
          filePath = path.join(__dirname, "public", "404.html");
          bufferData = await readFile(filePath);
          res.writeHead(404, { "Content-Type": "text/html" });
          res.write(bufferData);
          res.end();
        }
        break;
      case req.url:
        try {
          const filePath = path.join(
            __dirname,
            "public",
            `${req.url.slice(1)}.html`
          );
          const bufferData = await readFile(filePath);
          if (typeof bufferData === "number") {
            throw bufferData;
          }
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(bufferData);
          res.end();
        } catch (error) {
          filePath = path.join(__dirname, "public", "404.html");
          bufferData = await readFile(filePath);
          res.writeHead(404, { "Content-Type": "text/html" });
          res.write(bufferData);
          res.end();
        }

      default:
        filePath = path.join(__dirname, "public", "404.html");
        bufferData = await readFile(filePath);
        res.writeHead(404, { "Content-Type": "text/html" });
        res.write(bufferData);
        res.end();

        break;
    }
  }
});

server.listen(PORT, () => console.log("server is running on port, ", PORT));
