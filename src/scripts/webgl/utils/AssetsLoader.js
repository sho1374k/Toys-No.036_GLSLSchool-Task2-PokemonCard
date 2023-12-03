import { TextureLoader, SRGBColorSpace, VideoTexture } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

export class AssetsLoader {
  constructor() {
    this.modelLoader = null;
    this.modelLoader = new GLTFLoader();

    this.dracoLoader = new GLTFLoader();
    this.dracoLoader.setDRACOLoader(new DRACOLoader().setDecoderPath("draco/"));

    this.textureLoader = new TextureLoader();

    this.envTextureLoader = new RGBELoader();
  }

  toLoadAsyncTexture(_path) {
    return this.textureLoader.loadAsync(_path);
    // return new Promise((resolve) => {
    //   const img = new Image();
    //   img.src = _path;
    //   img.addEventListener("load", (e) => {
    //     return resolve(img);
    //   });
    // });
  }

  toLoadAsyncModel(_path) {
    return this.glbLoader.loadAsync(_path);
  }

  toLoadAsyncDraco(_path) {
    return this.dracoLoader.loadAsync(_path);
  }

  toLoadElementImg(_imgElement) {
    return new Promise((resolve) => {
      const src = _imgElement.getAttribute("src");
      const w = _imgElement.getAttribute("width");
      const h = _imgElement.getAttribute("height");

      const img = new Image();
      img.src = src;
      img.addEventListener("load", (e) => {
        const data = {
          texture: this.textureLoader.load(src),
          ele: _imgElement,
          src: src,
          w: w,
          h: h,
          aspect: w / h,
        };
        data.texture.outputColorSpace = SRGBColorSpace;
        return resolve(data);
      });
    });
  }

  toLoadElementVideo(_videoElement) {
    const src = _videoElement.getAttribute("src");
    const w = _videoElement.getAttribute("width");
    const h = _videoElement.getAttribute("height");

    return new Promise((resolve) => {
      _videoElement.play();
      const data = {
        ele: _videoElement,
        src: src,
        texture: new VideoTexture(_videoElement),
        w: w,
        h: h,
        aspect: w / h,
      };
      data.texture.outputColorSpace = SRGBColorSpace;
      return resolve(data);
    });
  }

  toLoadHDR(_path) {
    return this.envTextureLoader.loadAsync(_path);
  }
}
