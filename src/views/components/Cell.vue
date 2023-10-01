<script setup>
defineProps({
  cell: {
    type: Object,
    default: () => ({})
  },
});
</script>

<template>
  <div class="cell" :style="{ background: cell.color }">
  </div>
</template>

<style>
.cell {
  width: 20px;
  height: 20px;
  border: 1px solid #2f2f2f;
}
</style>