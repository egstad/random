<template>
  <section>
    <Post
      v-for="(combo, index) in data.combos"
      :key="`combo-${index}`"
      :combo="combo"
    />
  </section>
</template>

<script setup>
const { data } = await useFetch("/api/combos");
</script>
