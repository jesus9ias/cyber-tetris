<script setup>
defineProps({
  cell: {
    type: Object,
    default: () => ({})
  },
});
</script>

<template>
  <div class="cell">
    <div class="cell__inner" :style="{ background: cell.color, borderColor: cell.secondaryColor }">
    </div>
  </div>
</template>

<style>
.cell {
  width: 20px;
  height: 20px;
  border: 1px solid #2f2f2f;
}
.cell__inner {
  width: 100%;
  height: 100%;
  border-width: 2px;
  border-style: solid;
}
</style>