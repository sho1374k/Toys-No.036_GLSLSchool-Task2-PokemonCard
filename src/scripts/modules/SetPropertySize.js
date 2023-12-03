/**
 * @param {number} w // window.innerWidth
 * @param {number} h // window.innerHeight
 */
const html = document.documentElement;
export function SetPropertySize(w, h) {
  const vw = w * 0.01,
    vh = h * 0.01,
    longer = w > h ? w : h,
    shorter = w > h ? h : w;

  html.style.setProperty("--vw", vw + "px"); // width: calc(var(--vw, 1vw) * 100);
  html.style.setProperty("--vh", vh + "px"); // height: calc(var(--vh, 1vh) * 100);
  html.style.setProperty("--longer", longer + "px");
  html.style.setProperty("--shorter", shorter + "px");
}
