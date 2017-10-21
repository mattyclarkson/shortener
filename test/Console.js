export default class Console {
  constructor() {
    Object.defineProperty(this, 'buffer', {value: '', writable: true});
  }

  debug(...args) {
    this.buffer += `debug: ${args.join(' ')}`;
  }

  info(...args) {
    this.buffer += `info: ${args.join(' ')}`;
  }

  warn(...args) {
    this.buffer += `warn: ${args.join(' ')}`;
  }

  error(...args) {
    this.buffer += `error: ${args.join(' ')}`;
  }
}
