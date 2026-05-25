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

async function notifyChanges() {
  try {
    const git = '"C:\\Program Files\\Git\\cmd\\git.exe"';
    const status = await run(`${git} status --porcelain`);
    if (!status.stdout || status.stdout.trim() === '') {
      console.log(new Date().toISOString(), 'No changes detected.');
      return;
    }
    console.log(new Date().toISOString(), 'Changes detected — NOT committing automatically.');
    console.log('--- git status --porcelain output ---');
    process.stdout.write(status.stdout);
    console.log('--- Suggested commands ---');
    console.log(`${git} add -A`);
    console.log(`${git} commit -m "your message"`);
    console.log(`${git} push origin main`);
  } catch (e) {
    console.error('notifyChanges error', e.message || e);
  }
}

async function commitOnly() {
  try {
    const git = '"C:\\Program Files\\Git\\cmd\\git.exe"';
    const status = await run(`${git} status --porcelain`);
    if (!status.stdout || status.stdout.trim() === '') {
      console.log(new Date().toISOString(), 'No changes to commit.');
      return;
    }
    await run(`${git} add -A`);
    const msg = `Auto commit: ${new Date().toISOString()}`;
    await run(`${git} commit -m "${msg}" || true`);
    console.log(new Date().toISOString(), 'Committed changes locally.');
  } catch (e) {
    console.error('commitOnly error', e.message || e);
  }
}

async function commitAndPush() {
  try {
    const git = '"C:\\Program Files\\Git\\cmd\\git.exe"';
    const status = await run(`${git} status --porcelain`);
    if (!status.stdout || status.stdout.trim() === '') {
      console.log(new Date().toISOString(), 'No changes to commit.');
      return;
    }
    await run(`${git} add -A`);
    const msg = `Auto commit & push: ${new Date().toISOString()}`;
    await run(`${git} commit -m "${msg}" || true`);
    await run(`${git} push origin main`);
    console.log(new Date().toISOString(), 'Committed and pushed changes.');
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

const modeArg = process.argv.find(a => a.startsWith('--mode='));
const mode = (modeArg && modeArg.split('=')[1]) || process.env.WATCH_MODE || 'notify';

console.log('watch-and-push mode:', mode);

watcher.on('all', (event, path) => {
  console.log(new Date().toISOString(), event, path);
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(() => {
    if (mode === 'commit') return commitOnly();
    if (mode === 'push') return commitAndPush();
    return notifyChanges();
  }, debounceMs);
});

console.log('watch-and-push running — watching', paths.join(', '));
