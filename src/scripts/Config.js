const isDev = process.env.NODE_ENV === "development";

export const Config = {
  isDev: isDev,
  isPointerDown: false,

  fps: 30,
  resizeAfterTime: 300,
  orientationAfterTime: 300,

  // --------------------------

  // webgl

  // --------------------------
  isGui: false,
  isStats: false,
  isControls: false,
  core: {
    isFog: false,
  },
  isSceneHelper: false,
  isLightHelper: false,
};
