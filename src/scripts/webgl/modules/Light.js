import * as THREE from "three";
import { WebGLParmas } from "../../Variables";
import { Config } from "../../Config";

const MAP_SIZE = WebGLParmas.mapSize;

export class Light {
  constructor(_stage) {
    this.stage = _stage;
  }

  spot(
    _params = {
      color: new THREE.Color("#d6faff"),
      intensity: 1,
      angle: Math.PI / 6,
      position: new THREE.Vector3(55, 25, 15),
      distance: 160,
      far: 160,
      penumbra: 1,
      decay: 2,
      map: null,
    },
  ) {
    const spot = new THREE.SpotLight(_params.color, _params.intensity);
    spot.angle = _params.angle;
    spot.penumbra = _params.penumbra; //ボケ具合:ライトをぼかしてくれる
    spot.decay = _params.decay; //減衰率:影の奥行きへのグラデーション
    spot.castShadow = true;
    spot.shadow.mapSize.width = MAP_SIZE;
    spot.shadow.mapSize.height = MAP_SIZE;
    spot.shadow.camera.near = 1;
    spot.shadow.focus = 1; //影をどれだけ見るか
    spot.position.copy(_params.position);
    spot.distance = _params.distance;
    spot.shadow.camera.far = _params.far;
    if (_params.map != null) spot.map = _params.map;
    this.stage.scene.add(spot);

    if (Config.isLightHelper) {
      const helper = new THREE.SpotLightHelper(spot);
      this.stage.scene.add(helper);
    }

    if (Config.isGui) {
      const folder = GUI.addFolder("spotLight");
      folder.close();
      folder
        .addColor(spot, "color")
        .name("spot: color")
        .onChange((value) => {
          spot.color = new THREE.Color(value);
        });
      folder
        .add(spot, "intensity", 0.0, 100.0)
        .name("spot: intensity")
        .onChange((value) => {
          spot.intensity = value;
        });

      folder
        .add(spot, "penumbra", 0.0, 10.0)
        .name("spot: penumbra")
        .onChange((value) => {
          //ボケ具合:ライトをぼかしてくれる
          spot.penumbra = value;
        });
      folder
        .add(spot, "decay", 0.0, 10.0)
        .name("spot: decay")
        .onChange((value) => {
          //減衰率:影の奥行きへのグラデーション
          spot.decay = value;
        });

      folder
        .add(spot.shadow, "focus", 0.0, 10.0)
        .name("spot: focus")
        .onChange((value) => {
          //影をどれだけ見るか
          spot.shadow.focus = value;
        });

      folder
        .add(spot, "distance", 0.0, 200.0)
        .name("spot: distance")
        .onChange((value) => {
          spot.distance = value;
        });

      folder
        .add(spot.shadow.camera, "far", 0.0, 200.0)
        .name("spot: far")
        .onChange((value) => {
          spot.shadow.camera.far = value;
        });

      folder
        .add(spot.position, "x", 0.0, 100.0)
        .name("spot: x")
        .onChange((value) => {
          spot.position.x = value;
        });

      folder
        .add(spot.position, "y", 0.0, 100.0)
        .name("spot: y")
        .onChange((value) => {
          spot.position.y = value;
        });

      folder
        .add(spot.position, "z", 0.0, 100.0)
        .name("spot: z")
        .onChange((value) => {
          spot.position.z = value;
        });
    }

    return spot;
  }

  ambient(
    _params = {
      color: new THREE.Color("#fff"),
      intensity: 0.2,
    },
  ) {
    const ambient = new THREE.AmbientLight(_params.color, _params.intensity);
    this.stage.scene.add(ambient);

    if (Config.isGui) {
      const folder = GUI.addFolder("ambientLight");
      folder.close();
      folder
        .addColor(ambient, "color")
        .name("ambient: color")
        .onChange((value) => {
          ambient.color = Color(value);
        });
      folder
        .add(ambient, "intensity", 0.0, 2.0)
        .name("ambient: intensity")
        .onChange((value) => {
          ambient.intensity = value;
        });
    }

    return ambient;
  }

  directional(
    _params = {
      color: new THREE.Color("#fff"),
      intensity: 1,
      position: new THREE.Vector3(20, 20, 20),
      distance: 20,
    },
  ) {
    const directional = new THREE.DirectionalLight(_params.color, _params.intensity);
    const distance = _params.distance;
    // directional.position.set(-distance, distance, distance);
    directional.position.copy(_params.position);
    directional.castShadow = true;
    directional.shadow.mapSize.width = MAP_SIZE;
    directional.shadow.mapSize.height = MAP_SIZE;
    directional.shadow.camera.left = -distance;
    directional.shadow.camera.right = distance;
    directional.shadow.camera.top = distance;
    directional.shadow.camera.bottom = -distance;
    directional.shadow.camera.far = 3 * distance;
    directional.shadow.camera.near = distance;
    this.stage.scene.add(directional);

    if (Config.isGui) {
      const folder = GUI.addFolder("directionalLight");
      folder.close();
      folder
        .addColor(directional, "color")
        .name("directional: color")
        .onChange((value) => {
          directional.color = new THREE.Color(value);
        });
      folder
        .add(directional, "intensity", 0.0, 100.0)
        .name("directional: intensity")
        .onChange((value) => {
          directional.intensity = value;
        });

      folder
        .add(directional.shadow.camera, "far", 0.0, distance * 10.0)
        .name("directional: far")
        .onChange((value) => {
          directional.shadow.camera.far = value;
        });
    }

    return directional;
  }
}
