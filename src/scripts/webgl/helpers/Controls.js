import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Config } from "../../Config";

export class Controls {
  constructor(_stage) {
    this.controls = null;
    if (Config.isControls) {
      this.controls = new OrbitControls(_stage.camera, _stage.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.2;
      if (Config.isGui && this.controls != null) this.addGui();
    }
  }

  addGui() {
    if (this.controls != null) {
      const controls = GUI.addFolder("controls");
      controls.close();
      controls.add(this.controls, "enabled").onChange((_value) => {
        this.controls.enabled = _value;
      });
    }
  }

  disableDamping() {
    if (this.controls != null) this.controls.enableDamping = false;
  }

  update() {
    if (this.controls != null) this.controls.update();
  }
}
