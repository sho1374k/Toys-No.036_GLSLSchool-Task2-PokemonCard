export class Calc {
  /**
   * @param {number} _x
   * @param {number} _y
   * @param {number} _w
   * @param {number} _h
   * @returns
   */
  static normalizeVectorCoords(_x, _y, _w, _h) {
    const coords = {
      x: _x - _w * 0.5,
      y: _h * 0.5 - _y,
    };

    return coords;
  }

  /**
   * @param {number} _start
   * @param {number} _end
   * @param {number} _interpolation
   */
  static lerp(_start, _end, _interpolation) {
    return _start * (1 - _interpolation) + _end * _interpolation;
  }

  /**
   * @param {number} _num
   * @param {number} _min
   * @param {number} _max
   */
  static clamp(_num, _min, _max) {
    return _min > _num ? _min : _max < _num ? _max : _num;
  }

  /**
   * 範囲を超えると反対の端点にする
   * @param {number} _num
   * @param {number} _min
   * @param {number} _max
   */
  static hoop(_num, _min, _max) {
    const range = _max - _min + 1;
    let mod = (_num - _min) % range;
    if (0 > mod) {
      mod = range + mod;
    }
    return mod + _min;
  }

  /**
   * @param {number} _min
   * @param {number} _max
   * @returns
   */
  static clampRandom(_min, _max) {
    return Math.random() * (_max - _min) + _min;
  }

  /**
   * @param {number} _value
   * @param {number} _start1
   * @param {number} _stop1
   * @param {number} _start2
   * @param {number} _stop2
   */
  static remap(_value, _min1, _max1, _min2, _max2) {
    return ((_value - _min1) / (_max1 - _min1)) * (_max2 - _min2) + _min2;
  }

  /**
   * @param {number} _degree
   */
  static degreeToRadian(_degree) {
    const radian = (_degree * Math.PI) / 180;
    return radian;
  }

  /**
   * @param {number} _radians
   */
  static radianToDegree(_radian) {
    const degree = (_radian * 180) / Math.PI;
    return degree;
  }
}
