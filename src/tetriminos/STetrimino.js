export default () => ({
  type: 'S',
  position: 'north',
  color: '#72ac39',
  secondaryColor: '#9bca6b',
  sides: {
    north: [
      [0, 2],
      [0, 1],
      [1, 1],
      [1, 0]
    ],
    east: [
      [0, 0],
      [1, 0],
      [1, 1],
      [2, 1]
    ],
    south: [
      [0, 2],
      [0, 1],
      [1, 1],
      [1, 0]
    ],
    west: [
      [0, 0],
      [1, 0],
      [1, 1],
      [2, 1]
    ]
  }
});