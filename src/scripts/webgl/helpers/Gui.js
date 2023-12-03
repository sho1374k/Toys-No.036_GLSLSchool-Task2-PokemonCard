import GUI from "three/examples/jsm/libs/lil-gui.module.min";
import { Config } from "../../Config";

export class Gui {
  constructor() {
    this.gui = null;

    if (Config.isGui) {
      window.GUI = null;
      this.gui = new GUI();
      window.GUI = this.gui;
      this.toOpen();
    }
  }

  toOpen() {
    if (this.gui != null) this.gui.open();
  }

  toClose() {
    if (this.gui != null) this.gui.close();
  }
}
