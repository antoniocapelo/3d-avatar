import React, { useState, useEffect, useRef } from "react"

import Layout from "../components/layout"

import sceneFile from "../assets/scene.json"
import useMousePosition from "../hooks/useMousePosition"

global.THREE = require("three")
let THREE

const setupRenderer = renderer => {
  renderer.setClearColor(0xffffff, 1.0)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
}

const Guy = () => {
  const [ready, setReady] = useState(false)
  const camera = useRef()
  const renderer = useRef()
  const container = useRef()
  const frameRef = useRef()
  const scene = useRef()
  const avatar = useRef()
  const { mousePosition: [mouseX, mouseY], hasMoved} = useMousePosition()
  const totalWidth = window ? window.innerWidth : 0
  const totalHeight = window ? window.innerHeight : 0
  const normalize = (value, t) => {
    if (ready) {
      return (value * 2 - t) / t
    }
    return 0
  }
  const x = normalize(mouseX, totalWidth)
  const y = normalize(mouseY, totalHeight)

  useEffect(() => {
    if (!ready || !hasMoved) {
      return
    }


    avatar.current.rotation.y = x / 2
    avatar.current.rotation.x = y / (totalWidth > totalHeight ? 5 : 2)
  }, [ready, x, y, hasMoved])

  useEffect(() => {
    const handleWindowResize = () => {
      if (!ready) {
        return
      }
      camera.current.aspect = window.innerWidth / window.innerHeight
      camera.current.updateProjectionMatrix()

      renderer.current.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleWindowResize, false)

    return () => {
      window.removeEventListener("resize", handleWindowResize, false)
    }
  }, [ready])

  useEffect(() => {
    THREE = window.THREE

    /* Set Camera, scene and renderer */
    container.current = document.getElementById("container")
    camera.current = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    scene.current = new THREE.Scene()
    camera.current.position.set(0, 0.5, 5)
    renderer.current = new THREE.WebGLRenderer({ antialias: true })
    setupRenderer(renderer.current)
    container.current.appendChild(renderer.current.domElement)

    // Load model
    const loadedScene = new THREE.ObjectLoader().parse(sceneFile)
    loadedScene.background = new THREE.Color("#ffffff")
    const cam = loadedScene.getObjectByName("PerspectiveCamera")
    avatar.current = loadedScene.getObjectByName("main")
    cam.position.z = 7
    cam.aspect = window.innerWidth / window.innerHeight
    cam.updateProjectionMatrix()
    camera.current = cam
    scene.current = loadedScene

    window.camera = camera.current
    window.renderer = renderer.current
    window.scene = scene.current

    setReady(true)
  }, [])

  // Update scene
  useEffect(() => {
    if (!ready) {
      return
    }

    const update = () => {
      renderer.current.render(scene.current, camera.current)
      frameRef.current = requestAnimationFrame(update)
    }
    update()

    return () => {
      cancelAnimationFrame(frameRef.current)
    }
  }, [renderer.current, ready])

  return (
    <div
      id="container"
      style={{
        opacity: ready ? 1 : 0,
        transition: "opacity 0.6s ease-in-out",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    />
  )
}

const IndexPage = () => (
  <Layout>
    <Guy />
  </Layout>
)

export default IndexPage
