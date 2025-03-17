module.exports = {
  apps : [{
    name: "shavkatnon-backend",
    script: "./backend/dist/main.js",
    cwd: "",
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