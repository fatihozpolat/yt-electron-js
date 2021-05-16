<template>
  <v-app>
    <v-app-bar
        app
        dark
        clipped-left
        style="z-index: 1000"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-btn
          text
          to="/"
      >
        <span class="mr-2 text-h5">YT Electron</span>
      </v-btn>
      <v-spacer></v-spacer>
      <v-switch
          class="ma-5 mt-10"
          color="red"
          v-model="zeusAutoplay"
          label="Otomatik Oynat"
      ></v-switch>
      <v-btn
          href="https://github.com/hiizeus"
          target="_blank"
          text
      >
        <span class="mr-2">Github/hiizeus</span>
        <v-icon>mdi-github</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
        v-model="drawer"
        app
        dark
        clipped
    >
      <v-list
          nav
          dense
      >
        <v-list-item-group
            v-model="group"
            active-class="white--text grey darken-4"
        >
          <v-list-item to="/">
            <v-list-item-icon>
              <v-icon>mdi-youtube</v-icon>
            </v-list-item-icon>
            <v-list-item-title>YouTube'da Ara</v-list-item-title>
          </v-list-item>
          <v-list-item to="/videoindir">
            <v-list-item-icon>
              <v-icon>mdi-video</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Video İndir</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  mounted() {
    this.$store.state.zeusAutoplay = this.zeusAutoplay = localStorage.getItem('zeusAutoplay');
  },
  data: () => ({
    drawer: false,
    group: null,
    zeusAutoplay: false,
  }),
  watch: {
    group() {
      this.drawer = false
    },
    zeusAutoplay: function (val) {
      localStorage.setItem('zeusAutoplay', val);
    }
  },
};
</script>
