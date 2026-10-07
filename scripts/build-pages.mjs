import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const result = spawnSync(process.execPath, [
  'node_modules/expo/bin/cli', 'export', '--platform', 'web',
  '--output-dir', 'dist-pages', '--max-workers', '2',
], { stdio: 'inherit', env: { ...process.env, APP_BASE_PATH: '/football-party' } });

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
writeFileSync('dist-pages/.nojekyll', '');
