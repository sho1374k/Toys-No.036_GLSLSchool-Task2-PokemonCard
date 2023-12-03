import Stats from "three/examples/jsm/libs/stats.module";
import { Config } from "../../Config";

export class Statistics {
  constructor() {
    this.stats = null;
    if (Config.isStats) {
      this.stats = new Stats();
      this.stats.domElement.style = `
        position: fixed; 
        top: 0; 
        left: 0; 
        right: initial; 
        bottom: initial; 
        z-index: 9999; 
        opacity: 0.5;
      `;
      document.body.appendChild(this.stats.domElement);
    }
  }

  update() {
    if (this.stats != null) this.stats.update();
  }
}
