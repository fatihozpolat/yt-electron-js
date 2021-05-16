<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card outlined elevation="2" class="pa-4 text-center">
          <v-text-field
              label="YouTube'da Video Arayın..."
              v-model="aramaTerimi"
              clearable
              solo
              v-on:keydown.enter="videolariGetir"
          ></v-text-field>
          <v-btn dark @click="videolariGetir">Videoları Getir</v-btn>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="!araniyor">
      <v-col cols="4" v-for="(video,index) in videoListesi" :key="index">
        <video-card :video="video"></video-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <loading></loading>
    </v-row>
  </v-container>
</template>

<script>
const {ipcRenderer} = require('electron');
let app = null;

ipcRenderer.on('sonuc:videoAra', (e, data) => {
  app.videoListesi = data.items;
  app.araniyor = false;
});

import VideoCard from "@/components/VideoCard";
import Loading from "@/components/Loading";

export default {
  name: 'YoutubeSearch',
  mounted() {
    app = this;
  },
  components: {
    VideoCard,
    Loading
  },
  data: () => ({
    aramaTerimi: '',
    araniyor: false,
    videoListesi: [],
  }),
  methods: {
    videolariGetir: function () {
      this.araniyor = true;
      ipcRenderer.send('yt:videoAra', this.aramaTerimi);
    },
  }
};
</script>

<style scoped>
.card-outter {
  position: relative;
  padding-bottom: 60px;
}

.card-actions {
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
