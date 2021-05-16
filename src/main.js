import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

import VueCoreVideoPlayer from 'vue-core-video-player'

const tr = {
    "dashboard": {
        "btn": {
            "play": "Oynat",
            "pause": "Durdur",
            "fullscreen": "Tam Ekran",
            "exitFullscreen": "Tam Ekrandan Çık",
            "mute": "Sessize Al",
            "unmute": "Sesi Aç",
            "back": "Geri",
            "pip": "Ekran içinde Ekran"
        },
        "settings": {
            "autoplay": "OtoOynat",
            "loop": "Döngü",
            "speed": "Hız",
            "resolution": "Kalite"
        }
    },
    "layers": {
        "error": {
            "title": "(O_O)?  Hata!",
            "2404": "Video Kaynağı Bulunamadı",
            "2502": "Media Network Hatası",
            "2503": "Video DECODE edilemedi",
            "2504": "Video Oynatılamıyor!"
        },
        "loading": {
            "msg": "Yükleniyor ..."
        }
    }
};

Vue.use(VueCoreVideoPlayer, {
    lang: tr,
});

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app')
