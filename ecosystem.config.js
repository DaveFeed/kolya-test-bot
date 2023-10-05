// This is an example config for pm2

module.exports = {
  apps : [{
    name: "kolya-tests-bot",
    script: 'npm',
    args: 'run start',
    // cwd: "/path/to/dir",
    max_memory_restart: "500M",
    exec_mode : "fork",
    kill_timeout : 4000,
    wait_ready: true,
    autorestart: true,
    watch: false,

    out_file: "./logs/out.log",
    error_file: "./logs/error.log",
    merge_logs: true,
  }],
};
