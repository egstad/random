<template>
  <article
    class="pair"
    :class="[{ 'is-active': imageIsVisible }, { 'is-visible': isInView }]"
    @click.prevent="toggle"
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
      <figcaption>
        <a
          :href="`https://en.wikipedia.org/wiki/${formatStringForWiki(
            combo.imageQueryString
          )}`"
          @click.stop
          target="_blank"
          >{{ combo.imageQueryString }}</a
        >
      </figcaption>
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
      observerAnimation: null,
      isInView: false,
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
        this.observerLazyLoad,
        this.observerOptions
      );
      this.observer.observe(this.$refs.post);

      // animation
      this.observerAnimation = new IntersectionObserver(
        this.observerAnimationCallback
      );
      this.observerAnimation.observe(this.$refs.post);
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
    observerLazyLoad(entries) {
      entries.map((entry) => {
        if (entry.isIntersecting) {
          this.getImage();
          this.observer.unobserve(this.$refs.post, this.observerOptions);
        }
      });
    },
    observerAnimationCallback(entries) {
      entries.map((entry) => {
        entry.isIntersecting ? (this.isInView = true) : (this.isInView = false);
      });
    },
    show() {
      this.$el.scrollIntoView();
      this.imageIsVisible = true;
    },
    hide() {
      this.imageIsVisible = false;
    },
    toggle() {
      this.imageIsVisible ? this.hide() : this.show();
    },
    formatStringForWiki(str) {
      return str.split(" ").join("_");
    },
  },
};
</script>

<style scoped>
.pair {
  width: 100%;
  opacity: 0.3;
  transition: opacity 300ms ease-out;
}
.pair.is-visible {
  opacity: 1;
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
  transition: color 250ms ease-out;
  padding-left: 24px;
  padding-right: 24px;
  /* mix-blend-mode: exclusion; */
  /* min-height: 64px; */
}

.is-active:hover .pair__header {
  color: white;
}

.pair__adjective {
  text-align: right;
  margin-right: 0.0125em;
}
.pair__noun {
  text-transform: uppercase;
}

.pair__pic {
  overflow: hidden;
  position: relative;
  /* display: flex; */
  /* justify-content: center; */
  max-height: 0;
  opacity: 0;
  transition: max-height 450ms ease-in-out, opacity 250ms 100ms ease-out;
}
.is-active .pair__pic {
  max-height: 100vh;
  opacity: 1;
}

.pair__pic img {
  max-height: 75vh;
  height: 100%;
  width: auto;
  width: 100%;
  margin: 0 auto;
  transform: scale(0.95);
  transition: transform 350ms ease-in-out;
  object-fit: contain;
}
.is-active .pair__pic img {
  transform: translate3d(0, 0, 0) scale(1);
}

.pair__pic figcaption {
  position: relative;
  z-index: 100;
  /* top: 0.5em; */
  /* left: 0.5em; */
  /* right: 0.5em;  */
  display: flex;
  justify-content: center;
}

.pair__pic a {
  text-align: center;
  font-family: monospace;
  text-transform: uppercase;
  /* background: rgba(0, 0, 0, 0.3);
  backdrop-filter: 5px;
  border-radius: 100vw; */
  /* color: rgba(255, 255, 255, 0.5); */
  color: #524e2f;

  padding: 0.2em 1em;
  text-decoration: none;
  font-size: 0.8em;
  letter-spacing: 0.05em;

  transition: color 200ms ease-in-out, background-color 200ms ease-in-out;
}

.pair__pic a:hover {
  color: white;
  background: black;
}

.t-display {
  font-size: 10vw;
  letter-spacing: -0.02em;
  color: #4a462a;
}

@media (max-width: 768px) {
  .t-display {
    font-size: 11.5vw;
    padding: 0.7vw 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
  max-height: 10vw;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  max-height: 0;
}
</style>
