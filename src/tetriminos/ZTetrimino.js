export default () => ({
  type: 'Z',
  position: 'north',
  color: '#e71c26',
  secondaryColor: '#ef5543',
  sides: {
    north: [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 2]
    ],
    east: [
      [0, 2],
      [1, 2],
      [1, 1],
      [2, 1]
    ],
    south: [
      [1, 0],
      [1, 1],
      [2, 1],
      [2, 2]
    ],
    west: [
      [0, 1],
      [1, 1],
      [1, 0],
      [2, 0]
    ]
  }
});