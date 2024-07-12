module.exports = {
  root         : true,
  parser       : '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion : 2022,
    ecmaFeatures: {
      // binaryLiterals?: boolean;
      // blockBindings         : true,
      // classes?: boolean;
      // defaultParams?: boolean;
      arrowFunctions        : false,
      // destructuring         : false,
      experimentalDecorators: true,
      jsx                   : true
    },
    sourceType: 'module'
  },

  env: {
    browser : true,
    node    : true,
    commonjs: true,
    es6     : true,
    // es2021  : true,
  },

  plugins: ['prettier', 'unicorn', 'import', 'node', 'promise', 'security'], // 'standard',  'prettier',  'babel',

  globals: {
    document : 'readonly',
    navigator: 'readonly',
    process  : 'readonly',
    window   : 'readonly'
  },

  extends: [
    // 'standard',
    // 'eslint:recommended',
    // 'google',
    // 'prettier',
    // 'plugin:security/recommended',
    // 'plugin:unicorn/recommended',
    // 'plugin:prettier/recommended',
  ],

  ignorePatterns: ['**/dist/**/*', '**/build/**/*', '**/node_modules/**/*'],

  rules: {
    // Possible Problems
    'array-callback-return'          : 'error',
    'constructor-super'              : 'error',
    'for-direction'                  : 'error',
    'getter-return'                  : 'error',
    'no-async-promise-executor'      : 'error',
    'no-await-in-loop'               : 'error',
    'no-class-assign'                : 'error',
    'no-compare-neg-zero'            : 'error',
    'no-cond-assign'                 : 'off',
    'no-const-assign'                : 'error',
    'no-constant-condition'          : 'error',
    'no-constructor-return'          : 'error',
    'no-control-regex'               : 'error',
    'no-debugger'                    : 'warn',
    'no-dupe-args'                   : 'warn',
    'no-dupe-class-members'          : 'error',
    'no-dupe-else-if'                : 'error',
    'no-dupe-keys'                   : 'error',
    'no-duplicate-case'              : 'error',
    'no-duplicate-imports'           : 'off',
    'no-empty-character-class'       : 'error',
    'no-empty-pattern'               : 'error',
    'no-ex-assign'                   : 'error',
    'no-fallthrough'                 : 'error',
    'no-func-assign'                 : 'error',
    'no-import-assign'               : 'error',
    'no-inner-declarations'          : 'error',
    'no-invalid-regexp'              : 'error',
    'no-irregular-whitespace'        : 'error',
    'no-loss-of-precision'           : 'error',
    'no-misleading-character-class'  : 'error',
    'no-new-symbol'                  : 'error',
    'no-obj-calls'                   : 'error',
    'no-promise-executor-return'     : 'error',
    'no-prototype-builtins'          : 'error',
    'no-self-assign'                 : 'error',
    'no-self-compare'                : 'off',
    'no-setter-return'               : 'error',
    'no-sparse-arrays'               : 'off',
    'no-template-curly-in-string'    : 'off',
    'no-this-before-super'           : 'error',
    'no-undef'                       : 'error',
    'no-unexpected-multiline'        : 'error',
    'no-unmodified-loop-condition'   : 'off',
    'no-unreachable'                 : 'error',
    'no-unreachable-loop'            : 'error',
    'no-unsafe-finally'              : 'error',
    'no-unsafe-negation'             : 'error',
    'no-unsafe-optional-chaining'    : 'error',
    'no-unused-private-class-members': 'error',
    'no-unused-vars'                 : 'error',
    'no-use-before-define'           : 'off', //['error', { functions: false, classes: false }],
    'no-useless-backreference'       : 'error',
    'require-atomic-updates'         : 'error',
    'use-isnan'                      : 'error',
    'valid-typeof'                   : 'error',

    // Suggestions
    'accessor-pairs'                : 'off',
    'arrow-body-style'              : ['error', 'as-needed'], // as-needed
    'block-scoped-var'              : 'error',
    'camelcase'                     : 'off', //['error', { properties: 'never', ignoreDestructuring: true, ignoreImports: true, ignoreGlobals: true }],
    'capitalized-comments'          : 'off',
    'class-methods-use-this'        : 'error',
    'complexity'                    : 'off',
    'consistent-return'             : ['error', { treatUndefinedAsUnspecified: true }],
    'consistent-this'               : 'off',
    'curly'                         : ['error', 'multi-line'],
    'default-case'                  : 'error',
    'default-case-last'             : 'error',
    'default-param-last'            : 'error',
    'dot-notation'                  : 'error',
    'eqeqeq'                        : ['error', 'smart'],
    'func-name-matching'            : 'error',
    'func-names'                    : 'off', // ['error', 'as-needed'],
    'func-style'                    : 'off', // ['error', 'declaration', { allowArrowFunctions: true }],
    'grouped-accessor-pairs'        : 'error',
    'guard-for-in'                  : 'off',
    'id-denylist'                   : 'off',
    'id-length'                     : 'off',
    'id-match'                      : 'off',
    'init-declarations'             : 'off',
    'max-classes-per-file'          : 'off',
    'max-depth'                     : 'off',
    'max-lines'                     : 'off',
    'max-lines-per-function'        : 'off',
    'max-nested-callbacks'          : 'off',
    'max-params'                    : 'off',
    'max-statements'                : 'off',
    'multiline-comment-style'       : 'off',
    'new-cap'                       : 'error', // ['error', { newIsCap: true, capIsNew: true }],
    'no-alert'                      : 'error',
    'no-array-constructor'          : 'error',
    'no-bitwise'                    : 'off',
    'no-caller'                     : 'error',
    'no-case-declarations'          : 'error',
    'no-confusing-arrow'            : 'error', //'off', //['error', { allowParens: false }],
    'no-console'                    : 'off',
    'no-continue'                   : 'off',
    'no-delete-var'                 : 'error',
    'no-div-regex'                  : 'error',
    'no-else-return'                : 'off',
    'no-empty'                      : 'off',
    'no-empty-function'             : 'off',
    'no-eq-null'                    : 'off',
    'no-eval'                       : 'error',
    'no-extend-native'              : 'error',
    'no-extra-bind'                 : 'error',
    'no-extra-boolean-cast'         : 'error',
    'no-extra-label'                : 'error',
    'no-extra-semi'                 : 'off', // 'error',
    'no-floating-decimal'           : 'error',
    'no-global-assign'              : 'error',
    'no-implicit-coercion'          : 'off',
    'no-implicit-globals'           : 'off',
    'no-implied-eval'               : 'off',
    'no-inline-comments'            : 'off',
    'no-invalid-this'               : 'off',
    'no-iterator'                   : 'error',
    'no-label-var'                  : 'error',
    'no-labels'                     : 'off',
    'no-lone-blocks'                : 'error',
    'no-lonely-if'                  : 'error',
    'no-loop-func'                  : 'error',
    'no-magic-numbers'              : 'off',
    'no-mixed-operators'            : 'off',
    'no-multi-assign'               : 'off',
    'no-multi-str'                  : 'off',
    'no-negated-condition'          : 'off',
    'no-nested-ternary'             : 'off',
    'no-new'                        : 'off',
    'no-new-func'                   : 'off',
    'no-new-object'                 : 'error',
    'no-new-wrappers'               : 'error',
    'no-nonoctal-decimal-escape'    : 'error',
    'no-octal'                      : 'error',
    'no-octal-escape'               : 'error',
    'no-param-reassign'             : 'off',
    'no-plusplus'                   : 'off',
    'no-proto'                      : 'off',
    'no-redeclare'                  : 'off', // 'error',
    'no-regex-spaces'               : 'error',
    'no-restricted-exports'         : 'off',
    'no-restricted-globals'         : 'off',
    'no-restricted-imports'         : 'off',
    'no-restricted-properties'      : 'off',
    'no-restricted-syntax'          : 'off',
    'no-return-assign'              : 'off',
    'no-return-await'               : 'off',
    'no-script-url'                 : 'error',
    'no-sequences'                  : 'off',
    'no-shadow'                     : 'off',
    'no-shadow-restricted-names'    : 'error',
    'no-ternary'                    : 'off',
    'no-throw-literal'              : 'off',
    'no-undef-init'                 : 'error',
    'no-undefined'                  : 'error',
    'no-underscore-dangle'          : 'off',
    'no-unneeded-ternary'           : 'error',
    'no-unused-expressions'         : 'off',
    'no-unused-labels'              : 'error',
    'no-useless-call'               : 'off',
    'no-useless-catch'              : 'error',
    'no-useless-computed-key'       : 'error',
    'no-useless-concat'             : 'error',
    'no-useless-constructor'        : 'error',
    'no-useless-escape'             : 'error',
    'no-useless-rename'             : 'error',
    'no-useless-return'             : 'error',
    'no-var'                        : 'error',
    'no-void'                       : 'off', //['error', { allowAsStatement: true }],
    'no-warning-comments'           : 'off',
    'no-with'                       : 'error',
    'object-shorthand'              : 'off',
    'one-var'                       : 'off',
    'one-var-declaration-per-line'  : 'off',
    'operator-assignment'           : ['error', 'always'],
    'prefer-arrow-callback'         : 'off', // 'error',
    'prefer-const'                  : 'error',
    'prefer-destructuring'          : 'off',
    'prefer-exponentiation-operator': 'off',
    'prefer-named-capture-group'    : 'off',
    'prefer-numeric-literals'       : 'error',
    'prefer-object-spread'          : 'error',
    'prefer-promise-reject-errors'  : 'off',
    'prefer-regex-literals'         : 'off',
    'prefer-rest-params'            : 'off',
    'prefer-spread'                 : 'off',
    'prefer-template'               : 'off',
    'quote-props'                   : ['error', 'consistent-as-needed'],
    'radix'                         : 'error',
    'require-await'                 : 'error',
    'require-unicode-regexp'        : 'off',
    'require-yield'                 : 'error',
    'sort-imports'                  : 'off',
    'sort-keys'                     : 'off',
    'sort-vars'                     : 'off',
    'spaced-comment'                : 'off',
    'strict'                        : 'off',
    'symbol-description'            : 'error',
    'vars-on-top'                   : 'off',
    'yoda'                          : 'error',

    // Layout & Formatting
    'array-bracket-newline'         : ['error', 'consistent'],
    'array-bracket-spacing'         : ['error', 'never'],
    'array-element-newline'         : ['error', 'consistent'],
    'arrow-parens'                  : ['error', 'always'],
    'arrow-spacing'                 : ['error', { before: true, after: true }],
    'block-spacing'                 : 'error',
    'brace-style'                   : ['error', '1tbs', { allowSingleLine: true }],
    'comma-dangle'                  : ['error', 'only-multiline'],
    'comma-spacing'                 : ['error', { before: false, after: true }],
    'comma-style'                   : ['error', 'last'],
    'computed-property-spacing'     : ['error', 'never'],
    'dot-location'                  : ['error', 'property'],
    'eol-last'                      : ['error', 'always'],
    'func-call-spacing'             : ['error', 'never'],
    'function-call-argument-newline': ['error', 'consistent'],
    'function-paren-newline'        : ['error', 'consistent'],
    'generator-star-spacing'        : ['error', { before: true, after: false }],
    'implicit-arrow-linebreak'      : 'off', //['error', 'beside'],
    'indent'                        : ['error', 2, { SwitchCase: 1 }],
    'jsx-quotes'                    : ['error', 'prefer-double'],
    'key-spacing'                   : ['error', { align: 'colon' }],
    'keyword-spacing'               : ['error', { before: true, after: true }],
    'line-comment-position'         : 'off',
    'linebreak-style'               : ['error', 'unix'],
    'lines-around-comment'          : 'off',
    'lines-between-class-members'   : 'off', //['error', 'never'],
    'max-len'                       : 'off',
    // 'max-len'                       : [
    //   'error',
    //   {
    //     code                  : 160,
    //     ignoreComments        : true,
    //     ignoreTrailingComments: true,
    //     ignoreUrls            : true,
    //     ignoreStrings         : true,
    //     ignoreTemplateLiterals: true,
    //     ignoreRegExpLiterals  : true
    //   }
    // ],
    'max-statements-per-line'       : 'off',
    'multiline-ternary'             : 'off',
    'new-parens'                    : 'error',
    'newline-per-chained-call'      : 'off',
    'no-extra-parens'               : ['error', 'all', {
      enforceForArrowConditionals: false,
      ignoreJSX                  : 'all'
    }],
    'no-mixed-spaces-and-tabs'        : 'error',
    'no-multi-spaces'                 : 'error',
    'no-multiple-empty-lines'         : ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
    'no-tabs'                         : 'error',
    'no-trailing-spaces'              : ['error', { ignoreComments: true, skipBlankLines: true }],
    'no-whitespace-before-property'   : 'error',
    'nonblock-statement-body-position': ['error', 'beside'],
    'object-curly-newline'            : ['error', { multiline: true }],
    'object-curly-spacing'            : ['error', 'always'],
    'object-property-newline'         : ['error', { allowAllPropertiesOnSameLine: true }],
    'operator-linebreak'              : [
      'error', 'after', { overrides: { '?': 'before', ':': 'before' } }
    ],
    'padded-blocks'                  : ['error', { blocks: 'never' }],
    'padding-line-between-statements': 'off',
    'quotes'                         : [
      'error', 'single', { avoidEscape: true, allowTemplateLiterals: false }
    ],
    'rest-spread-spacing'        : ['error', 'never'],
    'semi'                       : ['error', 'never', { beforeStatementContinuationChars: 'always' }],
    'semi-spacing'               : ['error', { before: false, after: true }],
    'semi-style'                 : ['error', 'first'],
    'space-before-blocks'        : 'error',
    'space-before-function-paren': ['error', {
      anonymous : 'always',
      named     : 'never',
      asyncArrow: 'always'
    }],
    'space-in-parens'       : ['error', 'never'],
    'space-infix-ops'       : 'error',
    'space-unary-ops'       : 'error',
    'switch-colon-spacing'  : 'error',
    'template-curly-spacing': 'error',
    'template-tag-spacing'  : 'error',
    'unicode-bom'           : ['error', 'never'],
    'wrap-iife'             : ['error', 'inside'],
    'wrap-regex'            : 'off',
    'yield-star-spacing'    : ['error', { before: false, after: true }],

    // 'prettier/prettier': 'error',
    'require-jsdoc'                   : 'off',
    'security/detect-object-injection': 'off'
  },
  overrides: [
    {
      extends: [
      // 'prettier/@typescript-eslint'
        // 'plugin:@typescript-eslint/recommended'
      ],
      files  : ['*.ts', '*.tsx'],
      plugins: ['@typescript-eslint'],
      parser : '@typescript-eslint/parser',
      rules  : {
        'no-undef'                          : 'off',
        // 'no-redeclare'                             : 'off',
        // '@typescript-eslint/no-redeclare'          : ['error'],
        'no-extra-parens'                   : 'off',
        '@typescript-eslint/no-extra-parens': ['error', 'all', {
          enforceForArrowConditionals: false,
          ignoreJSX                  : 'all'
        }],
        'keyword-spacing'                          : 'off',
        '@typescript-eslint/keyword-spacing'       : ['error'],
        'no-useless-constructor'                   : 'off',
        '@typescript-eslint/no-useless-constructor': ['error'],
        'no-unused-vars'                           : 'off',
        '@typescript-eslint/no-unused-vars'        : ['error'],
        'no-dupe-class-members'                    : 'off',
        '@typescript-eslint/no-dupe-class-members' : ['error'],

        // '@typescript-eslint/explicit-function-return-type': ['error', {
        //   allowExpressions                                    : true,
        //   allowTypedFunctionExpressions                       : true,
        //   allowHigherOrderFunctions                           : true,
        //   allowDirectConstAssertionInArrowFunctions           : true,
        //   allowConciseArrowFunctionExpressionsStartingWithVoid: false
        // }],
        // '@typescript-eslint/no-non-null-assertion'        : 'off',
        // '@typescript-eslint/no-extra-semi'                : 'off',
        // 'no-use-before-define'                            : 'off',
        // 'no-invalid-this'                                 : 'error',

      }
    },
    {
      extends: ['plugin:jest/recommended'],
      files  : ['*.test.js', '*.test.ts'],
      env    : { jest: true },
      globals: {
        test  : 'readonly',
        expect: 'readonly'
      },
      plugins: ['jest']
      // rules  : { 'no-undef': 'off' }
      // ...require('eslint-plugin-jest').configs.recommended
    },
  ]
}
