module.exports = {
  apps: [
    {
      name: "sh-backend",
      script: "main.js",
      cwd: "./backend/dist",
      watch: true,
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "sh-front",
      script: "server.js", // Указать правильный путь
      cwd: "/home/anvar/od/od-shavkatnon/frontend/.next/standalone",
      interpreter: "node", // Указать явно
      env: {
        NODE_ENV: "production"
      }
    }
  ],
};