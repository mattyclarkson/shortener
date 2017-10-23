import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import express from 'express';
import {Logger, database, middleware} from '../lib/server.js';
import Console from './Console.js';

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'package.json'), {encoding: 'utf8'}));

process.title = pkg.name;

const args = yargs
  .usage(`Usage: ${process.title} [<option>...]`)
  .number('port')
  .alias('p', 'port')
  .default('port', 0)
  .describe('p', 'The port to serve on.')
  .count('verbose')
  .alias('v', 'verbose')
  .describe('v', 'Log informational messages to stderr; useful for debugging.')
  .help('h')
  .alias('h', 'help')
  .example(`${process.title} --root www --port 8080`)
  .version(pkg.version)
  .argv;

const logger = new Logger({level: args.verbose + 2, console: new Console()});

const app = express();
const root = path.join(__dirname, '..', 'www');
const www = express.static(root);
app.use(www);

const db = new database.Memory();
db.create()
  .then(() => {
    const api = middleware.api(db);
    app.use('/api', api);

    const server = app.listen(args.port, () => {
      logger.info(`Serving files from '${root}' on port '${server.address().port}'`)
    });
  })
  .catch (err => {
    process.stderr.write(`${err}\n`);
    process.exit(1);
  });
