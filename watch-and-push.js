#!/usr/bin/env node
const { exec } = require('child_process');
const chokidar = require('chokidar');

const debounceMs = 1200;
let timeout = null;

function run(cmd) {
  return new Promise((resolve) => {
    exec(cmd, { cwd: process.cwd() }, (err, stdout, stderr) => {
      if (err) {
        console.error(cmd, 'failed:', err.message);
      }
      if (stdout) process.stdout.write(stdout);
      if (stderr) process.stderr.write(stderr);
      resolve({ err, stdout, stderr });
    });
  });
}

async function commitAndPush() {
  try {
    const status = await run('git status --porcelain');
    if (!status.stdout || status.stdout.trim() === '') {
      console.log(new Date().toISOString(), 'No changes to commit.');
      return;
    }
    await run('git add -A');
    const msg = `Auto update: ${new Date().toISOString()}`;
    await run(`git commit -m "${msg}" || true`);
    await run('git push origin main');
    console.log(new Date().toISOString(), 'Pushed changes.');
  } catch (e) {
    console.error('commitAndPush error', e.message || e);
  }
}

const paths = ['src', 'public', 'package.json', 'README.md'];
const watcher = chokidar.watch(paths, {
  ignored: /(^|[\/\\])\.git|node_modules|dist/,
  persistent: true,
  ignoreInitial: true,
});

watcher.on('all', (event, path) => {
  console.log(new Date().toISOString(), event, path);
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(() => {
    commitAndPush();
  }, debounceMs);
});

console.log('watch-and-push running — watching', paths.join(', '));
