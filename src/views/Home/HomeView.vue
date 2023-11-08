<script setup>
import { useOperations } from '@/composables/useOperations';
import Cell from './components/Cell.vue';
import Pause from './components/Pause.vue';
import GameOver from './components/GameOver.vue';
import OneTetrimino from './components/OneTetrimino.vue';

const {
  matrix,
  nextQueue,
  holdQueue,
  maxHold,
  level,
  score,
  gameState,
  totalLinesCleared,
  linesToNextLevel
} = useOperations();

</script>

<template>
  <pause v-if="gameState === 'paused'" />
  <game-over v-if="gameState === 'gameOver'" />
  <main>
    <div class="hold-queue">
      <div>
        <one-tetrimino
          :key="tetrimino.id"
          v-for="tetrimino in holdQueue"
          :tetrimino="tetrimino"
        />
        <one-tetrimino
          v-if="holdQueue.length === 0"
        />
      </div>
      <p class="hold-queue-remaining">To Hold <span>{{ maxHold }}</span></p>
    </div>
    <div class="stats">
      <div>
        <p>Level <span>{{ level }}</span></p>
        <p>Score <span>{{ score }}</span></p>
        <p>Lines Cleared <span>{{ totalLinesCleared }}</span></p>
        <p>Remaining Lines <span>{{ linesToNextLevel }}</span></p>
      </div>
    </div>
    <div class="matrix">
      <div
        class="row"
        :key="r"
        v-for="(row, r) in matrix"
      >
        <cell
          :key="c"
          v-for="(col, c) in row"
          :cell="col"
        />
      </div>
    </div>
    <div class="next-queue" v-if="nextQueue.length > 0">
      <div>
        <one-tetrimino
          :key="tetrimino.id"
          v-for="tetrimino in nextQueue"
          :tetrimino="tetrimino"
        />
      </div>
    </div>
    <div class="next-queue" v-if="nextQueue.length === 0">
      <div>
        <one-tetrimino />
        <one-tetrimino />
        <one-tetrimino />
        <one-tetrimino />
        <one-tetrimino />
      </div>
    </div>
  </main>
</template>

<style lang="scss">
main {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  max-width: 300px;
  margin: auto;
  grid-template-areas: 
    "hold matrix next"
    "stats matrix next"; 
}

.stats {
  grid-area: stats;
  font-size: 10px;
  padding: 50px 0px;
  color: white;
  & > div {
    background-color: #8d248a;
    padding: 5px;
  }
  span {
    font-weight: bold;
  }
}

.hold-queue {
  grid-area: hold;
  padding-right: 20px;
  & > div {
    border: 5px solid #01aaee;
  }
  &-remaining {
    background-color: #01aaee;
    padding: 2px;
    color: white;
    font-size: 10px;
    display: inline-block;
    margin-top: 0px;
    position: absolute;
    right: 20px;
    span {
      font-weight: bold;
    }
  }
}

.matrix {
  grid-area: matrix;
  border: 5px solid #8d248a;
}

.next-queue {
  grid-area: next;
  padding-left: 20px;
  & > div {
    border: 5px solid #e71c26;
  }
}

.row {
  display: flex;
}
</style>