import * as THREE from 'three'
// import * as dat from 'dat.gui'
import vertex from './shader/vertexParticles.glsl'
import fragment from './shader/fragment.glsl'
const OrbitControls = require('three-orbit-controls')(THREE)

class App {

  constructor(container) {
    this.container = document.getElementById(container)
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight
    this.time = 0
    this.paused = false
    this.pointsCount = 1000

    this.init()
  }

  init() {
    this.scene = new THREE.Scene()

    this.renderer = new THREE.WebGLRenderer({
      preserveDrawingBuffer: true,
      alpha: true
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.width, this.height)
    this.renderer.setClearColor(0xeeeeee, 1)
    this.renderer.physicallyCorrectLights = true
    this.renderer.outputEncoding = THREE.sRGBEncoding
    this.renderer.autoClear = false

    this.container.appendChild(this.renderer.domElement)

    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.001, 1000)
    this.camera.position.set(0, 0, 2)

    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    this.bindResize()
    this.bindVisibility()
    this.bindMouseMove()
    this.addObjects()
    this.resize()
    this.render()
    // this.setSettings()
  }

  render() {
    if (this.paused) {
      return
    }
    this.time += 0.05
    this.material.uniforms.time.value = this.time
    requestAnimationFrame(this.render.bind(this))
    this.renderer.render(this.scene, this.camera)
  }

  bindResize() {
    window.addEventListener('resize', this.resize.bind(this))
  }

  resize() {
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight
    this.renderer.setSize(this.width, this.height)
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
  }

  addObjects() {
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives'
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: 'f', value: 0 },
        uMouse: { type: 'v2', value: new THREE.Vector2(10, 10) },
        resolution: { type: 'v4', value: new THREE.Vector4() },
      },
      // wireframe: true,
      transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment,
      depthTest: false,
      depthWrite: false,
    })

    this.geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(this.pointsCount * 3)
    const angle = new Float32Array(this.pointsCount)
    const life = new Float32Array(this.pointsCount)
    const offset = new Float32Array(this.pointsCount)
    for (let i = 0; i < this.pointsCount; i++) {
      positions.set(
        [
          Math.random() * .1,
          Math.random() * .1,
          Math.random() * .1
        ],
        i * 3
      )

      angle.set(
        [Math.random() * Math.PI * 2],
        i
      )

      life.set(
        [4 + Math.random() * 10],
        i
      )

      offset.set(
        [1000 * Math.random()],
        i
      )
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.geometry.setAttribute('angle', new THREE.BufferAttribute(angle, 1))
    this.geometry.setAttribute('life', new THREE.BufferAttribute(life, 1))
    this.geometry.setAttribute('offset', new THREE.BufferAttribute(offset, 1))

    this.dots = new THREE.Points(this.geometry, this.material)
    this.scene.add(this.dots)

    this.clearPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshBasicMaterial({
        transparent: true,
        color: 0x0000ff,
        opacity: 0.01
      })
    )
    this.scene.add(this.clearPlane)
  }

  bindVisibility() {
    document.addEventListener('visibilitychange', () => document.hidden ? this.pause() : this.play())
  }

  pause() {
    this.paused = true
  }

  play() {
    this.paused = false
  }

  setSettings() {
    this.settings = {
      time: 0,
    }
    this.gui = new dat.GUI()
    this.gui.add(this.settings, 'time', 1000, 10000, 100)
  }

  bindMouseMove() {
    document.addEventListener('mousemove', (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1

      this.raycaster.setFromCamera(this.mouse, this.camera)

      const intersects = this.raycaster.intersectObjects([this.clearPlane])
      if (intersects[0]) {
        const p = intersects[0].point
        this.material.uniforms.uMouse.value = new THREE.Vector2(p.x, p.y)
      }
    }, false)
  }

}

new App('app')
