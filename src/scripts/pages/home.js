// lib
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// module
import { Params, UpdateParams, BREAK_POINT } from "../Variables";
import { Config } from "../Config";

import { Ua } from "../modules/Ua";
import { SetPropertySize } from "../modules/SetPropertySize";
import { Controller } from "../webgl/Controller";

let resizeTimer = null;

function SetOrientationchange() {
  let orientationTimer = null;
  window.addEventListener("orientationchange", (e) => {
    if (window.orientation != 0) {
      if (Params.w < Params.h) {
        clearTimeout(orientationTimer);
        orientationTimer = setTimeout(() => {
          window.location.reload();
        }, Config.orientationAfterTime);
      }
    }
  });
}

function CheckResizeThreshold() {
  const w = window.innerWidth;
  if (w > BREAK_POINT) {
    if (Params.beforeWidth < BREAK_POINT + 1) window.location.reload();
  }
  if (w < BREAK_POINT + 1) {
    if (Params.beforeWidth > BREAK_POINT + 1) window.location.reload();
  }
  Params.beforeWidth = w;
}

window.addEventListener("DOMContentLoaded", async (e) => {
  const body = document.body;

  SetPropertySize(Params.w, Params.h);
  UpdateParams();

  new Ua(body);
  const controller = new Controller(Params);

  window.addEventListener(
    "resize",
    (e) => {
      UpdateParams();
      controller.resize(Params);
      SetPropertySize(Params.w, Params.h);

      // resize after
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        CheckResizeThreshold();
      }, Config.resizeAfterTime);
    },
    { passive: true },
  );
  SetOrientationchange();
  gsap.ticker.add(controller.update);
  gsap.ticker.fps(Config.fps);

  await controller.init();
  body.setAttribute("data-loaded", "1");
  console.log("👌 ~ Loaded");
  // document.fonts.ready.then((e) => {});
});
