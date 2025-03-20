module.exports = {
  apps : [
    {
      name: "sh-backend",
      script: "dist/main.js",
      // instances: 8,             // Количество экземпляров (аналог -i 8)
      // exec_mode: "cluster",
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
    interpreter: "/home/anvar/.nvm/versions/node/v18.20.0/bin/node",
    cwd: "./frontend/app",
    watch: true,
    env: {
      NODE_ENV: "production",
    }
  }
]
};