module.exports = {
  apps : [{
    name: "shavkatnon-backend",
    script: "node",
    cwd: "./backend/dist/main.js",
    watch: true,
    env: {
      NODE_ENV: "production",
    }
  },
  {
    name: "shavkatnon-frontend",
    script: "npm",
    args: "start",
    cwd: "./frontend/app",
    watch: true,
    env: {
      NODE_ENV: "production",
    }
  }
]
};