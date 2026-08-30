/* ============================================================
   INSTRUMENT STARTER — Computational Approaches to Sound, CAS 2026
   ------------------------------------------------------------
   This template pre-solves the three phone gotchas:
     1. audio unlocks only after a real touch  (the START screen)
     2. iOS motion sensors need a permission request inside that touch
     3. touch handlers return false so the page never scrolls/zooms
   You should only need to edit the sections marked  >>> YOUR INSTRUMENT.

   To use in the p5.js editor:
     1. File → New.
     2. In the editor's index.html, REPLACE the p5.sound script line with:
        <script src="https://unpkg.com/tone@14.7.77/build/Tone.js"></script>
        (p5.sound and Tone conflict — a sketch uses one or the other, never both)
     3. Replace the editor's sketch.js with this entire file. Save.
     4. Share → Fullscreen link → QR → phone.
   ============================================================ */

let started = false;   // false until the first touch unlocks audio
let synth;             // the default sound engine — replace freely

// >>> YOUR INSTRUMENT — sound setup ---------------------------------
// Build every sound object ONCE here (never inside draw()).
function makeSound() {
  synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "triangle" },
    envelope: { attack: 0.005, release: 0.4 },
  }).toDestination();
}

// Scale-lock: strangers can play no wrong notes. Change scale + root.
const scale = [0, 2, 4, 7, 9];          // pentatonic steps
const root  = 57;                        // A3, as a MIDI note number
function noteForZone(z) {
  const oct  = Math.floor(z / scale.length) * 12;
  const step = scale[z % scale.length];
  return Tone.Frequency(root + oct + step, "midi");
}

// >>> YOUR INSTRUMENT — the mappings --------------------------------
// One finger lands: x,y are in pixels; width/height are the screen.
function gestureStart(x, y) {
  const zones = scale.length * 2;                       // two octaves
  const z = constrain(floor(map(x, 0, width, 0, zones)), 0, zones - 1);
  synth.triggerAttackRelease(noteForZone(z), "8n");
}

// A finger drags. Use for continuous control (filter, bend, level…).
function gestureMove(x, y) {
  // e.g.: synth.set({ detune: map(y, height, 0, -100, 100) });
}

// Tilt arrives ~60×/s once running. rx/ry are degrees, roughly -90…90.
function gestureTilt(rx, ry) {
  // e.g.: a drone you bend — see Day 7's tilt-to-bend build.
}

// The phone is shaken.
function gestureShake() {
  // e.g.: new Tone.MembraneSynth().toDestination()
  //         .triggerAttackRelease("G1","8n");   (but build it in makeSound!)
}

// The instrument's face. Runs every frame once started.
function faces() {
  background(22, 20, 15);
  const zones = scale.length * 2;
  stroke(58, 54, 44);
  for (let i = 1; i < zones; i++)
    line((i * width) / zones, 0, (i * width) / zones, height);
  noStroke(); fill(194, 65, 12);
  for (const t of touches) circle(t.x, t.y, 64);
}
// -------------------------------------------------------------------
//        (plumbing below — read it once, edit it rarely)
// -------------------------------------------------------------------

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textFont("monospace");
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); }

function draw() {
  if (!started) {                      // the START screen
    background(22, 20, 15);
    fill(232, 227, 214); textSize(22);
    text("▶ TAP TO START", width / 2, height / 2);
    textSize(12); fill(138, 130, 114);
    text("sound + sensors unlock on first touch", width / 2, height / 2 + 36);
    return;
  }
  if (typeof rotationX !== "undefined") gestureTilt(rotationX, rotationY);
  faces();
}

function unlock() {
  // iOS 13+: motion permission must be requested inside a user gesture
  if (typeof DeviceMotionEvent !== "undefined" &&
      typeof DeviceMotionEvent.requestPermission === "function") {
    DeviceMotionEvent.requestPermission().catch(() => {});
    if (typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function")
      DeviceOrientationEvent.requestPermission().catch(() => {});
  }
  Tone.start();              // audio unlock (Tone-only sketch)
  makeSound();
  setShakeThreshold(35);
  started = true;
}

function touchStarted() {
  if (!started) { unlock(); return false; }
  for (const t of touches) gestureStart(t.x, t.y);
  return false;              // never let the page scroll
}

function touchMoved() {
  if (started) for (const t of touches) gestureMove(t.x, t.y);
  return false;
}

function touchEnded() { return false; }

function deviceShaken() { if (started) gestureShake(); }

// Mouse fallbacks so the laptop preview stays playable
function mousePressed() { if (!touches.length) touchStarted(); }
function mouseDragged() {
  if (started && !touches.length) gestureMove(mouseX, mouseY);
  return false;
}
