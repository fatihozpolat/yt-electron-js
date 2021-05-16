<template>
  <v-container>
    <v-col cols="12" v-if="video">
      <v-card elevation="4" class="pa-4">
        <h3>{{ title }}</h3>
        <div class="player-container">
          <vue-core-video-player :src="video" :cover="thumbnail" v-on:ended="videoEnd"></vue-core-video-player>
        </div>
      </v-card>
      <v-col cols="12">
        <v-row>
          <v-col cols="4" v-for="(related,index) in related_videos" :key="related.id">
            <related-card :related="related"></related-card>
          </v-col>
        </v-row>
      </v-col>
    </v-col>
    <loading v-else></loading>
  </v-container>
</template>

<script>
const {ipcRenderer} = require('electron');
let app = null;

ipcRenderer.on('sonuc:videoGetir', (e, data) => {
  app.video = data.videoSource;
  app.title = data.title;
  app.thumbnail = data.thumbnail;
  app.related_videos = data.related_videos;
});

import RelatedCard from "@/components/RelatedCard";
import Loading from "@/components/Loading";

export default {
  name: "VideoIcerik",
  components: {
    RelatedCard,
    Loading
  },
  mounted() {
    app = this;
    ipcRenderer.send('yt:videoGetir', this.$route.params.videoid);
  },
  data() {
    return {
      video: null,
      title: null,
      thumbnail: null,
      related_videos: []
    }
  },
  methods: {
    videoEnd: function () {
      if (this.$store.state.zeusAutoplay) {
        this.video = null;
        ipcRenderer.send('yt:videoGetir', this.related_videos[0].id);
      }
    }
  },
  watch: {
    $route: function (to, from) {
      if (to.name === 'VideoIcerik') {
        this.video = null;
        ipcRenderer.send('yt:videoGetir', this.$route.params.videoid);
      }
    }
  }
}
</script>
