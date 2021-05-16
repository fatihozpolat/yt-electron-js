<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card outlined elevation="2" class="pa-4 text-center">
          <v-text-field
              label="YouTube'dan Video Adresi..."
              v-model="ytUrl"
              clearable
              solo
              v-on:keydown.enter="kaynakGetir"
          ></v-text-field>
          <v-btn dark @click="kaynakGetir">Kaynağı Getir</v-btn>
        </v-card>
      </v-col>
    </v-row>
    <loading v-if="loading"></loading>
    <v-row>
      <v-col cols="12" v-for="sonuc in aramaSonuclari">
        <v-card outlined elevation="1" class="pa-4">
          <v-row>
            <v-col cols="4">
              <v-img :src="sonuc.thumbnail"></v-img>
            </v-col>
            <v-col cols="8">
              <h4>{{ sonuc.title }}</h4>
              <v-btn class="primary downloadButton" v-if="!sonuc.percent" @click="infodanIndir(sonuc.itag)">İNDİR
              </v-btn>
              <v-progress-linear v-else
                                 color="light-blue"
                                 height="10"
                                 :value="sonuc.percent * 100"
                                 striped
              ></v-progress-linear>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const {ipcRenderer} = require('electron');
let app = null;

ipcRenderer.on('sonuc:videoKaynakGetir', function (e, data) {
  app.loading = false;
  app.videoUrl = data.videoUrl;
  app.aramaSonuclari = data.videoSource;
});

ipcRenderer.on('sonuc:downloadStatus', function (e, data) {
  app.aramaSonuclari.filter(v => v.itag === data.itag)[0].percent = data.percent;
});

import Loading from "@/components/Loading";

export default {
  name: "VideoIcerik",
  components: {
    Loading
  },
  mounted() {
    app = this;
  },
  data() {
    return {
      ytUrl: '',
      loading: false,
      aramaSonuclari: [],
      videoUrl: '',
    }
  },
  methods: {
    kaynakGetir: function () {
      this.loading = true;
      ipcRenderer.send('yt:videoKaynakGetir', this.ytUrl);
    },
    infodanIndir: function (itag) {
      ipcRenderer.send('yt:infodanIndir', {info: this.videoUrl, itag});
    }
  }
}
</script>
<style scoped>
.downloadButton {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
</style>
