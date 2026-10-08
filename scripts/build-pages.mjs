import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const result = spawnSync(process.execPath, [
  'node_modules/expo/bin/cli', 'export', '--platform', 'web',
  '--output-dir', 'dist-pages', '--max-workers', '2',
], { stdio: 'inherit', env: { ...process.env, APP_BASE_PATH: '/football-party' } });

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
writeFileSync('dist-pages/.nojekyll', '');
const html = readFileSync('dist-pages/index.html', 'utf8')
  .replace('<html lang="en">', '<html lang="de">')
  .replace('</head>', '<meta name="theme-color" content="#080A10"/><style>html,body,#root{background:#080A10;color:#F6F7FB}</style></head>')
  .replace('You need to enable JavaScript to run this app.', 'Bitte JavaScript aktivieren, um Footy Party zu spielen.');
writeFileSync('dist-pages/index.html', html);
