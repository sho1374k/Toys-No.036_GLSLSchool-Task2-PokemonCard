// lib
import * as THREE from "three";

// helper
import { Gui } from "../helpers/Gui";
import { Controls } from "../helpers/Controls";
import { Statistics } from "../helpers/Statistics";

// module
import { Config } from "../../Config";
import { WebGLParmas } from "../../Variables";
import { Light } from "./Light";

export class Stage {
  constructor(_params) {
    this.params = _params;
    this.isInitialized = false;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.gui = null;
    this.stats = null;
    this.controls = null;
    this.setStage();
  }

  init() {
    console.log("🚀 ~ Stage init");
    return new Promise((resolve) => {
      this.isInitialized = true;
      resolve();
    });
  }

  setStage() {
    this.setRenderer();
    this.setScene();
    this.setCamera();
    if (Config.core.isFog) this.setFog();
    this.light = new Light();

    // debug
    this.setHelper();
    if (Config.isDev) this.debug();
  }

  setHelper() {
    this.gui = new Gui();
    this.stats = new Statistics();
    this.controls = new Controls({
      camera: this.camera,
      renderer: this.renderer,
    });
  }

  updateRenderer() {
    this.renderer.setSize(this.params.w, this.params.h);
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  }

  setRendererLight() {
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.needsUpdate = true;
    this.renderer.shadowMap.autoUpdate = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // THREE.BasicShadowMap, THREE.PCFShadowMap, THREE.PCFSoftShadowMap, THREE.VSMShadowMap
    this.renderer.outputColorSpace = THREE.SRGBColorSpace; // THREE.LinearSRGBColorSpace, THREE.NoColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping; // THREE.CineonToneMapping
    this.renderer.toneMappingExposure = 1;
    // this.renderer.physicallyCorrectLights = true;
  }

  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.shadowMap.enabled = true;
    this.setRendererLight();
    this.updateRenderer();

    const wrap = document.getElementById("world");
    wrap.appendChild(this.renderer.domElement);
  }

  setScene() {
    this.scene = new THREE.Scene();
    this.scene.background = WebGLParmas.color.scene;
  }

  updateFog() {
    this.scene.fog.far = 1000;
  }

  setFog() {
    this.scene.fog = new THREE.Fog(WebGLParmas.color.scene, 10, 1000);
  }

  updateCamera() {
    // const far = (this.params.h * 0.5) / Math.tan(this.camera.fov * 0.5 * (Math.PI / 180));
    this.camera.far = 10000;
    this.camera.position.z = 10;
    this.camera.aspect = this.params.w / this.params.h;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.camera.updateProjectionMatrix();
  }

  setCamera() {
    this.camera = new THREE.PerspectiveCamera();
    this.camera.fov = 60;
    this.camera.near = 0.1;
    this.updateCamera();
  }

  resize(_params) {
    this.params = _params;
    this.updateRenderer();
    this.updateCamera();
    if (Config.core.isFog) this.updateFog();
  }

  update() {
    if (this.isInitialized) {
      if (this.controls != null) this.controls.update();
      if (this.stats != null) this.stats.update();
    }
  }

  debug() {
    // scene
    {
      if (Config.isSceneHelper) {
        this.scene.add(new THREE.GridHelper(1000, 100));
        this.scene.add(new THREE.AxesHelper(100));
      }
      if (Config.isGui) {
        const folder = GUI.addFolder("scene");
        folder.close();
        folder
          .addColor(this.scene, "background")
          .name("background")
          .onChange((value) => {
            this.scene.background = new THREE.Color(value);
            if (Config.core.isFog) this.fog.color = new THREE.Color(value);
          });
      }
    }

    // fog
    {
      if (Config.isGui && Config.core.isFog) {
        const folder = GUI.addFolder("fog");
        folder.close();
        folder
          .add(this.fog, "near", 0.1, 100)
          .name("near")
          .onChange((value) => {
            this.fog.near = value;
          });
        folder
          .add(this.fog, "far", 1, 1000)
          .name("far")
          .onChange((value) => {
            this.fog.far = value;
          });
      }
    }
  }
}
