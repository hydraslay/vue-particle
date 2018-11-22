module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  'extends': [
    'plugin:vue/strongly-recommended',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/max-attributes-per-line': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  plugins: [
    'vue'
  ]
}
