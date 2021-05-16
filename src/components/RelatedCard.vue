<template>
  <v-card outlined elevation="2" height="100%" class="card-outter">
    <v-img
        height="150"
        :src="related.thumbnails[0].url"
    ></v-img>
    <v-card-title>
      {{ related.title }}
    </v-card-title>
    <v-card-actions class="card-actions">
      <v-btn color="primary" :to="'/video/'+related.id">
        Görüntüle
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'RelatedCard',
  props: ['related'],
  data: () => ({}),
  methods: {
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
