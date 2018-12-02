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
    cameraRotaion: { type: Object, default: () => { return null } },
    rayCasting: { type: Object, default: () => { return null } }
  },
  data () {
    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(this.config.size.w, this.config.size.h)
    let useCamera, controlCamera, controlCameraHelper
    this.config.cameras.forEach((element, index) => {
      const currCamera = new THREE.PerspectiveCamera(...element.option)
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
      if (element.rotation) {
        currCamera.rotation.x = element.rotation.x
        currCamera.rotation.y = element.rotation.y
        currCamera.rotation.z = element.rotation.z
      }
      if (index === this.config.cameraUseIndex) {
        useCamera = currCamera
      } else {
        controlCamera = currCamera
      }
      currCamera.updateProjectionMatrix()
    })
    this.config.planes.forEach(element => {
      const plane = new THREE.Plane(new THREE.Vector3(...element.geo), element.distance)
      scene.add(plane)
      const helper = new THREE.PlaneHelper(plane, 10, 0xffff00)
      scene.add(helper)
    })

    const objects = this.config.objects.map(element => {
      const newObj = this.createObject(element.geo, element.color, element.position)
      scene.add(newObj)
      return newObj
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
      rotate: (Math.PI / 90) * 0.2,
      rotating: false,
      hasMoueMoved: false,
      originRotate: null,
      originXY: null,
      controlCamera: controlCamera,
      controlCameraHelper: controlCameraHelper,
      raycaster: new THREE.Raycaster(),
      mouse: new THREE.Vector2(),
      intersectPt: null,
      rayLine: null,
      objects: objects
    }
  },
  created () {
    this.scene.add(new THREE.AxesHelper(5))
    this.scene.add(this.camera)
    // this.scene.add(this.light)
  },
  mounted () {
    this.$refs.stage.appendChild(this.renderer.domElement)
    this.animate()
  },
  watch: {
    'cameraRotaion': function (newVal) {
      if (newVal) {
        // console.log('sync:' + this.cameraRotaion.x + ' , ' + this.cameraRotaion.y)
        this.controlCamera.rotation.x = this.cameraRotaion.x
        this.controlCamera.rotation.y = this.cameraRotaion.y
        this.controlCamera.updateMatrixWorld()
        this.controlCameraHelper.update()
        this.controlCameraHelper.visible = true
      }
    },
    'rayCasting': function (newVal) {
      this.drawRaycastLineIndirection(newVal)
    }
  },
  methods: {
    createObject (geo, color, position) {
      const geometry = new THREE.BoxGeometry(...geo)
      const material = new THREE.MeshStandardMaterial({ color: color })
      const cube = new THREE.Mesh(geometry, material)
      cube.position.x = position.x
      cube.position.y = position.y
      cube.position.z = position.z
      return cube
    },
    animate () {
      requestAnimationFrame(this.animate)
      this.renderer.render(this.scene, this.camera)
    },
    onMouseDown (event) {
      this.hasMoueMoved = false
      // left button
      this.rotating = event.button === 0
      if (this.rotating) {
        this.originRotate = { x: this.camera.rotation.x, y: this.camera.rotation.y, z: this.camera.rotation.z }
        this.originXY = { x: event.offsetX, y: event.offsetY }
        // console.log('r:' + this.originRotate.x + ' , ' + this.originRotate.y)
        // console.log('m:' + this.originXY.x + ' , ' + this.originXY.y)
      }
    },
    onMouseUp (event) {
      this.rotating = false
      if (!this.hasMoueMoved || (event.offsetX === this.originXY.x && event.offsetY === this.originXY.y)) {
        // change ray direction
        if (this.config.rayCasting) {
          this.mouse.x = (event.offsetX / this.config.size.w) * 2 - 1
          this.mouse.y = -(event.offsetY / this.config.size.h) * 2 + 1

          // update the picking ray with the camera and mouse position
          this.raycaster.setFromCamera(this.mouse, this.camera)

          // calculate objects intersecting the picking ray
          var intersects = this.raycaster.intersectObjects(this.objects)

          this.objects.forEach(obj => {
            if (obj.prevColor) {
              obj.material.color.set(obj.prevColor)
            } else {
              obj.prevColor = obj.material.color.getHex()
            }
          })
          if (intersects && intersects.length > 0) {
            intersects[0].object.material.color.set(0xff0000)
            const pt = intersects[0].point
            const ptNor = pt.normalize()
            this.$emit('cast', ptNor)
            // console.log(`emit ${pt.x}, ${pt.y}, ${pt.z}`)
            this.drawRaycastLineIndirection(ptNor)

            const angle = this.camera.getWorldDirection().angleTo(ptNor)
            const degree = angle / (Math.PI / 90)
            this.$emit('obj', {
              ...pt,
              mouseX: event.offsetX,
              mouseY: event.offsetY,
              degree: degree
            })
          }
        }
      }
    },
    onMouseMove (event) {
      if (this.rotating) {
        this.hasMoueMoved = true

        event.preventDefault()
        if (this.config.yRotate) {
          this.camera.rotation.y = this.originRotate.y - (event.offsetX - this.originXY.x) * this.rotate
        } else {
          this.camera.rotation.y = this.originRotate.y - (event.offsetX - this.originXY.x) * this.rotate
          this.camera.rotation.x = this.originRotate.x - (event.offsetY - this.originXY.y) * this.rotate
        }
        this.camera.updateMatrix()
        if (this.config.emitControl) {
          this.$emit('rotate', {
            x: this.camera.rotation.x,
            y: this.camera.rotation.y
          })
        }
      }
    },
    drawRaycastLineIndirection (pt) {
      this.drawRaycastLine({
        ray: {
          origin: { x: 0, y: 0, z: 0 },
          direction: pt
        }
      })
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
      if (this.rayLine) {
        this.scene.remove(this.rayLine)
      }
      this.rayLine = new THREE.Line(geometry, material)
      this.scene.add(this.rayLine)
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
