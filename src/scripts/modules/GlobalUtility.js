export class GlobalUtility {
  /**
   * @param {number} _time
   */
  delay(_time) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, _time);
    });
  }

  /**
   * @param {string} _name
   */
  getParameter(_name) {
    _name = _name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + _name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(window.location.href);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
}
