import tty from 'tty';

/**
 * Implements a coloured console for the logger to use
 * @param {Stream} [stream=process.stderr] the stream to use for the logging
 */
export default class {
  constructor(stream=process.stderr) {
    Object.defineProperties(this, {
      stream: {value: stream},
      colours: {value: {
        red: '\x1b[31m',
        yellow: '\x1b[33m',
        green: '\x1b[32m',
        blue: '\x1b[34m',
        black: '\x1b[30m',
        reset: '\x1b[0m'
      }}
    });

    if (!tty.isatty(stream.fd)) {
      for (const attr in this.colours) {
        this.colours[attr] = '';
      }
    }
  }

  debug(...args) {
    this.stream.write(`${this.colours.blue}${args.join(' ')}${this.colours.reset}\n`);
  }

  info(...args) {
    this.stream.write(`${this.colours.green}${args.join(' ')}${this.colours.reset}\n`);
  }

  warn(...args) {
    this.stream.write(`${this.colours.yellow}${args.join(' ')}${this.colours.reset}\n`);
  }

  error(...args) {
    this.stream.write(`${this.colours.red}${args.join(' ')}${this.colours.reset}\n`);
  }
}
