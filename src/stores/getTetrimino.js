import TiTetrimino from './TiTetrimino';
import OTetrimino from './OTetrimino';
import ITetrimino from './ITetrimino';
import LTetrimino from './LTetrimino';
import JTetrimino from './JTetrimino';

export default () => {
  const shapes = [
    TiTetrimino,
    OTetrimino,
    ITetrimino,
    LTetrimino,
    JTetrimino
  ];

  const shapeToUse =  Math.floor(Math.random() * shapes.length);
  return shapes[shapeToUse]();
}