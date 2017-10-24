import chai from 'chai';
import {URL} from 'whatwg-url';
import babelRegister from 'babel-register';
import fs from 'fs';
import http from 'http';
import path from 'path';
import fetch, {Headers, Request, Response} from 'node-fetch';
import {setUrl, setFetch} from '../lib/compatibility.js';
import api from '../lib/server/middleware/api.js';
import Memory from '../lib/server/database/Memory.js';

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json')));
const babelrc = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '.babelrc')));
const ignoreRegexp = new RegExp(`node_modules/(?!${Object.keys(pkg.dependencies || {}).join('|')})`);
const options = Object.assign(babelrc, {ignore: filename => filename.match(ignoreRegexp), babelrc: false});
babelRegister(options);

const port = 58956;

setUrl(URL);
setFetch(fetch, Headers, Request, Response);

global.chai = chai;
global.should = chai.should();
global.location = {
  origin: `http://localhost:${port}`
};

before(async function() {
  this.port = port;
  const database = new Memory();
  await database.create()
  const middleware = api(database);
  this.server = http.createServer(middleware);

  return new Promise((resolve, reject) => {
    this.server.listen(this.port, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
});

after(async function() {
  return new Promise((resolve, reject) => {
    this.server.close(err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
});
