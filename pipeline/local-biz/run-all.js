const { execFileSync } = require('child_process');
const path = require('path');

const niche = process.argv[2];
const city = process.argv[3];

if (!niche || !city) {
  console.error('Usage: node run-all.js "<niche>" "<city state>"');
  console.error('Example: node run-all.js "plumber" "Salt Lake City UT"');
  process.exit(1);
}

const steps = [
  { name: 'Scraper', cmd: 'node', args: ['scraper.js', niche, city] },
  { name: 'Generator', cmd: 'node', args: ['generator.js'] },
  { name: 'Deployer', cmd: 'node', args: ['deployer.js'] },
  { name: 'Approver', cmd: 'node', args: ['approver.js'] }
];

console.log(`\n=== LOCAL BIZ PIPELINE ===`);
console.log(`Niche: ${niche}`);
console.log(`City:  ${city}\n`);

for (let i = 0; i < steps.length; i++) {
  const step = steps[i];
  const label = `[${i + 1}/${steps.length}] ${step.name}`;

  console.log(`${label}: starting...`);
  const start = Date.now();

  try {
    execFileSync(step.cmd, step.args, {
      cwd: __dirname,
      stdio: 'inherit',
      env: process.env
    });
  } catch (err) {
    const code = err.status || 1;
    console.error(`\n${label}: FAILED (exit code ${code})`);
    process.exit(code);
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`${label}: done (${elapsed}s)\n`);
}

console.log('=== PIPELINE COMPLETE ===\n');
