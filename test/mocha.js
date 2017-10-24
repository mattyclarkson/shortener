import chai from 'chai';
import {URL} from 'whatwg-url';
import babelRegister from 'babel-register';
import fs from 'fs';
import http from 'http';
import path from 'path';
import fetch, {Headers, Request, Response} from './fetch.js';
import {setUrl} from '../lib/compatibility.js';
import api from '../lib/server/middleware/api.js';
import Memory from '../lib/server/database/Memory.js';

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json')));
const babelrc = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '.babelrc')));
const ignoreRegexp = new RegExp(`node_modules/(?!${Object.keys(pkg.dependencies || {}).join('|')})`);
const options = Object.assign(babelrc, {ignore: (filename) => filename.match(ignoreRegexp), babelrc: false});
babelRegister(options);

const port = 58956;

setUrl(URL);

global.chai = chai;
global.should = chai.should();
global.fetch = fetch;
global.Headers = Headers;
global.Request = Request;
global.Response = Response;
global.location = {
  origin: `http://localhost:${port}`
};

before(function(done) {
  this.port = port;
  const database = new Memory();
  database.create()
    .then(() => {
      const middleware = api(database);
      this.server = http.createServer(middleware);
      this.server.listen(this.port, done);
    });
});

after(function(done) {
  this.server.close(done);
});
