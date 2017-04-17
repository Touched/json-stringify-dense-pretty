#!/usr/bin/env node

import stringify from './';

let stdin = '';

process.stdin.resume();
process.stdin.on('data', (data) => {
  stdin += data;
});
process.stdin.on('end', () => process.stdout.write(stringify(JSON.parse(stdin))));
