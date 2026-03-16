// PM2 Ecosystem File
// Usage:
//   pm2 start pipeline/ecosystem.config.cjs
//   pm2 logs aurigen-pipeline
//   pm2 stop aurigen-pipeline

module.exports = {
  apps: [
    {
      name: "aurigen-pipeline",
      script: "pipeline/orchestrator.js",
      args: "--loop",
      cwd: process.env.HOME + "/aurigen-directory",
      node_args: "--experimental-vm-modules",
      env: {
        NODE_ENV: "production",
        // Set your API key here or via shell env
        // ANTHROPIC_API_KEY: "sk-ant-..."
      },
      // Restart policy
      autorestart: true,
      max_restarts: 10,
      restart_delay: 30000, // 30s between restarts

      // Logging
      log_file: "pipeline/logs/pm2-combined.log",
      out_file: "pipeline/logs/pm2-out.log",
      error_file: "pipeline/logs/pm2-error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      merge_logs: true,

      // Memory guard — restart if pipeline leaks past 512MB
      max_memory_restart: "512M",
    },
  ],
};
