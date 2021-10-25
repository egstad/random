<template>
  <div>
    <form @submit.prevent.stop="search">
      <input v-model="searchInput" type="text" @input="capitalize" />
      <button>Search</button>
    </form>

    <table class="table">
      <thead>
        <td>Query String</td>
        <td>Image</td>
        <td>Response</td>
        <td>Copy Link</td>
      </thead>
      <tr v-for="(result, index) in results" :key="index">
        <td>{{ result.query }}</td>
        <td v-if="result.image">
          <img
            :src="result.image.source"
            alt=""
            :width="result.image.width"
            :height="result.image.height"
            class="img"
          />
        </td>
        <td v-else>None</td>
        <td v-if="result.image" style="max-width: 400px">
          <pre>{{ result }}</pre>
        </td>
        <td v-else>None</td>
        <td v-if="result.image">
          <button @click="copyString">Copy String</button>
        </td>
        <td v-else>None</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchInput: null,
      imageQuerySize: 1024,
      results: [],
    };
  },
  methods: {
    search(ev) {
      this.queryWikipedia(this.searchInput);
    },
    async queryWikipedia(queryString) {
      const api = await $fetch(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&&prop=pageimages|pageterms&pithumbsize=${this.imageQuerySize}&titles=${queryString}&origin=*`
      );

      if (api.query.pages[0].thumbnail) {
        this.results.unshift({
          query: queryString,
          image: api.query.pages[0].thumbnail,
        });
      } else {
        this.results.unshift({
          query: queryString,
        });
      }
    },
    copyString() {
      navigator.clipboard.writeText(`"${this.searchInput}",`);
    },
    // capitalize(ev) {
    //   var separateWord = ev.target.value.toLowerCase().split(" ");
    //   for (var i = 0; i < separateWord.length; i++) {
    //     separateWord[i] =
    //       separateWord[i].charAt(0).toUpperCase() +
    //       separateWord[i].substring(1);
    //   }
    //   this.searchInput = separateWord.join(" ");
    // },
  },
};
</script>

<style scoped>
.table {
  width: 100%;
  font-family: monospace;
}

.table,
.table td {
  vertical-align: top;
  border-top: 1px solid white;
  border-bottom: 1px solid white;
}

tr {
  border-top: 1px solid white;
  border-bottom: 1px solid white;
}

td {
  border-left: 1px solid white;
}

.img {
  max-width: 320px;
  display: block;
  width: 100%;
  height: auto;
}
</style>
