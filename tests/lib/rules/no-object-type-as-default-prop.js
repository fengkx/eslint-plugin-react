/**
 * @fileoverview Prevent usage of object type variables as default param in functional component
 * @author Chang Yan
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const parsers = require('../../helpers/parsers');
const rule = require('../../../lib/rules/no-object-type-as-default-prop');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
const MESSAGE_ID = 'forbiddenTypeDefaultParam';

const expectedViolations = [
  {
    messageId: MESSAGE_ID,
    data: {
      propName: 'a',
      forbiddenType: 'object literal',
    },
  },
  {
    messageId: MESSAGE_ID,
    data: {
      propName: 'b',
      forbiddenType: 'array literal',
    },
  },
  {
    messageId: MESSAGE_ID,
    data: {
      propName: 'c',
      forbiddenType: 'regex literal',
    },
  },
  {
    messageId: MESSAGE_ID,
    data: {
      propName: 'd',
      forbiddenType: 'arrow function',
    },
  },
  {
    messageId: MESSAGE_ID,
    data: {
      propName: 'e',
      forbiddenType: 'function expression',
    },
  },
  {
    messageId: MESSAGE_ID,
    data: {
      propName: 'f',
      forbiddenType: 'class expression',
    },
  },
  {
    messageId: MESSAGE_ID,
    data: {
      propName: 'g',
      forbiddenType: 'construction expression',
    },
  },
  {
    messageId: MESSAGE_ID,
    data: {
      propName: 'h',
      forbiddenType: 'JSX element',
    },
  },
  {
    messageId: MESSAGE_ID,
    data: {
      propName: 'i',
      forbiddenType: 'Symbol literal',
    },
  },
];

ruleTester.run('no-object-type-as-default-prop', rule, {
  valid: [
    `
      function Foo({
        bar = emptyFunction,
      }) {
        return null;
      }
  `,
    `
    function Foo({
      bar = emptyFunction,
      ...rest
    }) {
      return null;
    }
  `,
    `
    function Foo({
      bar = 1,
      baz = 'hello',
    }) {
      return null;
    }
  `,
    `
    function Foo(props) {
      return null;
    }
  `,
    `
    function Foo(props) {
      return null;
    }

    Foo.defaultProps = {
      bar: () => {
        return null;
      }
    }
  `,
    `
    const Foo = () => {
      return null;
    };
  `,
    `
    const Foo = ({bar = 1}) => {
      return null;
    };
  `,
    `
    // It's hard to tell if an anonymous function is a
    // React component or not, so we simply skip it
    // to prevent false positive
    export default function({foo = {}}) {}
  `,
  ],
  invalid: [
    {
      code: `
          function Foo({
            a = {},
            b = ['one', 'two'],
            c = /regex/i,
            d = () => {},
            e = function() {},
            f = class {},
            g = new Thing(),
            h = <Thing />,
            i = Symbol('foo')
          }) {
            return null;
          }
        `,
      errors: expectedViolations,
    },
    {
      code: `
          function Foo({
            a = {},
            b = ['one', 'two'],
            c = /regex/i,
            d = () => {},
            e = function() {},
            f = class {},
            g = new Thing(),
            h = <Thing />,
            i = Symbol('foo')
          }) {
            return null;
          }
        `,
      parser: parsers.TYPESCRIPT_ESLINT,
      errors: expectedViolations,
    },
    {
      code: `
          const Foo = ({
            a = {},
            b = ['one', 'two'],
            c = /regex/i,
            d = () => {},
            e = function() {},
            f = class {},
            g = new Thing(),
            h = <Thing />,
            i = Symbol('foo')
          }) => {
            return null;
          }
        `,
      errors: expectedViolations,
    },
    {
      code: `
          const Foo = ({
            a = {},
            b = ['one', 'two'],
            c = /regex/i,
            d = () => {},
            e = function() {},
            f = class {},
            g = new Thing(),
            h = <Thing />,
            i = Symbol('foo')
          }) => {
            return null;
          }
        `,
      errors: expectedViolations,
      parser: parsers.TYPESCRIPT_ESLINT,
    },
  ],
});
