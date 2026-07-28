// Banner ads. Each one lives in its own iframe built from srcdoc, because the
// provider reads a single global `atOptions` — two of them on one page would
// otherwise race and both render the same slot.
(function () {
  "use strict";

  var SLOTS = [
    { id: "ad-banner", key: "708644e03d1dfbf7ec91936972310445", w: 728, h: 90 },
    { id: "ad-sky", key: "954475f001b4ef7c186aea158e226fdd", w: 160, h: 600 }
  ];

  function frameFor(slot) {
    var f = document.createElement("iframe");
    f.width = slot.w;
    f.height = slot.h;
    f.scrolling = "no";
    f.frameBorder = "0";
    f.setAttribute("referrerpolicy", "no-referrer");
    f.srcdoc =
      '<body style="margin:0;overflow:hidden">' +
      '<scr' + 'ipt>atOptions=' + JSON.stringify({ key: slot.key, format: "iframe", height: slot.h, width: slot.w, params: {} }) + ';</scr' + 'ipt>' +
      '<scr' + 'ipt src="https://apilattice.com/' + slot.key + '/invoke.js"></scr' + 'ipt>' +
      '</body>';
    return f;
  }

  function build(slot) {
    if (document.getElementById(slot.id)) return;
    // Closing sticks for the session rather than forever: not a permanent
    // opt-out, but not a nag on every new tab either.
    try { if (sessionStorage.getItem("sh_closed_" + slot.id) === "1") return; } catch (e) {}
    var box = document.createElement("div");
    box.className = "ad-slot";
    box.id = slot.id;
    box.style.width = slot.w + "px";
    box.style.height = slot.h + "px";
    var x = document.createElement("button");
    x.className = "ad-x";
    x.type = "button";
    x.setAttribute("aria-label", "Close ad");
    x.textContent = "×";
    x.addEventListener("click", function () {
      try { sessionStorage.setItem("sh_closed_" + slot.id, "1"); } catch (e) {}
      box.remove();
    });
    box.appendChild(frameFor(slot));
    box.appendChild(x);
    document.body.appendChild(box);
  }

  function init() { SLOTS.forEach(build); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
