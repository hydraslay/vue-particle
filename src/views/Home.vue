<template>
  <div class="home">
    <MonitorCamera :config="monitorConfig" @rotate="onCameraRotated" @cast="onRayCasted" />
    <MonitorCamera :config="observerConfig" :camera-rotaion="syncRotation" :ray-casting="castRay" />
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
    const topCamOption = [80, 4 / 3, 1, 7]
    // const groundPlain = {
    //   geo: [0, 0, 1],
    //   distance: 6
    // }
    const commonSize = { w: 640, h: 480 }
    const commonObjects = [
      {
        geo: [0.2, 0.2, 0.2],
        color: 0x00ff00,
        position: { x: 1, y: 2, z: -5 }
      },
      {
        geo: [0.2, 0.2, 0.2],
        color: 0x00a0ff,
        position: { x: -0.5, y: 2, z: -3 }
      },
      {
        geo: [0.35, 0.35, 0.35],
        color: 0xf000f0,
        position: { x: 0.5, y: 3.35, z: -5 }
      },
      {
        geo: [10, 10, 0.1],
        color: 0xeeeeee,
        position: { x: 0, y: 0, z: -6 }
      }
    ]
    const monitorConfig = {
      size: commonSize,
      rayCasting: true,
      cameraUseIndex: 0,
      cameras: [
        { option: topCamOption }
      ],
      planes: [],
      objects: commonObjects,
      emitControl: true
    }
    const observerConfig = {
      yRotate: 'z',
      size: commonSize,
      cameraUseIndex: 1,
      cameras: [
        {
          helper: true,
          option: topCamOption,
          syncControl: true
        },
        {
          option: [100, 4 / 3, 1, 100],
          position: { x: 5, y: 1, z: -5 },
          // lookAt: [0, 0, 0],
          rotation: { x: Math.PI / 2, y: Math.PI / 2, z: 0 }
        }
      ],
      planes: [],
      objects: commonObjects
    }
    return {
      monitorConfig: monitorConfig,
      observerConfig: observerConfig,
      syncRotation: { x: 0, y: 0 },
      castRay: { x: 0, y: 0, z: 0 }
    }
  },
  methods: {
    onCameraRotated (rot) {
      this.syncRotation = rot
    },
    onRayCasted (pt) {
      console.log(`got ${pt.x}, ${pt.y}, ${pt.z}`)
      this.castRay = pt
    }
  }
}
</script>
