module.exports = {
  env: {
    node: true,
    es2022: true,
  },
  extends: [
    'eslint:recommended',
  ],
  plugins: [
    'security',
    'node',
  ],
  rules: {
    // Security rules
    'security/detect-object-injection': 'error',
    'security/detect-non-literal-regexp': 'error',
    'security/detect-unsafe-regex': 'error',
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'error',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-non-literal-fs-filename': 'error',
    'security/detect-non-literal-require': 'error',
    'security/detect-possible-timing-attacks': 'error',
    'security/detect-pseudoRandomBytes': 'error',
    
    // Node.js specific rules
    'node/no-deprecated-api': 'error',
    'node/no-extraneous-require': 'error',
    'node/no-missing-require': 'error',
    'node/no-unpublished-require': 'warn',
    'node/no-unsupported-features/es-syntax': 'error',
    
    // General security best practices
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    'no-alert': 'error',
    'no-console': 'warn',
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
};
