const cssProp = require('css-property-normalize');

const CLASSES = new WeakMap();
const TARGETS = new WeakMap();
const STYLES = [
  [cssProp('touch-action', true, true), 'none'],
  [cssProp('user-select', true, true), 'none'],
  [cssProp('touch-select', true, true), 'none'],
  [cssProp('touch-callout', true, true), 'none'],
  [cssProp('content-zooming', true, true), 'none'],
  [cssProp('user-drag', true, true), 'none'],
  [cssProp('tap-highlight-color', true, true), 'transparent'],
].filter((v) => v[0]);

module.exports = { CLASSES, TARGETS, STYLES };
