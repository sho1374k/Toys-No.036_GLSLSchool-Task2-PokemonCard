import * as THREE from "three";
import gsap from "gsap";

import { AssetsLoader } from "../utils/AssetsLoader";
import { Config } from "../../Config";
import { Calc } from "../utils/Calc";
import { WebGLParmas } from "../../Variables";

import fragmentShader from "../../../shaders/frag/card.glsl";
import vertexShader from "../../../shaders/vert/card.glsl";
import bgFragmentShader from "../../../shaders/frag/bg.glsl";
import bgVertexShader from "../../../shaders/vert/bg.glsl";

const CARD_LENGTH = WebGLParmas.cardMesh.length;

export class Objects {
  constructor(_stage, _params) {
    this.stage = _stage;
    this.params = _params;
    this.isInitialized = false;
    this.isAbleToUpdate = true;
    this.isAbleToMotion = false;
    this.isAbleToHover = false;
    this.isAbleToClickRay = true;
    this.isAbleToSelectRay = false;
    this.isSelectedRay = false;

    this.group = null;
    this.bgMesh = null;

    this.pointer = {
      target: { x: 0, y: 0 },
      current: { x: 0, y: 0 },
      interpolation: 0.1,
    };

    this.lookAt = {
      vector: new THREE.Vector3(),
      target: { x: 0, y: 0, z: 0 },
      current: { x: 0, y: 0, z: this.stage.camera.position.z },
      interpolation: 0.25,
    };

    this.timer = { move: null };

    this.progress = {
      dissolve: 0.0,
      hover: 0.0,
      hoverEnable: 0.0,
    };

    this.stateVector = {
      standby: {
        scale: 1.5,
        rotation: [
          { z: Calc.degreeToRadian(28) },
          { z: Calc.degreeToRadian(20) },
          { z: Calc.degreeToRadian(12) },
          { z: Calc.degreeToRadian(4) },
          { z: Calc.degreeToRadian(-4) },
          { z: Calc.degreeToRadian(-12) },
          { z: Calc.degreeToRadian(-20) },
          { z: Calc.degreeToRadian(-28) },
        ],
        position: [
          new THREE.Vector3(-3.5, -3 * 0.25, 0),
          new THREE.Vector3(-2.5, -2 * 0.25, 0),
          new THREE.Vector3(-1.5, -1 * 0.25, 0),
          new THREE.Vector3(-0.5, 0, 0),
          new THREE.Vector3(0.5, 0, 0),
          new THREE.Vector3(1.5, -1 * 0.25, 0),
          new THREE.Vector3(2.5, -2 * 0.25, 0),
          new THREE.Vector3(3.5, -3 * 0.25, 0),
        ],
      },
      select: {
        progress: [0, 0, 0, 0, 0, 0, 0],
        position: [
          new THREE.Vector3(-3.5 - 0.25 * 1.5, -3 * 0.25 + 1.5, 0),
          new THREE.Vector3(-2.5 - 0.2 * 1.5, -2 * 0.25 + 1.5, 0),
          new THREE.Vector3(-1.5 - 0.15 * 1.5, -1 * 0.25 + 1.5, 0),
          new THREE.Vector3(-0.5 - 0.1 * 1.5, 0 + 1.5, 0),
          new THREE.Vector3(0.5 + 0.1 * 1.5, 0 + 1.5, 0),
          new THREE.Vector3(1.5 + 0.15 * 1.5, -1 * 0.25 + 1.5, 0),
          new THREE.Vector3(2.5 + 0.2 * 1.5, -2 * 0.25 + 1.5, 0),
          new THREE.Vector3(3.5 + 0.25 * 1.5, -3 * 0.25 + 1.5, 0),
        ],
      },
    };

    this.currentIndex = 0;

    this.loader = new AssetsLoader();
    this.hoverRaycaster = new THREE.Raycaster();
    this.selectRaycaster = new THREE.Raycaster();
    this.clickRaycaster = new THREE.Raycaster();

    this.setEvent();
  }

