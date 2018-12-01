<template>
  <div class="stage">
    <div ref="stage" @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp" />
  </div>
</template>

<script>
import * as THREE from 'three'

export default {
  name: 'MonitorCamera',
  props: {
    config: { type: Object, default: () => { return null } },
    cameraRotaion: { type: Object, default: () => { return null } }
  },
  data () {
    console.log('data')
    // === scene ===
    const scene = new THREE.Scene()
    // === renderer ===
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(640, 480)
    // === camera ===
    let useCamera, controlCamera, controlCameraHelper
    this.config.cameras.forEach((element, index) => {
      const currCamera = new THREE.OrthographicCamera(...element.option)
      if (element.helper) {
        const camhelper = new THREE.CameraHelper(currCamera)
        scene.add(camhelper)
        controlCameraHelper = camhelper
      }
      if (element.lookAt) {
        currCamera.lookAt(new THREE.Vector3(...element.lookAt))
      }
      if (element.position) {
        currCamera.position.x = element.position.x
        currCamera.position.y = element.position.y
        currCamera.position.z = element.position.z
      }
      if (index === this.config.cameraUseIndex) {
        useCamera = currCamera
      } else {
        controlCamera = currCamera
      }
    })
    this.config.planes.forEach(element => {
      const plane = new THREE.Plane(new THREE.Vector3(...element.geo), element.distance)
      scene.add(plane)
      const helper = new THREE.PlaneHelper(plane, 10, 0xffff00)
      scene.add(helper)
    })
    // === light ===
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1)
    hemiLight.color.setHSL(1, 1, 1)
    hemiLight.groundColor.setHSL(0.095, 1, 0.75)
    hemiLight.position.set(0, 5, 0)
    scene.add(hemiLight)

    return {
      scene: scene,
      renderer: renderer,
      camera: useCamera,
      light: hemiLight,
      rotate: Math.PI / 90,
      rotating: false,
      originRotate: null,
      originXY: null,
      controlCamera: controlCamera,
      controlCameraHelper: controlCameraHelper
    }
  },
  created () {
    console.log('created')
    this.scene.add(new THREE.AxesHelper(5))
    this.drawRaycastLine({
      ray: {
        origin: { x: 1, y: 1, z: 1 },
        direction: { x: 1.5, y: 1.5, z: 1 }
      }
    })
    this.scene.add(this.camera)
    this.scene.add(this.light)
    this.scene.add(this.cube)

    var cube2 = this.newCube()
    cube2.position.x = -1
    cube2.position.y = -1
    cube2.position.z = -1
    this.scene.add(cube2)
  },
  mounted () {
    this.$refs.stage.appendChild(this.renderer.domElement)
    this.animate()
  },
  watch: {
    'cameraRotaion': function (newVal) {
      if (newVal) {
        console.log('sync:' + this.cameraRotaion.x + ' , ' + this.cameraRotaion.y)
        this.controlCamera.rotation.x = this.cameraRotaion.x
        this.controlCamera.rotation.y = this.cameraRotaion.y
        this.controlCamera.updateMatrixWorld()
        // this.controlCamera.updateMatrix()
        // this.controlCamera.updateProjectionMatrix()
        this.controlCameraHelper.update()
        this.controlCameraHelper.visible = true
      }
    }
  },
  methods: {
    newCube () {
      const geometry = new THREE.BoxGeometry(1, 1, 1)
      const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
      return new THREE.Mesh(geometry, material)
    },
    animate () {
      requestAnimationFrame(this.animate)
      // this.cube.rotation.y += this.rotate
      // this.camera.rotation.z += this.rotate
      // var delta = this.clock.getDelta()
      // this.controls.update()
      this.renderer.render(this.scene, this.camera)
    },
    onMouseDown (event) {
      // left button
      this.rotating = event.button === 0
      if (this.rotating) {
        this.originRotate = { x: this.camera.rotation.x || 0, y: this.camera.rotation.y || 0 }
        this.originXY = { x: event.clientX, y: event.clientY }
        // console.log('r:' + this.originRotate.x + ' , ' + this.originRotate.y)
        // console.log('m:' + this.originXY.x + ' , ' + this.originXY.y)
      }
    },
    onMouseUp (event) {
      this.rotating = false
    },
    onMouseMove (event) {
      if (this.rotating) {
        // console.log(event.clientX + ' , ' + event.clientY)

        event.preventDefault()
        this.camera.rotation.y = this.originRotate.x - (event.clientX - this.originXY.x) * this.rotate
        this.camera.rotation.x = this.originRotate.y - (event.clientY - this.originXY.y) * this.rotate
        this.camera.updateMatrix()
        if (this.config.emitControl) {
          this.$emit('rotate', {
            x: this.camera.rotation.x,
            y: this.camera.rotation.y
          })
        }
      }
    },
    drawRaycastLine (raycaster) {
      let material = new THREE.LineBasicMaterial({
        color: 0xffff00,
        linewidth: 1
      })
      let geometry = new THREE.Geometry()
      let startVec = new THREE.Vector3(
        raycaster.ray.origin.x,
        raycaster.ray.origin.y,
        raycaster.ray.origin.z)

      let endVec = new THREE.Vector3(
        raycaster.ray.direction.x,
        raycaster.ray.direction.y,
        raycaster.ray.direction.z)

      // could be any number
      endVec.multiplyScalar(5000)

      // get the point in the middle
      let midVec = new THREE.Vector3()
      midVec.lerpVectors(startVec, endVec, 0.5)

      geometry.vertices.push(startVec)
      geometry.vertices.push(midVec)
      geometry.vertices.push(endVec)

      let line = new THREE.Line(geometry, material)
      this.scene.add(line)
    }
  },
  computed: {
  }
}
</script>

<style>
.stage{
  width: 640px;
  height: 480px;
  display: inline-block;
}
</style>
