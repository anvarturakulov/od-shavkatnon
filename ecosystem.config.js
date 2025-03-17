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
      script: "npm",
      args: "start",
      cwd: "/home/anvar/od/od-shavkatnon/frontend",
      env: {
        NODE_ENV: "production"
      }
    }
  ],
};