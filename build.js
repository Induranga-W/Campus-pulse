import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('Building NSBM NewsDesk...');

execSync('python3 package_zip.py', { stdio: 'inherit' });

const dist = path.resolve('dist');
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

const files = [
  'index.html', 'news.html', 'pulse.html', 'submit.html',
  'login.html', 'register.html', 'profile.html', 'bookmarks.html',
  'README.txt', 'data.php'
];

const folders = ['admin', 'css', 'js', 'backend', 'database', 'images'];

for (const file of files) {
  fs.copyFileSync(file, path.join(dist, file));
}

function copyFolder(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const item of fs.readdirSync(from, { withFileTypes: true })) {
    const source = path.join(from, item.name);
    const target = path.join(to, item.name);
    if (item.isDirectory()) copyFolder(source, target);
    else fs.copyFileSync(source, target);
  }
}

for (const folder of folders) {
  copyFolder(folder, path.join(dist, folder));
}

console.log('Build complete. Files are in dist/.');
