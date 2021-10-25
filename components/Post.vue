<template>
  <article
    class="pair"
    :class="[{ 'is-active': imageIsVisible }]"
    @click="show"
    ref="post"
  >
    <header v-if="image">
      <h1 class="pair__header t-display">
        <span class="pair__adjective">{{ combo.adjective }}&nbsp;</span>
        <span class="pair__noun">{{ combo.noun }}</span>
      </h1>
      <!-- <pre>{{ combo }}</pre> -->
    </header>

    <figure class="pair__pic" v-if="image">
      <Pic
        :source="image.source"
        :alt="combo.imageQueryString"
        :width="image.width"
        :height="image.height"
      />
    </figure>
  </article>
</template>

<script>
export default {
  data() {
    return {
      imageIsVisible: false,
      imageQuerySize: 1024,
      image: null,
      observer: null,
      observerOptions: { rootMargin: `100% 0px`, threshold: 0 },
    };
  },
  props: {
    combo: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.observer = new IntersectionObserver(
        this.observerCallback,
        this.observerOptions
      );
      this.observer.observe(this.$refs.post);
    });
  },
  methods: {
    async getImage() {
      // `https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&prop=pageimages|pageterms&pithumbsize=${imageQuerySize}&titles=${searchString}`
      const api = await $fetch(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&&prop=pageimages|pageterms&pithumbsize=${this.imageQuerySize}&titles=${this.combo.imageQueryString}&origin=*`
      );

      this.image = api.query.pages[0].thumbnail;
    },
    observerCallback(entries) {
      entries.map((entry) => {
        if (entry.isIntersecting) {
          this.getImage();
          this.observer.unobserve(this.$refs.post, this.observerOptions);
        }
      });
    },
    show() {
      // const x = this.$el.getBoundingClientRect().top;
      // console.log(x);
      // window.scrollTo(x, 0);
      this.$el.scrollIntoView();
      this.imageIsVisible = !this.imageIsVisible;
    },
  },
};
</script>

<style scoped>
.pair {
  width: 100%;
}
.pair:hover {
  color: white;
  cursor: pointer;
}
.pair:hover .pair__header {
  color: white;
}

.pair__header {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  line-height: 0.9;
  position: relative;
  z-index: 3;
}

.is-active .pair__header {
  color: white;
}

.pair__adjective {
  text-align: right;
}
.pair__noun {
  text-transform: uppercase;
}

.pair__pic {
  display: flex;
  justify-content: center;
  max-height: 0;
  opacity: 0;
  transition: max-height 250ms ease-in-out, opacity 250ms ease-in-out;
}
.is-active .pair__pic {
  max-height: 100vh;
  opacity: 1;
}

.pair__pic img {
  max-height: 70vh;
  width: auto;
}

.t-display {
  font-size: 10vw;
  letter-spacing: -0.02em;
  color: #4a462a;
}
</style>
