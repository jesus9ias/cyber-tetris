export default () => ({
  type: 'L',
  position: 'north',
  color: 'orange',
  sides: {
    north: [
      [0, 2],
      [1, 0],
      [1, 1],
      [1, 2]
    ],
    east: [
      [0, 1],
      [1, 1],
      [2, 1],
      [2, 2]
    ],
    south: [
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 0]
    ],
    west: [
      [0, 1],
      [1, 1],
      [2, 1],
      [0, 0]
    ]
  }
});