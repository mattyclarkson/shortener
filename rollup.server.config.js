import babel from 'rollup-plugin-babel';

export default {
  input: 'lib/server.js',
  output: {
    file: 'dist/lib/server.js',
    format: 'cjs'
  },
  plugins: [
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
  ]
};
