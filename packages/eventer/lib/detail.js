const { getDevice, getType } = require('./util');

const detail = { delta: {}, position: {}, client: {}, offset: {} };
const DETAIL_WRAPPER = { detail: { ...detail } };

let previosType = '';
function createDetail(_e) {
  const type = getType(_e);
  const device = getDevice(_e);

  let DPR = 1;
  try {
    DPR = +window.devicePixelRatio || 1;
  } catch (err) {
    console.error(err);
  }

  const srcEvent = _e;
  const target = _e.target;

  let ofs = { top: 0, left: 0 };
  try {
    ofs = target.getBoundingClientRect();
  } catch (err) {
    console.error(err);
  }

  // const preventDefault = () => _e.preventDefault();
  // const stopPropagation = () => _e.stopPropagation();

  let which = 1;
  let radiusX = 5 * DPR;
  let radiusY = 5 * DPR;

  const eBase = (_e.touches && _e.touches[0]) || _e;
  (radiusX = eBase.radiusX || radiusX), (radiusY = eBase.radiusY || radiusY);

  let clientX, clientY, positionX, positionY;
  if (!_e.touches || _e.touches.length < 2) {
    if (previosType !== 'no-pinch') {
      (previosType = 'no-pinch'), (DETAIL_WRAPPER.detail = { ...detail });
    }

    const e = eBase;
    which = e.which || _e.which || 0;

    clientX = e.clientX || DETAIL_WRAPPER.detail.client.x || 0;
    clientY = e.clientY || DETAIL_WRAPPER.detail.client.y || 0;

    (positionX = clientX - ofs.left), (positionY = clientY - ofs.top);

    if (type === 'start' || type === 'end') {
      DETAIL_WRAPPER.detail = { ...detail };
    }

    DETAIL_WRAPPER.detail = {
      ...DETAIL_WRAPPER.detail,
      isStart: !!DETAIL_WRAPPER.detail.isStart,
      isDrag: !!DETAIL_WRAPPER.detail.isDrag,
      isEnd: !!DETAIL_WRAPPER.detail.isEnd,
    };
  } else {
    if (previosType !== 'pinch') {
      (previosType = 'pinch'), (DETAIL_WRAPPER.detail = { ...detail });
    }

    const touches = [..._e.touches];

    (clientX = 0), (clientY = 0), (positionX = 0), (positionY = 0);

    touches.forEach((T) => {
      (clientX += T.clientX), (clientY += T.clientY);
      (positionX += T.clientX - ofs.left), (positionY += T.clientY - ofs.top);
    });

    (clientX /= touches.length), (clientY /= touches.length);
    (positionX /= touches.length), (positionY /= touches.length);

    DETAIL_WRAPPER.detail = {
      ...DETAIL_WRAPPER.detail,
      isPinch: true,
    };
  }

  const deltaX = positionX - (DETAIL_WRAPPER.detail.position.x || positionX);
  const deltaY = positionY - (DETAIL_WRAPPER.detail.position.y || positionY);

  const offsetX = deltaX + (DETAIL_WRAPPER.detail.offset.x || 0);
  const offsetY = deltaY + (DETAIL_WRAPPER.detail.offset.y || 0);
  const distance = { x: Math.abs(offsetX), y: Math.abs(offsetY) };

  const directionX = offsetX > 0 ? 'right' : 'left';
  const directionY = offsetY > 0 ? 'down' : 'up';
  let direction = '';
  if (previosType === 'no-pinch') {
    direction = distance.x > distance.y ? directionX : directionY;
  } else {
    direction = distance.x > distance.y ? 'horizontal' : 'vertical';
  }

  DETAIL_WRAPPER.detail = {
    device,
    devices: { touch: device === 'touch', mouse: device === 'mouse' },

    ...DETAIL_WRAPPER.detail,

    position: { x: positionX, y: positionY },
    client: { x: clientX, y: clientY },

    delta: { x: deltaX, y: deltaY },
    offset: { x: offsetX, y: offsetY },
    distance,

    direction,
    directions: { x: directionX, y: directionY },

    stopped: false,

    ...{ radiusX, radiusY },
    ...{ srcEvent, target, DPR, which },
    // ...{ preventDefault, stopPropagation },
    ...{ pointSize: (radiusX + radiusY) / 2 / DPR },
  };

  DETAIL_WRAPPER.detail.stopPropagation = () => {
    DETAIL_WRAPPER.detail.stopped = true;
  };
}

module.exports = { createDetail, DETAIL_WRAPPER };
