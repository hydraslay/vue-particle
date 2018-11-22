<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <ModelCanvas />
  </div>
</template>

<script>
// @ is an alias to /src
import ModelCanvas from '@/components/ModelCanvas.vue'

export default {
  name: 'home',
  components: {
    ModelCanvas
  }
}
</script>
