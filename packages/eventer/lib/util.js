function getDevice(e) {
  return e.type.slice(0, 5);
}

function getType(e) {
  let type = e.type.slice(5);

  if (e.touches && e.touches.length > 1) return (type = 'pinch');

  if (e.type === 'touchmove' || (e.type === 'mousemove' && e.buttons)) {
    return (type = 'drag');
  }

  if (type === 'down') return (type = 'start');

  if (type === 'up' || e.type === 'touchcancel') return (type = 'end');

  return type;
}

module.exports = { getDevice, getType };
