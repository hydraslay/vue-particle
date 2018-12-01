<template>
  <div class="home">
    <MonitorCamera :config="monitorConfig" @rotate="onCameraRotated" />
    <MonitorCamera :config="observerConfig" :camera-rotaion="syncRotation" />
  </div>
</template>

<script>
import MonitorCamera from '@/components/MonitorCamera.vue'

export default {
  name: 'Home',
  components: {
    MonitorCamera
  },
  data () {
    const topCamOption = [-20, 20, -20, 20, 0, 1000]
    const groundPlain = {
      geo: [10, 10, 0.2],
      distance: 6
    }
    const monitorConfig = {
      cameraUseIndex: 0,
      cameras: [
        { option: topCamOption }
      ],
      planes: [groundPlain],
      emitControl: true
    }
    const observerConfig = {
      cameraUseIndex: 1,
      cameras: [
        {
          helper: true,
          option: topCamOption,
          syncControl: true
        },
        {
          option: [-20, 20, -20, 20, 0, 1000],
          position: { x: 20, y: 1, z: 0 },
          lookAt: [0, 0, 0]
        }
      ],
      planes: [groundPlain]
    }
    return {
      monitorConfig: monitorConfig,
      observerConfig: observerConfig,
      syncRotation: { x: 0, y: 0 }
    }
  },
  methods: {
    onCameraRotated (rot) {
      this.syncRotation = rot
    }
  }
}
</script>
