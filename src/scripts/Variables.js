import * as THREE from "three";

export const BREAK_POINT = 768;

export const Params = {
  isMatchMediaWidth: window.matchMedia("(max-width: 768px)").matches,
  isMatchMediaHover: window.matchMedia("(hover: hover)").matches,
  w: window.innerWidth,
  h: window.innerHeight,
  beforeWidth: window.innerWidth,
  longer: 0,
  shorter: 0,
  aspect: 0,
};

export const UpdateParams = () => {
  Params.isMatchMediaWidth = window.matchMedia("(max-width: 768px)").matches;
  Params.isMatchMediaHover = window.matchMedia("(hover: hover)").matches;
  Params.w = window.innerWidth;
  Params.h = window.innerHeight;
  Params.aspect = Params.w / Params.h;
  Params.longer = Params.w > Params.h ? Params.w : Params.h;
  Params.shorter = Params.w < Params.h ? Params.w : Params.h;
};

export const WebGLParmas = {
  bgMesh: {
    renderOrder: 0,
    color: new THREE.Color("#24244c"),
    position: { z: -30 },
  },
  cardMesh: {
    length: 8,
    scale: 3,
    position: { z: -14 },
    roughness: 0.4,
    metalness: 0,
    planeSize: {
      x: 1 * 4,
      y: 1.4 * 4,
    },
    edgeColor: new THREE.Color("#000e7a"),
  },
  color: {
    scene: new THREE.Color("#000e38"),
  },
  mapSize: 2048,
};
