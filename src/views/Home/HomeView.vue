<script setup>
import Cell from './components/Cell.vue';
import { useOperations } from '../../stores/operation';
import OneTetrimino from './components/OneTetrimino.vue';

const store = useOperations();

</script>

<template>
  <main>
    <div class="stats">
      <p>Level: {{ store.level }}</p>
      <p>Points: {{ store.points }}</p>
      <p>Lines Cleared {{ store.totalLinesCleared }}</p>
      <p>Lines To Next Level: {{ store.linesToNextLevel }}</p>
    </div>
    <div class="hold-queue">
      <one-tetrimino
      :key="tetrimino.id"
        v-for="tetrimino in store.holdQueue"
        :tetrimino="tetrimino"
      />
    </div>
    <div class="matrix">
      <div
        class="row"
        :key="r"
        v-for="(row, r) in store.matrix"
      >
        <cell
          :key="c"
          v-for="(col, c) in row"
          :cell="col"
        />
      </div>
    </div>
    <div class="next-queue">
      <one-tetrimino
        :key="tetrimino.id"
        v-for="tetrimino in store.nextQueue"
        :tetrimino="tetrimino"
      />
    </div>
  </main>
</template>

<style>
main {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  max-width: 300px;
  margin: auto;
}

.stats { grid-area: 1 / 1 / 2 / 4; }
.hold-queue {
  grid-area: 2 / 1 / 3 / 2;
  padding-right: 20px;
}
.matrix { grid-area: 2 / 2 / 3 / 3; }
.next-queue {
  grid-area: 2 / 3 / 3 / 4;
  padding-left: 20px;
}

.row {
  display: flex;
}
</style>