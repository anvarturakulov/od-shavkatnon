module.exports = {
  apps : [{
      name: "sh-backend",
      script: "main.js",
      cwd: "./backend/dist",
      watch: true,
      env: {
        NODE_ENV: "production",
      },
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