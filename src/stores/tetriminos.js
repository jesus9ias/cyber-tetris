import { ref, watch } from 'vue';
import { defineStore } from 'pinia';
import getTetrimino from './getTetrimino';

export const useTetriminos = defineStore('tetriminos', () => {
  let tetrimino = getTetrimino();
  const tetriminoRow = ref(0);
  const tetriminoCol = ref(3);

  let falling = false;

  const matrix = ref([]);

  const keys = {
    enter: 13,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    pause: 80,
    restart: 82,
    ere: 82
  };

  const listenKeyboard = () => {
    document.addEventListener('keydown', keyboard);
  }
  
  const keyboard = (key) => {
    if (key.keyCode == keys.right) {
      tetriminoCol.value++;
      updateCells();
    }
  
    if (key.keyCode == keys.left) {
      tetriminoCol.value--;
      updateCells();
    }

    if (key.keyCode == keys.down) {
      falling = true;
      while(falling) {
        processing();
      }
    }

    if (key.keyCode === keys.ere || key.keyCode ===keys.up) {
      if (tetrimino.position === 'north') { tetrimino.position = 'east'; return };
      if (tetrimino.position === 'east') { tetrimino.position = 'south'; return };
      if (tetrimino.position === 'south') { tetrimino.position = 'west'; return };
      if (tetrimino.position === 'west') { tetrimino.position = 'north'; return };
    }
  }

  const getColor = (row, col) => {
    const matchMatrix = tetrimino.sides[tetrimino.position]
      .find((mino) => (tetriminoRow.value + mino[0]) === row && (tetriminoCol.value + mino[1]) === col);

    if (matchMatrix) {
      return tetrimino.color;
    }

    return null;
  }

  const createCells = () => {
    matrix.value = [];
    for (let r = 0; r <= 19; r++) {
      matrix.value.push([]);
      for (let c = 0; c <= 9; c++) {
        matrix.value[r].push({
          col: c,
          color: getColor(r, c),
          locked: false
        });
      }
    }
  };

  const updateCells = () => {
    for (let r = 0; r <= 19; r++) {
      for (let c = 0; c <= 9; c++) {
        if (matrix.value[r] && !matrix.value[r][c].locked) {
          matrix.value[r][c].color = getColor(r, c);
        }
      }
    }
  };

  const lockCells = () => {
    falling = false;
    tetrimino.sides[tetrimino.position].forEach((mino) => {
      matrix.value[tetriminoRow.value + mino[0]][tetriminoCol.value + mino[1]].color = tetrimino.color;
      matrix.value[tetriminoRow.value + mino[0]][tetriminoCol.value + mino[1]].locked = true;
    });
  }

  const reviewForLine = () => {
    let lockedLines = [];
    for (let r = 19; r >= 0; r--) {
      let totalLocked = 0;
      for (let c = 0; c <= 9; c++) {
        if (matrix.value[r][c].locked) {
          totalLocked++;
        }
      }
      if (totalLocked === 10) {
        lockedLines.push(r);
      }
    }

    lockedLines.forEach((line) => {
      matrix.value.splice(line, 1);
    });

    lockedLines.forEach(() => {
      matrix.value.unshift([]);
      for (let c = 0; c <= 9; c++) {
        matrix.value[0].push({
          col: c,
          color: null,
          locked: false
        });
      }
    });
  };
  
  const callTetrimino = () => {
    tetriminoRow.value = 0;
    tetriminoCol.value = 4;
    tetrimino = getTetrimino();
  }

  const processing = () => {
    const isOutOfRange = tetrimino.sides[tetrimino.position]
      .filter((mino) => tetriminoRow.value + mino[0] + 1 >= 20);

    const hasBlockedWayDown = tetrimino.sides[tetrimino.position]
      .filter((mino) => matrix.value[tetriminoRow.value + mino[0] + 1]
        && matrix.value[tetriminoRow.value + mino[0] + 1][tetriminoCol.value + mino[1]]
        && matrix.value[tetriminoRow.value + mino[0] + 1][tetriminoCol.value + mino[1]].locked);
    
    if (isOutOfRange.length === 0 && hasBlockedWayDown.length === 0) {
      tetriminoRow.value++;
    } else {
      lockCells();
      reviewForLine();
      callTetrimino();
    }
  };

  setInterval(processing, 300);

  watch(() => tetriminoRow.value, () => {
    updateCells();
  });

  createCells();
  listenKeyboard();

  return { tetrimino, matrix }
})
