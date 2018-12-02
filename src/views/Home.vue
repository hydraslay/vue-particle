<template>
  <div class="home">
    <div style="text-align:left;">
      <p>
        <span>Click on the green/blue/orange block to see calc result, or drag to rotate the camera.</span>
      </p>
    </div>
    <MonitorCamera :config="monitorConfig" @rotate="onCameraRotated" @cast="onRayCasted" @obj="gotObject" />
    <MonitorCamera :config="observerConfig" :camera-rotaion="syncRotation" :ray-casting="castRay" />
    <div style="text-align:left;">
      <p>
        <span>Angle:{{ Math.round(objPosition.degree * 100) / 100 }}</span>
        <span> + Height:{{ Math.round(-objPosition.z * 100) / 100 }}</span>
        <span> ----> </span>
        <span>Ground Coordinate: ({{ Math.round(objPosition.x * 1000) / 1000 }}, {{ Math.round(objPosition.y * 1000) / 1000 }})</span>
      </p>
    </div>
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
    const topCamOption = [80, 4 / 3, 1, 100]
    // const groundPlain = {
    //   geo: [0, 0, 1],
    //   distance: 6
    // }
    const commonSize = { w: 640, h: 480 }
    const groundCube = {
      geo: [10, 10, 0.1],
      color: 0xeeeeee,
      position: { x: 0, y: 0, z: -6 }
    }
    const levelColor = 0x00ff00
    const commonObjects = [groundCube]
    const startX = -3
    const startY = 2
    const cubeSize = 0.1
    const cubeHeight = 4.5
    this.addObjects(commonObjects, cubeSize, startX, startY, cubeHeight, levelColor)

    this.addObjects(commonObjects, cubeSize, 1, 1.5, 4, 0x00f0ff)

    this.addObjects(commonObjects, cubeSize, -0.5, 0.5, 3, 0xf06060)

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
      castRay: { x: 0, y: 0, z: 0 },
      objPosition: { degree: 0, x: 0, y: 0, z: 0 }
    }
  },
  methods: {
    onCameraRotated (rot) {
      this.syncRotation = rot
    },
    onRayCasted (pt) {
      console.log(`got ${pt.x}, ${pt.y}, ${pt.z}`)
      this.castRay = pt
    },
    gotObject (obj) {
      this.objPosition = obj
    },
    addObjects (commonObjects, cubeSize, startX, startY, cubeHeight, levelColor) {
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
          commonObjects.push({
            geo: [cubeSize, cubeSize, 0.01],
            color: levelColor,
            position: { x: startX + row * cubeSize, y: startY + col * cubeSize, z: -cubeHeight }
          })
        }
      }
    }
  }
}
</script>
