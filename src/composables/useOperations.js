import { ref, watch } from 'vue';
import { useTetriminos } from '@/composables/useTetriminos';
import { useStats } from '@/composables/usestats';
import getTetrimino from '../tetriminos/getTetrimino';

export const useOperations = () => {
  const {
    matrix,
    createCells,
    paintTetrimino,
    tetriminoRow,
    tetriminoCol
  } = useTetriminos();

  const {
    level,
    score,
    gameState,
    gameStates,
    levelSpeed,
    linesToNextLevel,
    totalLinesCleared,
    levelLinesCleared,
    goLevelUp,
    updateScore,
    updateGameState,
    addTotalLineCleared,
    addLevelLineCleared
  } = useStats();

  const nextQueue = ref([getTetrimino(), getTetrimino(), getTetrimino(), getTetrimino(), getTetrimino()]);
  const holdQueue = ref([]);
  const maxHold = ref(10);
  let tetrimino = getTetrimino();
  tetriminoCol.value = 3;

  const pausedHolder = {
    holdQueue: [],
    nextQueue: [],
    matrix: []
  }

  let interval;
  let falling = false;

  const keys = {
    enter: 13, //Accept
    left: 37, //Move Left
    up: 38, //Rotate Right
    right: 39, //Move Right
    down: 40, //Soft Drop
    space: 32, //Hard Drop
    pi: 80, //Pause
    ar: 82, //Restart
    zi: 90, //Rotate Left
    eks: 88, //Rotate Right
    ech: 72 //Hold
  };

  const listenKeyboard = () => {
    document.addEventListener('keydown', keyboard);
  }
  
  const keyboard = (key) => {
    const canNotGoRight = tetrimino.sides[tetrimino.position]
      .filter((mino) => tetriminoCol.value + mino[1] + 1 >= 10);
    const hasSomethingRight = tetrimino.sides[tetrimino.position]
      .filter((mino) => {
        const maxRow = tetriminoRow.value + mino[0];
        const maxCol = tetriminoCol.value + mino[1] + 1;
        return matrix.value[maxRow] && matrix.value[maxRow][maxCol] && matrix.value[maxRow][maxCol].locked;
      });
    if (key.keyCode == keys.right && canNotGoRight.length === 0 && hasSomethingRight.length === 0) {
      tetriminoCol.value++;
      paintTetrimino(19, 9, tetrimino);
    }
  
    const canNotGoLeft = tetrimino.sides[tetrimino.position]
      .filter((mino) => tetriminoCol.value + mino[1] -1 < 0);
    const hasSomethingLeft = tetrimino.sides[tetrimino.position]
      .filter((mino) => {
        const minRow = tetriminoRow.value + mino[0];
        const minCol = tetriminoCol.value + mino[1] - 1;
        return matrix.value[minRow] && matrix.value[minRow][minCol] && matrix.value[minRow][minCol].locked;
      });
    if (key.keyCode == keys.left && canNotGoLeft.length === 0 && hasSomethingLeft.length === 0) {
      tetriminoCol.value--;
      paintTetrimino(19, 9, tetrimino);
    }

    if (key.keyCode == keys.space) {
      falling = true;
      while(falling) {
        stepDown();
      }
    }

    if (key.keyCode == keys.down) {
      stepDown();
    }

    if (key.keyCode === keys.zi) {
      if (tetrimino.position === 'north') { tetrimino.position = 'west'; paintTetrimino(19, 9, tetrimino); return };
      if (tetrimino.position === 'west') { tetrimino.position = 'south'; paintTetrimino(19, 9, tetrimino); return };
      if (tetrimino.position === 'south') { tetrimino.position = 'east'; paintTetrimino(19, 9, tetrimino); return };
      if (tetrimino.position === 'east') { tetrimino.position = 'north'; paintTetrimino(19, 9, tetrimino); return };
    }

    if (key.keyCode === keys.eks || key.keyCode ===keys.up) {
      if (tetrimino.position === 'north') { tetrimino.position = 'east'; paintTetrimino(19, 9, tetrimino); return };
      if (tetrimino.position === 'east') { tetrimino.position = 'south'; paintTetrimino(19, 9, tetrimino); return };
      if (tetrimino.position === 'south') { tetrimino.position = 'west'; paintTetrimino(19, 9, tetrimino); return };
      if (tetrimino.position === 'west') { tetrimino.position = 'north'; paintTetrimino(19, 9, tetrimino); return };
    }

    if (key.keyCode === keys.ech && maxHold.value > 0) {
      if (holdQueue.value.length === 1) {
        const aux = holdQueue.value.shift();
        holdQueue.value.push(tetrimino);
        tetriminoRow.value = 0;
        tetriminoCol.value = 4;
        tetrimino = aux;
      } else {
        holdQueue.value.push(tetrimino);
        callTetrimino();
      }
      maxHold.value--;
    }

    if (key.keyCode == keys.pi && gameState.value === gameStates.playing) {
      updateGameState(gameStates.paused);
      clearInterval(interval);

      pausedHolder.holdQueue = holdQueue.value;
      pausedHolder.nextQueue = nextQueue.value;
      pausedHolder.matrix = matrix.value;
      holdQueue.value = [];
      nextQueue.value = [];
      createCells(19, 9);

      document.removeEventListener('keydown', keyboard);
      document.addEventListener('keydown', keyboardOnPaused);
    }
  }

  const keyboardOnPaused = (key) => {
    if (key.keyCode == keys.pi && gameState.value === gameStates.paused) {
      updateGameState(gameStates.playing);

      holdQueue.value = pausedHolder.holdQueue;
      nextQueue.value = pausedHolder.nextQueue;
      matrix.value = pausedHolder.matrix;

      startInterval();
      document.removeEventListener('keydown', keyboardOnPaused);
      document.addEventListener('keydown', keyboard);
    }
  }

  const keyboardOnEnd = (key) => {
    if (key.keyCode == keys.ar && gameState.value === gameStates.gameOver) {
      restart();
      document.removeEventListener('keydown', keyboardOnEnd);
      document.addEventListener('keydown', keyboard);
    }
  }

  const lockCells = () => {
    falling = false;
    tetrimino.sides[tetrimino.position].forEach((mino) => {
      matrix.value[tetriminoRow.value + mino[0]][tetriminoCol.value + mino[1]].colors = tetrimino.colors;
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
      addTotalLineCleared();
      addLevelLineCleared();
      matrix.value.splice(line, 1);
    });

    updateScore(lockedLines.length);

    lockedLines.forEach(() => {
      matrix.value.unshift([]);
      for (let c = 0; c <= 9; c++) {
        matrix.value[0].push({
          col: c,
          colors: [null, null, null],
          locked: false
        });
      }
    });
  };

  const reviewLevel = () => {
    if (linesToNextLevel.value <= 0) {
      levelLinesCleared.value = 0;
      goLevelUp();
      startInterval();
    }
  }

  const callTetrimino = () => {
    tetriminoRow.value = 0;
    tetriminoCol.value = 4;
    moveQueue();

    const {
      isOutOfRange,
      hasBlockedWayDown
    } = getRestrictions();
  
    if (isOutOfRange.length > 0 || hasBlockedWayDown.length > 0) {
      endGame();
    }
  }

  const endGame = () => {
    updateGameState(gameStates.gameOver);
    clearInterval(interval);
    document.removeEventListener('keydown', keyboard);
    document.addEventListener('keydown', keyboardOnEnd);
  }

  const restart = () => {
    updateGameState(gameStates.playing);
    level.value = 1;
    score.value = 0;
    totalLinesCleared.value = 0;
    levelLinesCleared.value = 0;
    startInterval();
    createCells(19, 9);
    callTetrimino();
  };

  const getRestrictions = () => {
    const isOutOfRange = tetrimino.sides[tetrimino.position]
      .filter((mino) => tetriminoRow.value + mino[0] + 1 >= 20);

    const hasBlockedWayDown = tetrimino.sides[tetrimino.position]
      .filter((mino) => matrix.value[tetriminoRow.value + mino[0] + 1]
        && matrix.value[tetriminoRow.value + mino[0] + 1][tetriminoCol.value + mino[1]]
        && matrix.value[tetriminoRow.value + mino[0] + 1][tetriminoCol.value + mino[1]].locked);
      
      return {
        isOutOfRange,
        hasBlockedWayDown
      }
  }

  const stepDown = () => {
    const {
      isOutOfRange,
      hasBlockedWayDown
    } = getRestrictions();
  
    if (isOutOfRange.length === 0 && hasBlockedWayDown.length === 0) {
      tetriminoRow.value++;
    } else {
      lockCells();
      reviewForLine();
      reviewLevel();
      callTetrimino();
    }
  };

  const startInterval = () => {
    clearInterval(interval);
    interval = setInterval(stepDown, levelSpeed.value);
  };

  const moveQueue = () => {
    tetrimino = nextQueue.value.shift();
    nextQueue.value.push(getTetrimino());
  }

  watch(() => tetriminoRow.value, () => {
    paintTetrimino(19, 9, tetrimino);
  });

  createCells(19, 9);
  listenKeyboard();
  startInterval();

  return {
    tetrimino,
    matrix,
    nextQueue,
    holdQueue,
    maxHold,
    level,
    score,
    gameState,
    totalLinesCleared,
    levelLinesCleared,
    linesToNextLevel
  }
}
