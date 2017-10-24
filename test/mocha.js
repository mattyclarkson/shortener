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
import MySql from '../lib/server/database/MySql.js';
import {Docker} from 'node-docker-api';

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json')));
const babelrc = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '.babelrc')));
const ignoreRegexp = new RegExp(`node_modules/(?!${Object.keys(pkg.dependencies || {}).join('|')})`);
const options = Object.assign(babelrc, {ignore: filename => filename.match(ignoreRegexp), babelrc: false});
babelRegister(options);

setUrl(URL);
setFetch(fetch, Headers, Request, Response);

global.chai = chai;
global.should = chai.should();

before(async function() {
  const mysql = {user: 'root', password: 'shrtnr', port: 5000};
  /*try {
    const docker = new Docker();
    this.container = await docker.container.create({
      image: 'mysql:8',
      env: [`MYSQL_ROOT_PASSWORD=${mysql.password}`],
      portBindings: { "3306/tcp": [{ "HostPort": `${mysql.port}` }] }
    });
    this.timeout(30000);
    await this.container.start();
  } catch (err) {
    const message = err.json && err.json.message || err.message;
    process.stderr.write(`\x1b[33mFailed to start Docker MySQL container: ${message}\x1b[0m\n\n`);
  }*/

  const database = new MySql(mysql);
  await database.create()
  const middleware = api(database);
  this.server = http.createServer(middleware);

  this.port = await new Promise((resolve, reject) => {
    const listener = this.server.listen(0, err => {
      if (err) {
        reject(err);
      } else {
        resolve(listener.address().port);
      }
    });
  });

  global.location = {
    origin: `http://localhost:${this.port}`
  };
});

after(async function() {
  if (this.container) {
    this.timeout(30000);
    await this.container.stop();
    await this.container.delete({force: true});
  }
  return new Promise((resolve, reject) => {
    if (!this.server) {
      resolve();
    }
    this.server.close(err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
});
