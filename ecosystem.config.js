module.exports = {
  apps: [
    {
      name: "sh-backend",
      script: "dist/main.js",
      cwd: "/home/anvar/od/od-shavkatnon/backend",
      interpreter: "/home/anvar/.nvm/versions/node/v20.6.0/bin/node", // Замени на точную версию
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "sh-frontend",
      script: "npm",
      args: "start",
      interpreter: "/home/anvar/.nvm/versions/node/v20.6.0/bin/node",
      cwd: "/home/anvar/od/od-shavkatnon/frontend/app",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};