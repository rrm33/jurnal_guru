import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf8');

const target = `    if (typeof PORT === "string" && PORT.startsWith("/")) {
      // Passenger socket
      app.listen(PORT, async () => {
        console.log(\`Server Jurnal Guru running on Passenger socket \${PORT}\`);
        try {
          await initDbTables();
        } catch (err) {
          console.error("Database init error:", err);
        }
      });
    } else {
      app.listen(Number(PORT), "0.0.0.0", async () => {
        console.log(\`Server Jurnal Guru running on port \${PORT}\`);
        try {
          await initDbTables();
        } catch (err) {
          console.error("Database init error:", err);
        }
      });
    }`;

const replacement = `    app.listen(PORT, async () => {
      console.log(\`Server Jurnal Guru running on port/socket \${PORT}\`);
      try {
        await initDbTables();
      } catch (err) {
        console.error("Database init error:", err);
      }
    });`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync('server.ts', content);
    console.log("Success");
} else {
    console.log("Failed to find target block");
}
