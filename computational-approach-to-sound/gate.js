/* day gate — one word, given in the room. Soft by design: a classroom
   mechanic, not security. Unlocks persist per browser via localStorage. */
(function () {
  var G = window.GATE;
  if (!G) return;
  var KEY = "cas26-day-" + G.day;
  try { if (localStorage.getItem(KEY) === "open") return; } catch (e) { return; }

  // hide the page until the word is given (script runs from <head>)
  document.documentElement.style.visibility = "hidden";

  function djb2(s) {
    var h = 5381;
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
    return h;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var o = document.createElement("div");
    o.id = "gate";
    o.innerHTML =
      '<div class="box">' +
      '<div class="kicker">Day ' + G.day + ' · locked</div>' +
      '<h1 style="font-size:26px;margin-bottom:18px">One word opens it.</h1>' +
      '<input id="gw" type="text" autocomplete="off" autocapitalize="none" ' +
      'spellcheck="false" placeholder="the word">' +
      '<div class="row"><button class="big" id="go" style="flex:1">unlock</button></div>' +
      '<div class="nope" id="nope"></div>' +
      '<div class="hint">Hint: ' + G.hint + '<br>The word is given in the room. ' +
      'Timestamps, as ever, are true.</div>' +
      '</div>';
    document.body.appendChild(o);
    document.documentElement.style.visibility = "";
    document.body.style.overflow = "hidden";

    var input = document.getElementById("gw");
    input.focus();
    function attempt() {
      var w = input.value.trim().toLowerCase();
      if (!w) return;
      if (djb2(w) === G.h) {
        try { localStorage.setItem(KEY, "open"); } catch (e) {}
        o.remove();
        document.body.style.overflow = "";
      } else {
        document.getElementById("nope").textContent =
          "not the word — tried, truly, at " +
          new Date().toTimeString().slice(0, 8);
        input.select();
      }
    }
    document.getElementById("go").addEventListener("click", attempt);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") attempt();
    });
  });
})();
