import TTetrimino from './TTetrimino';
import OTetrimino from './OTetrimino';
import ITetrimino from './ITetrimino';
import LTetrimino from './LTetrimino';
import JTetrimino from './JTetrimino';
import STetrimino from './STetrimino';
import ZTetrimino from './ZTetrimino';

export default () => {
  const shapes = [
    TTetrimino,
    OTetrimino,
    ITetrimino,
    LTetrimino,
    JTetrimino,
    STetrimino,
    ZTetrimino
  ];

  const shapeToUse = Math.floor(Math.random() * shapes.length);
  return shapes[shapeToUse]();
}