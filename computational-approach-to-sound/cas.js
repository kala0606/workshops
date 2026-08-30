/* shared: copy buttons on code blocks + "today" highlight on the syllabus */
(function () {
  // copy button on every <pre>
  document.querySelectorAll("pre").forEach(function (pre) {
    var btn = document.createElement("button");
    btn.className = "copy";
    btn.textContent = "copy";
    btn.addEventListener("click", function () {
      var code = pre.querySelector("code");
      var text = (code || pre).innerText.replace(/\ncopy$/, "");
      navigator.clipboard.writeText(text).then(function () {
        btn.textContent = "copied";
        setTimeout(function () { btn.textContent = "copy"; }, 1400);
      });
    });
    pre.appendChild(btn);
  });

  // highlight today's card on the syllabus (cards carry data-date="2026-08-31")
  var now = new Date();
  var iso = now.getFullYear() + "-" +
    String(now.getMonth() + 1).padStart(2, "0") + "-" +
    String(now.getDate()).padStart(2, "0");
  document.querySelectorAll(".daycard[data-date]").forEach(function (card) {
    if (card.getAttribute("data-date") === iso) card.classList.add("today");
  });
})();
