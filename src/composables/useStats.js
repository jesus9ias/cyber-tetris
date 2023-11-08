import { ref, computed } from 'vue';

const levelProperties = {
  1: { lines: 5, speed: 1000 },
  2: { lines: 10, speed: 900 },
  3: { lines: 15, speed: 800 },
  4: { lines: 20, speed: 700 },
  5: { lines: 25, speed: 650 },
  6: { lines: 30, speed: 600 },
  7: { lines: 35, speed: 550 },
  8: { lines: 40, speed: 500 },
  9: { lines: 45, speed: 450 },
  10: { lines: 50, speed: 400 },
  11: { lines: 50, speed: 350 },
  12: { lines: 50, speed: 300 },
  13: { lines: 50, speed: 250 },
  14: { lines: 50, speed: 200 },
  15: { lines: 50, speed: 100 }
};

export const useStats = () => {
  const gameStates = {
    starting: 'starting',
    playing: 'playing',
    paused: 'paused',
    gameOver: 'gameOver',
    success: 'success'
  };

  const gameState = ref(gameStates.playing);
  const level = ref(1);
  const score = ref(0);
  const totalLinesCleared = ref(0);
  const levelLinesCleared = ref(0);

  const levelSpeed = computed(() => levelProperties[level.value].speed);
  const linesToNextLevel = computed(() => levelProperties[level.value].lines - levelLinesCleared.value);

  const updateScore = (clearedLines) => {
    if (clearedLines < 1) {
      return;
    }
    score.value += ((clearedLines * 100) + ((clearedLines - 1) * 100)) * level.value;
  }

  const updateGameState = (state) => {
    gameState.value = state;
  }

  const goLevelUp = () => {
    level.value++;
  }

  const addTotalLineCleared = () => {
    totalLinesCleared.value++;
  }

  const addLevelLineCleared = () => {
    levelLinesCleared.value++;
  }

  return {
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
  }
};
