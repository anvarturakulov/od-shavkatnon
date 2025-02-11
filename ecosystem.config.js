module.exports = {
  apps : [{
    name: "sh-backend",
    script: "node",
    cwd: "./backend/dist/main.js",
    watch: true,
    env: {
      NODE_ENV: "production",
    }
  },
  {
    name: "sh-frontend",
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