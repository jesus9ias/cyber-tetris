import { ref } from 'vue';

export const useTetriminos = () => {
  const matrix = ref([]);
  const tetriminoRow = ref(0);
  const tetriminoCol = ref(0);

  const getTetriminoColor = (row, col, tetrimino) => {
    const matchMatrix = tetrimino.id && tetrimino.sides[tetrimino.position]
        .find((mino) => (tetriminoRow.value + mino[0]) === row && (tetriminoCol.value + mino[1]) === col);
    
    if (matchMatrix) {
        return { colors: tetrimino.colors };
    }
    
    return { colors: [null, null, null] };
  }

  const paintTetrimino = (rows, cols, tetrimino) => {
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        if (matrix.value[r] && !matrix.value[r][c].locked) {
          const { colors } = getTetriminoColor(r, c, tetrimino);
          matrix.value[r][c].colors = colors;
        }
      }
    }
  };

  const createCells = (rows, cols) => {
    matrix.value = [];
    for (let r = 0; r <= rows; r++) {
      matrix.value.push([]);
      for (let c = 0; c <= cols; c++) {
        matrix.value[r].push({
          col: c,
          colors: [null, null, null],
          locked: false
        });
      }
    }
  };

  return {
    matrix,
    tetriminoRow,
    tetriminoCol,
    createCells,
    paintTetrimino
  }
}