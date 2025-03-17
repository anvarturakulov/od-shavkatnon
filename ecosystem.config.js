module.exports = {
  apps : [
    {
      name: "sh-backend",
      script: "dist/main.js",
      cwd: "backend",
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