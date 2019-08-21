<template>
  <div class="home">
    <div style="text-align:left;">
      <p>
        <span>This is demo about how to measure the angle and coordinate of specific point.The point is on a surface of an object and casted from a camera view.</span>
      </p>
      <p>
        <span>Click on the green/blue/orange block to see calc result, or drag to rotate the camera.</span>
      </p>
    </div>
    <MonitorCamera :config="monitorConfig" @rotate="onCameraRotated" @cast="onRayCasted" @obj="gotObject" />
    <MonitorCamera :config="observerConfig" :camera-rotaion="syncRotation" :ray-casting="castRay" />
    <div style="text-align:left;">
      <p>
        <span>Angle from center of camera view: {{ Math.round(objPosition.degree * 100) / 100 }}</span>
        <span>, Height of target(fixed by object):{{ Math.round((6 + objPosition.z) * 100) / 100 }}</span>
        <span> ----> </span>
        <span>Coordinate: ({{ Math.round(objPosition.x * 100) / 100 }}, {{ Math.round(objPosition.y * 100) / 100 }})</span>
      </p>
    </div>
    <div style="position:absolute;left:0px;bottom:0px;">
      <div>
        <a href="mailto:xvkai2010@gmail.com">xvkai2010@gmail.com</a>
      </div>
      <div>
        <a href="mailto:xukai@ai2-jp.com">xukai@ai2-jp.com</a>
      </div>
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
    const commonSize = { w: 600, h: 480 }
    const groundCube = {
      geo: [10, 10, 0.1],
      color: 0xeeeeee,
      position: { x: 0, y: 0, z: -6 }
    }
    const levelColor = 0x00ff00
    const commonObjects = [groundCube]
    const cubeSize = 2
    const cubeHeight = 4.5
    commonObjects.push(this.createObject(cubeSize, -2, 2, cubeHeight, levelColor))
    commonObjects.push(this.createObject(cubeSize, 1, 1.5, 4, 0x00f0ff))
    commonObjects.push(this.createObject(cubeSize, -0.5, 0.5, 3, 0xf06060))

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
      // console.log(`got ${pt.x}, ${pt.y}, ${pt.z}`)
      this.castRay = pt
    },
    gotObject (obj) {
      this.objPosition = obj
    },
    createObject (cubeSize, startX, startY, cubeHeight, levelColor) {
      return {
        geo: [cubeSize, cubeSize, 0.01],
        color: levelColor,
        position: { x: startX, y: startY, z: -cubeHeight }
      }
    }
  }
}
</script>
