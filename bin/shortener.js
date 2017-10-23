import fs from 'fs';
import path from 'path';
import express from 'express';
import {Logger, level} from '../lib/server.js'
import Console from './Console.js'

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
    --verbose
        Log informational messages to stderr; useful for debugging.
    --version
        Print version information and exit.
    --help
        Display this help text and exit.
`);
  process.exit(status);
}

try {
  const args = {};

  const unparsed = process.argv.slice(2).filter(arg => {
    switch (arg) {
    case '--verbose': args.verbose = true; return false;
    case '--help': help(); return false;
    case '--version': version(); return false;
    default: return true;
    }
  });

  if (unparsed.length) {
    throw new RangeError(`Unknown arguments: ${unparsed.join(', ')}`);
  }

  const logger = new Logger({level: args.verbose ? level.INFO : level.WARN, console: new Console()});

  const app = express();
  const root = path.join(__dirname, '..', 'www');
  const www = express.static(root);
  app.use(www);
  const server = app.listen(0, () => {logger.info(`Serving files from '${root}' on port '${server.address().port}'`)});
} catch (err) {
  process.stderr.write(`${err}\n`);
  process.exit(1);
}
