import * as THREE from "three";
import { Stage } from "./modules/Stage";
import { Light } from "./modules/Light";
import { Objects } from "./modules/Objects";

export class Controller {
  constructor(_params) {
    this.params = _params;
    this.isInitialized = false;
    this.stage = new Stage(_params);
    this.light = new Light(this.stage);
    this.objects = new Objects(this.stage, _params);
    this.update = this.update.bind(this);
  }

  resize(_params) {
    this.params = _params;
    if (this.isInitialized) {
      this.stage.resize(_params);
      this.objects.resize(_params);
    }
  }

  update() {
    const time = performance.now() * 0.001;
    if (this.isInitialized) {
      this.stage.update();
      this.stage.renderer.render(this.stage.scene, this.stage.camera);
      this.objects.update(time);
    }
  }

  setLight() {
    const intensity = 20;
    this.ambient = this.light.ambient({
      color: new THREE.Color("#fff"),
      intensity: 2,
    });

    this.spot1 = this.light.spot({
      color: new THREE.Color("#fff"),
      intensity: intensity,
      angle: Math.PI / 4,
      position: new THREE.Vector3(4, 4, 4),
      distance: 20,
      far: 20,
      penumbra: 1,
      decay: 2,
      map: null,
    });

    this.spot2 = this.light.spot({
      color: new THREE.Color("#fff"),
      intensity: intensity,
      angle: Math.PI / 4,
      position: new THREE.Vector3(-4, 4, 4),
      distance: 20,
      far: 20,
      penumbra: 1,
      decay: 2,
      map: null,
    });

    this.spot3 = this.light.spot({
      color: new THREE.Color("#fff"),
      intensity: intensity,
      angle: Math.PI / 4,
      position: new THREE.Vector3(4, -4, 4),
      distance: 20,
      far: 20,
      penumbra: 1,
      decay: 2,
      map: null,
    });

    this.spot4 = this.light.spot({
      color: new THREE.Color("#fff"),
      intensity: intensity,
      angle: Math.PI / 4,
      position: new THREE.Vector3(-4, -4, 4),
      distance: 20,
      far: 20,
      penumbra: 1,
      decay: 2,
      map: null,
    });
  }

  init() {
    return new Promise((resolve) => {
      !(async () => {
        await this.stage.init();
        this.setLight();
        await this.objects.init();
        this.resize(this.params);
        this.isInitialized = true;
        resolve();
      })();
    });
  }
}
