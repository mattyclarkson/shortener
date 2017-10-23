import fs from 'fs';
import babel from 'rollup-plugin-babel';

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
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [[
        'env',
        {
          target: { node: 'current' },
          modules: false
        }
      ]],
      plugins: ['external-helpers']
    })
  ],
  external: [
    'fs',
    'tty',
    'path',
    'express'
  ]
};
