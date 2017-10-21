import fs from 'fs';
import path from 'path';

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'package.json'), {encoding: 'utf8'}));

process.title = pkg.name;

function version(status=0) {
  process.stdout.write(`${pkg.version}\n`);
  process.exit(status);
}

function help(status=0) {
  process.stdout.write(`Usage: ${process.title} [<option>...]

This starts the backend server for the URL shortener services

Options:
    --version
        Print version information and exit.
    --help
        Display this help text and exit.
`);
  process.exit(status);
}

try {
  const unparsed = process.argv.slice(2).filter(arg => {
    switch (arg) {
    case '--help': help(); return false;
    case '--version': version(); return false;
    default: return true;
    }
  });

  if (unparsed.length) {
    throw new RangeError(`Unknown arguments: ${unparsed.join(', ')}`);
  }

  process.exit(0);
} catch (err) {
  process.stderr.write(`${err}\n`);
  process.exit(1);
}
