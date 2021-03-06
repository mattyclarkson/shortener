import fs from 'fs';

function chmod({mode} = {mode: '644'}) {
  return {
    name: 'json',
    onwrite: ({file}) => {
      fs.chmodSync(file, mode);
    }
  };
}

export default {
  input: 'bin/shortener.js',
  output: {
    file: 'dist/bin/shortener.js',
    format: 'cjs',
    banner: '#! /usr/bin/env node\n'
  },
  plugins: [
    chmod({ mode: '755' }),
  ],
  external: [
    'fs', 'url', 'tty', 'path', 'yargs', 'accepts', 'express'
  ]
};