  init() {
    console.log("🚀 ~ Object init");
    return new Promise(async (resolve) => {
      await this.loadTexture();
      this.createGroup();
      this.createBgMesh();
      await this.createCardMeshs();
      this.setAnime();
      this.isInitialized = true;
      this.debug();
      resolve();
    });
  }

  loadTexture() {
    /*
      📝 Memo
      THREE.NoColorSpace
      THREE.SRGBColorSpace
      THREE.LinearSRGBColorSpace.

      THREE.ClampToEdgeWrapping
      THREE.RepeatWrapping
      THREE.MirroredRepeatWrapping
    */
    return new Promise(async (resolve) => {
      this.cardTexture = await this.loader.toLoadAsyncTexture("assets/img/img_vs.webp");
      this.cardTexture.colorSpace = THREE.SRGBColorSpace;
      this.cardTexture.wrapS = this.cardTexture.wrapT = THREE.RepeatWrapping;
      this.cardBgTexture = await this.loader.toLoadAsyncTexture("assets/img/img_cardBg.webp");
      this.cardBgTexture.colorSpace = THREE.SRGBColorSpace;
      this.cardBgTexture.wrapS = this.cardBgTexture.wrapT = THREE.RepeatWrapping;
      this.colorTexture = await this.loader.toLoadAsyncTexture("assets/img/texture/color.webp");
      this.colorTexture.wrapS = this.colorTexture.wrapT = THREE.MirroredRepeatWrapping;
      this.highlightTexture = await this.loader.toLoadAsyncTexture("assets/img/texture/highlight.webp");
      this.noiseTexture = await this.loader.toLoadAsyncTexture("assets/img/texture/noise.webp");
      this.noiseTexture.wrapS = this.noiseTexture.wrapT = THREE.RepeatWrapping;
      this.patternTexture = await this.loader.toLoadAsyncTexture("assets/img/texture/pattern.webp");
      this.patternTexture.wrapS = this.patternTexture.wrapT = THREE.RepeatWrapping;
      this.dissolveTexture = await this.loader.toLoadAsyncTexture("assets/img/texture/dissolve.webp");
      this.dissolveTexture.wrapS = this.patternTexture.wrapT = THREE.RepeatWrapping;
      this.floorTexture = await this.loader.toLoadAsyncTexture("assets/img/texture/floor.webp");
      this.floorTexture.wrapS = this.floorTexture.wrapT = THREE.RepeatWrapping;
      resolve();
    });
  }

  updateBgMesh() {
    const distanceWorldZ = (this.params.h / Math.tan((this.stage.camera.fov * Math.PI) / 360)) * 0.5;
    const distanceZ = this.stage.camera.position.z - this.bgMesh.position.z;
    const scale = distanceZ / distanceWorldZ;
    this.bgMesh.scale.set(this.params.w * scale, this.params.h * scale, 1);
    this.bgMesh.material.uniforms.uAspect.value = this.params.w / this.params.h;
  }

  createBgMesh() {
    const g = new THREE.PlaneGeometry(1, 1, 1, 1);
    const m = new THREE.ShaderMaterial({
      vertexShader: bgVertexShader,
      fragmentShader: bgFragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uColor: { value: WebGLParmas.bgMesh.color },
        uTexture: { value: this.floorTexture },
        uAspect: { value: this.params.w / this.params.h },
      },
    });
    this.bgMesh = new THREE.Mesh(g, m);
    this.bgMesh.renderOrder = WebGLParmas.bgMesh.renderOrder;
    this.bgMesh.position.z = WebGLParmas.bgMesh.position.z;
    this.updateBgMesh();
    this.stage.scene.add(this.bgMesh);
  }

  createCardMeshs() {
    return new Promise((resolve) => {
      const SCALE = WebGLParmas.cardMesh.scale;

      const standard = THREE.ShaderLib["standard"];
      standard.uniforms.roughness.value = WebGLParmas.cardMesh.roughness;
      standard.uniforms.metalness.value = WebGLParmas.cardMesh.metalness;

      const g = new THREE.PlaneGeometry(WebGLParmas.cardMesh.planeSize.x, WebGLParmas.cardMesh.planeSize.y, 1, 1);
      const baseMaterial = new THREE.ShaderMaterial({
        fragmentShader: fragmentShader,
        vertexShader: vertexShader,
        uniforms: Object.assign(standard.uniforms, {
          uProgress: { value: 1.0 },
          uScale: { value: 1.0 },
          uTime: { value: 0.0 },
          uClipNum: { type: "f", value: 0 + 1 },
          uSplitNum: { type: "f", value: CARD_LENGTH },
          uEdgeColor: { value: WebGLParmas.cardMesh.edgeColor },
          uTextureBg: { value: this.cardBgTexture },
          uTextureCard: { value: this.cardTexture },
          uTextureColor: { value: this.colorTexture },
          uTextureHighlight: { value: this.highlightTexture },
          uTextureNoise: { value: this.noiseTexture },
          uPatternTexture: { value: this.patternTexture },
          uDissolveTexture: { value: this.dissolveTexture },
          uPointer: { value: this.pointer.target },
          uDissolveProgress: { value: this.progress.dissolve },
          uHover: { value: this.progress.hover },
        }),
        lights: true,
        fog: false,
        transparent: true,
        side: THREE.DoubleSide,
        alphaTest: 0.1,
      });

      for (let i = 0; i < CARD_LENGTH; i++) {
        const m = baseMaterial.clone();
        m.uniforms.uClipNum.value = i + 1;
        const mesh = new THREE.Mesh(g, m);
        mesh.renderOrder = WebGLParmas.bgMesh.renderOrder + (CARD_LENGTH - i);
        mesh.index = i;
        mesh.receiveShadow = false;
        mesh.castShadow = true;
        mesh.scale.set(SCALE, SCALE, SCALE);
        mesh.position.set(0, 0, WebGLParmas.cardMesh.position.z - i * 0.1);
        mesh.rotation.set(-Math.PI * 2, Math.PI, 0);
        this.group.add(mesh);
        if (i === CARD_LENGTH - 1) resolve();
      }
    });
  }

  setAnime() {
    const anime4 = () => {
      const DURATION = 1;
      const EASE = "power4.inOut";
      gsap.to(this.group.rotation, {
        duration: DURATION,
        ease: EASE,
        y: 0,
      });

      for (let i = 0; i < this.group.children.length; i++) {
        const mesh = this.group.children[i];
        const scale = this.stateVector.standby.scale;

        this.stateVector.standby.position[i].z = -1 - i * 0.1 - 5;
        this.stateVector.select.position[i].z = -1 - i * 0.1 - 5;

        gsap.to(mesh.position, {
          duration: DURATION,
          ease: EASE,
          x: this.stateVector.standby.position[i].x * scale,
          y: this.stateVector.standby.position[i].y * scale + 1,
          z: this.stateVector.standby.position[i].z,
        });
        gsap.to(mesh.scale, {
          duration: DURATION,
          ease: EASE,
          x: scale,
          y: scale,
          z: scale,
        });
        gsap.to(mesh.rotation, {
          duration: DURATION,
          ease: EASE,
          z: this.stateVector.standby.rotation[i].z,
          onComplete: () => {
            if (i === this.group.children.length - 1) this.isAbleToSelectRay = true;
          },
        });
      }
    };

    const anime3 = () => {
      const DURATION = 1;
      for (let i = 0; i < this.group.children.length; i++) {
        const mesh = this.group.children[i];
        gsap.to(mesh.position, {
          duration: DURATION,
          ease: "power4.inOut",
          x: 0,
          y: 0,
          z: -1 - i * 0.1 - 5,
        });
        gsap.to(mesh.rotation, {
          duration: DURATION,
          ease: "power4.inOut",
          x: -Math.PI * 2,
          y: 0,
          z: 0,
          onComplete: () => {
            anime4();
          },
        });
      }
    };

    const anime2 = () => {
      const DURATION = 1;
      const EASE = "power4.inOut";
      const Z = WebGLParmas.cardMesh.position.z * -1;
      for (let i = 0; i < this.group.children.length; i++) {
        const mesh = this.group.children[i];

        gsap.to(mesh.position, {
          duration: DURATION,
          ease: EASE,
          delay: i * 0.1 * DURATION,
          x: 0,
          y: 0,
          z: (Z - 4 * i) * 0.5 - 3.5,
        });
        gsap.to(mesh.rotation, {
          duration: DURATION,
          ease: EASE,
          delay: i * 0.1 * DURATION,
          x: -Math.PI * 2,
          y: 0,
          z: 0,
          onComplete: () => {
            if (i === Math.floor((this.group.children.length - 1) * 0.5)) anime3();
          },
        });
      }
    };

    const anime1 = () => {
      const DURATION1 = 3,
        DURATION2 = 1,
        EASE_INOUT = "power4.inOut",
        EASE_OUT = "power4.out";

      this.group.rotation.y = Math.PI * -0.125;

      gsap.to(this.progress, {
        duration: DURATION1,
        ease: EASE_OUT,
        dissolve: 1.0,
        onUpdate: () => {
          for (let i = 0; i < this.group.children.length; i++) {
            const mesh = this.group.children[i];
            mesh.material.uniforms.uDissolveProgress.value = this.progress.dissolve;
          }
        },
      });
      gsap.to(this.group.rotation, {
        duration: DURATION2,
        delay: DURATION2,
        ease: EASE_INOUT,
        y: this.params.isMatchMediaWidth ? Math.PI * -0.15 : Math.PI * -0.25,
      });
      if (this.params.isMatchMediaWidth) {
        this.group.position.x = -6;
        gsap.to(this.group.position, {
          duration: DURATION2,
          delay: DURATION2,
          ease: EASE_INOUT,
          x: 0,
        });
      }
      for (let i = 0; i < this.group.children.length; i++) {
        const mesh = this.group.children[i];
        gsap.to(mesh.scale, {
          duration: DURATION2,
          delay: DURATION2,
          ease: EASE_INOUT,
          x: 1,
          y: 1,
          z: 1,
          onComplete: () => {
            if (i === this.group.children.length - 1) anime2();
          },
        });
      }
    };
    setTimeout(() => {
      anime1();
    }, 1000);
  }

  setEvent() {
    window.addEventListener("click", this.onClickRaycast.bind(this));
    if (this.params.isMatchMediaHover) {
      this.isAbleToMotion = true;
      window.addEventListener("mousemove", this.onMove.bind(this));
      if (Config.isPointerDown) {
        this.isAbleToMotion = false;
        window.addEventListener("mousedown", this.onDown.bind(this), { passive: true });
        window.addEventListener("mouseup", this.onUp.bind(this));
      }
    } else {
      this.isAbleToMotion = false;
      window.addEventListener("touchstart", this.onDown.bind(this));
      window.addEventListener("touchmove", this.onMove.bind(this), { passive: true });
      window.addEventListener("touchend", this.onUp.bind(this));
    }
  }

  setMeshLookAt(_x, _y) {
    const h = Math.tan((this.stage.camera.fov * Math.PI) / 180 / 2) * this.stage.camera.position.z * 2;
    const w = h * (this.params.w / this.params.h);
    this.lookAt.target.x = _x * (w * 0.5);
    this.lookAt.target.y = _y * (h * 0.5);
  }

  getNomalizeVector(_x, _y, _w, _h) {
    return {
      x: (_x / _w) * 2 - 1,
      y: -(_y / _h) * 2 + 1,
    };
  }

  onDown(e) {
    if (!this.isAbleToMotion && this.isInitialized) {
      this.isAbleToMotion = true;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      const vector = this.getNomalizeVector(x, y, this.params.w, this.params.h);

      this.pointer.target.x = vector.x;
      this.pointer.target.y = vector.y;
    }
  }

  onMove(e) {
    if (this.isAbleToMotion && this.isInitialized) {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      const vector = this.getNomalizeVector(x, y, this.params.w, this.params.h);

      this.pointer.target.x = vector.x;
      this.pointer.target.y = vector.y;

      const h = Math.tan(((this.stage.camera.fov * Math.PI) / 180) * 0.5) * this.stage.camera.position.z * 2;
      const w = h * (this.params.w / this.params.h);
      this.lookAt.target.x = vector.x * (w * 0.5);
      this.lookAt.target.y = vector.y * (h * 0.5);

      this.setMeshLookAt(vector.x, vector.y);
      this.onMoveAfter(vector.x, vector.y);
    }
  }

  onMoveAfter(_x, _y) {
    clearTimeout(this.timer.move);
    this.timer.move = setTimeout(() => {
      this.pointer.target.x = _x;
      this.pointer.target.y = _y;
      clearTimeout(this.timer.move);
    }, 100);
  }

  onUp() {
    if (this.isAbleToMotion && this.isInitialized) this.isAbleToMotion = false;
  }

  createGroup() {
    this.group = new THREE.Group();
    this.stage.scene.add(this.group);
  }

  resize(_params) {
    this.params = _params;
    this.updateBgMesh();
  }

  updateSelect() {
    if (this.isAbleToSelectRay) this.toRaycastSelect();
  }

  toRaycastSelect() {
    const DURATION = 0.4;
    this.selectRaycaster.setFromCamera(this.pointer.target, this.stage.camera);
    const intersects = this.selectRaycaster.intersectObjects(this.group.children);
    if (!this.isSelectedRay) {
      if (intersects.length > 0) {
        this.currentIndex = intersects[0].object.index;
      } else {
        if (this.currentIndex != -1) this.currentIndex = -1;
      }
      for (let i = 0; i < this.group.children.length; i++) {
        const mesh = this.group.children[i];
        const scale = this.stateVector.standby.scale;
        if (this.currentIndex === i) {
          gsap.to(mesh.position, {
            duration: DURATION,
            x: this.stateVector.select.position[i].x * scale,
            y: this.stateVector.select.position[i].y * scale,
          });
        } else {
          gsap.to(mesh.position, {
            duration: DURATION,
            x: this.stateVector.standby.position[i].x * scale,
            y: this.stateVector.standby.position[i].y * scale + 1,
            z: this.stateVector.standby.position[i].z,
          });
        }
      }
    }
  }

  onClickRaycast(e) {
    if (this.isAbleToSelectRay) {
      if (!this.isSelectedRay && this.isAbleToClickRay) {
        this.clickRaycaster.setFromCamera(this.pointer.target, this.stage.camera);
        const intersects = this.clickRaycaster.intersectObjects(this.group.children);
        if (intersects.length > 0) {
          const DURATION1 = 1;
          const DURATION2 = 0.4;

          this.isSelectedRay = true;
          // this.isAbleToClickRay = false;
          this.currentIndex = intersects[0].object.index;

          gsap.to(this.progress, {
            duration: DURATION1,
            hoverEnable: 1,
          });

          for (let i = 0; i < this.group.children.length; i++) {
            const mesh = this.group.children[i];
            const scale = this.stateVector.standby.scale;
            if (this.currentIndex === i) {
              gsap.to(mesh.position, {
                duration: DURATION1,
                x: 0,
                y: 0,
                z: 0,
              });
              gsap.to(mesh.rotation, {
                duration: DURATION1,
                x: mesh.rotation.x,
                y: mesh.rotation.y + Math.PI * 2,
                z: 0,
                onComplete: () => {
                  this.isAbleToHover = true;
                  if (i === this.group.children.length - 1) this.isAbleToClickRay = false;
                },
              });
            } else {
              gsap.to(mesh.material.uniforms.uDissolveProgress, {
                duration: DURATION1,
                value: 0.0,
                onComplete: () => {
                  mesh.visible = false;
                  if (i === this.group.children.length - 1) this.isAbleToClickRay = false;
                },
              });
              gsap.to(mesh.position, {
                duration: DURATION2,
                x: this.stateVector.standby.position[i].x * scale,
                y: this.stateVector.standby.position[i].y * scale + 1,
                z: this.stateVector.standby.position[i].z - 5,
              });
            }
          }
        }
      } else if (this.isSelectedRay && !this.isAbleToClickRay) {
        this.isAbleToHover = false;
        this.isSelectedRay = false;
        this.isAbleToUpdate = false;

        const DURATION = 1;
        gsap.to(this.progress, {
          duration: DURATION,
          hover: 0,
          hoverEnable: 0,
        });
        for (let i = 0; i < this.group.children.length; i++) {
          const mesh = this.group.children[i];
          const scale = this.stateVector.standby.scale;
          gsap.to(mesh.material.uniforms.uHover, {
            duration: DURATION,
            value: 0.0,
          });
          gsap.to(mesh.position, {
            duration: DURATION,
            x: this.stateVector.standby.position[i].x * scale,
            y: this.stateVector.standby.position[i].y * scale + 1,
            z: this.stateVector.standby.position[i].z,
          });
          gsap.to(mesh.scale, {
            duration: DURATION,
            x: scale,
            y: scale,
            z: scale,
          });
          gsap.to(mesh.rotation, {
            duration: DURATION,
            x: 0,
            y: Math.PI * 2,
            z: this.stateVector.standby.rotation[i].z,
            onComplete: () => {
              mesh.visible = true;
            },
          });
          gsap.to(mesh.material.uniforms.uDissolveProgress, {
            duration: DURATION,
            delay: DURATION + 0.1,
            value: 1.0,
            onComplete: () => {
              if (i === this.group.children.length - 1) {
                this.isAbleToClickRay = true;
                this.isAbleToUpdate = true;
              }
            },
          });
        }
      }
    }
  }

  updateHover(_time) {
    this.lookAt.current.x = Calc.lerp(this.lookAt.current.x, this.lookAt.target.x, this.lookAt.interpolation);
    this.lookAt.current.y = Calc.lerp(this.lookAt.current.y, this.lookAt.target.y, this.lookAt.interpolation);
    if (this.isAbleToHover) {
      this.progress.hover *= this.progress.hoverEnable;
      this.lookAt.vector.set(
        this.lookAt.current.x * -1 * this.progress.hover,
        this.lookAt.current.y * -1 * this.progress.hover,
        this.stage.camera.position.z,
      );
    }
    for (let i = 0; i < this.group.children.length; i++) {
      const mesh = this.group.children[i];
      if (this.isAbleToHover) mesh.lookAt(this.lookAt.vector);
      mesh.material.uniforms.uTime.value = _time;
      mesh.material.uniforms.uPointer.value = this.pointer.target;
    }
    if (this.isAbleToHover) this.toRaycastHover();
  }

  toRaycastHover() {
    const DURATION = 0.4;
    this.hoverRaycaster.setFromCamera(this.pointer.target, this.stage.camera);
    const intersects = this.hoverRaycaster.intersectObjects(this.group.children);
    if (intersects.length > 0) {
      this.currentIndex = intersects[0].object.index;
      gsap.to(this.progress, {
        duration: DURATION,
        hover: 1,
      });
    } else {
      if (this.currentIndex != -1) this.currentIndex = -1;
      gsap.to(this.progress, {
        duration: DURATION,
        hover: 0,
      });
    }
    for (let i = 0; i < this.group.children.length; i++) {
      const mesh = this.group.children[i];
      gsap.to(mesh.material.uniforms.uHover, {
        duration: DURATION,
        value: this.currentIndex === i ? 1.0 : 0.0,
      });
    }
  }

  update(_time) {
    if (this.isInitialized && this.isAbleToUpdate) {
      this.updateSelect();
      this.updateHover(_time);
    }
    if (this.bgMesh != null) {
      this.bgMesh.material.uniforms.uTime.value = _time;
    }
  }

  debug() {
    if (Config.isGui) {
      const folder = GUI.addFolder("bg");
      folder.close();
      folder.addColor(this.bgMesh.material.uniforms.uColor, "value").name("color");
    }
  }
}
