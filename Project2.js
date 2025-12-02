let wallPaper;
let cursorPNG;        // for any canvas-based effects (e.g., glitch spray)
let start;
let errorImg;

// DOM cursor that floats above everything
let domCursor;

// GIFs handled via one array
let gifElements = [];
let gifPositions = []; // {x, y} screen positions for each gif (fixed)

// UI state
let calendarMenuOpen = false;
let folderMenuOpen = false;  
let errorOverlay = false;
let glitchMode = false;

// cookies UI
let cookieOpen = true;
let cookieSlider;

function preload() {
  wallPaper = loadImage("wallPaper.jpg");
  cursorPNG = loadImage("cursor-png.png");   // keep for glitchMode spray
  start = loadImage("start.png");
  errorImg = loadImage("error.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CORNER);
  noCursor();

  // ---------- SUPER CURSOR (DOM) ----------
  domCursor = createImg("cursor-png.png", "cursor");
  domCursor.size(70, 70);
  domCursor.style("position", "fixed");
  domCursor.style("left", "0px");
  domCursor.style("top", "0px");
  domCursor.style("pointer-events", "none");
  domCursor.style("z-index", "10000"); // above everything

  // ---------- GIFs (ARRAY + HIDE BY DEFAULT) ----------
  const gifFiles = [
    "would-you-like-help-clippy.gif",
    "bonzi-buddy-monkey.gif",
    "bonzibuddy.gif"
  ];

  gifElements = gifFiles.map(src => {
    const el = createImg(src, "");
    el.style("position", "fixed");
    el.style("z-index", "999"); // below the cursor but above canvas
    el.hide();                  // show after cookie accept
    return el;
  });

  // choose initial on-screen positions (tweak as you like)
  gifPositions = [
    { x: windowWidth * 0.50, y: windowHeight * 0.50 },
    { x: windowWidth * 0.33, y: windowHeight * 0.33 },
    { x: windowWidth * 0.20, y: windowHeight * 0.20 }
  ];

  // ---------- Cookie slider ----------
  cookieSlider = createSlider(0, 1, 0, 1);
  cookieSlider.style('width', '140px');
  cookieSlider.input(() => {
    if (cookieSlider.value() === 1) {
      cookieOpen = false;
      cookieSlider.remove();
      triggerAllGifs(); // <-- reveal/position all GIFs here
    }
  });
  positionCookieSlider();
}

function draw() {
  background(100);

  // NOTE: we no longer draw a GIF to the canvas; all GIFs are DOM.
  // Keep error overlay and wallpaper/order as before
  if (errorOverlay) {
    image(errorImg, 0, 0, width, height);
    // the DOM cursor floats above this anyway
    // early return is fine; DOM cursor continues to update below
  } else {
    image(wallPaper, 0, 0, windowWidth, windowHeight);

    textSize(70);
    text('📁', 30, 70);
    text('🗑️', 30, 160);
    text('🗓️', 30, 240);

    const barHeight = 35;
    fill(180);
    noStroke();
    rect(0, height - barHeight, width, barHeight);

    const startX = 5;
    const startY = height - barHeight + 2;
    const startW = 36;
    const startH = 36;
    image(start, startX, startY, startW, startH);

    if (calendarMenuOpen) {
      drawCalendarMenu();
    }
    if (folderMenuOpen) {
      drawFolderMenu();
    }

    if (cookieOpen) {
      const boxH = 90;
      noStroke();
      fill(255, 255, 255, 235);
      rect(0, 0, width, boxH);

      fill(20);
      textSize(20);
      textAlign(LEFT, TOP);
      text("Do you accept all cookies?", 20, 16);

      textSize(12);
      text("Slide to accept ➜", 20, 50);
    }

    // optional: glitch sprays extra cursor PNGs onto the canvas
    if (glitchMode) {
      for (let i = 0; i < 20; i++) {  
        let randX = random(width);
        let randY = random(height);
        image(cursorPNG, randX, randY, 70, 70);
      }
    }
  }

  // keep DOM cursor on top following the mouse
  domCursor.position(mouseX, mouseY);

  // keep GIFs placed (in case of window resizes we recompute in windowResized)
  for (let i = 0; i < gifElements.length; i++) {
    const pos = gifPositions[i];
    if (pos && gifElements[i].elt.style.display !== "none") {
      gifElements[i].position(pos.x, pos.y);
    }
  }
}

function triggerAllGifs() {
  // Show and position every GIF in the array
  for (let i = 0; i < gifElements.length; i++) {
    const el = gifElements[i];
    const pos = gifPositions[i] || { x: 20 + i * 120, y: 20 + i * 80 };
    el.position(pos.x, pos.y);
    el.show();
  }
}

function drawCalendarMenu() {
  const menuX = 100;
  const menuY = 200;
  const menuW = 120;
  const menuH = 60;

  fill(220);
  stroke(120);
  rect(menuX, menuY, menuW, menuH, 8);

  noStroke();
  fill(50);
  textSize(20);
  text("Hello", menuX + 20, menuY + 35);
}

function drawFolderMenu() {
  const menuX = 120;
  const menuY = 60;
  const menuW = 300;
  const menuH = 200;

  fill(240);
  stroke(100);
  rect(menuX, menuY, menuW, menuH, 10);

  fill(255);
  stroke(150);
  rect(menuX + 20, menuY + 40, menuW - 40, menuH - 80);

  noStroke();
  fill(0);
  textSize(24);
  text("Don't click on me", menuX + 40, menuY + 90);
}

function mousePressed() {
  if (errorOverlay) return;

  // calendar icon bounds
  textSize(70);
  const calIcon = "🗓️";
  const calW = textWidth(calIcon);
  const calT = textAscent();
  const calD = textDescent();
  const calLeft   = 30;
  const calRight  = 30 + calW;
  const calTop    = 240 - calT;
  const calBottom = 240 + calD;

  if (mouseX >= calLeft && mouseX <= calRight && mouseY >= calTop && mouseY <= calBottom) {
    calendarMenuOpen = !calendarMenuOpen;
  }

  // folder icon bounds
  const folderIcon = "📁";
  const folderW = textWidth(folderIcon);
  const folderT = textAscent();
  const folderD = textDescent();
  const folderLeft   = 30;
  const folderRight  = 30 + folderW;
  const folderTop    = 70 - folderT;
  const folderBottom = 70 + folderD;

  if (mouseX >= folderLeft && mouseX <= folderRight && mouseY >= folderTop && mouseY <= folderBottom) {
    folderMenuOpen = !folderMenuOpen;
  }

  // start button toggle
  const barHeight = 35;
  const startX = 5;
  const startY = height - barHeight + 2;
  const startW = 36;
  const startH = 36;
  if (mouseX >= startX && mouseX <= startX + startW && mouseY >= startY && mouseY <= startY + startH) {
    errorOverlay = !errorOverlay;
  }

  // "Don't click on me" area toggles glitchMode
  if (folderMenuOpen && mouseX > 140 && mouseX < 400 && mouseY > 100 && mouseY < 200) {
    glitchMode = true;
  }
}

function keyPressed() {
  if (keyCode === ESCAPE) {
    glitchMode = false;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  positionCookieSlider();

  // keep GIF positions proportional to window size on resize
  gifPositions = [
    { x: windowWidth * 0.50, y: windowHeight * 0.50 },
    { x: windowWidth * 0.33, y: windowHeight * 0.33 },
    { x: windowWidth * 0.20, y: windowHeight * 0.20 }
  ];
  // if already visible, re-place them
  for (let i = 0; i < gifElements.length; i++) {
    if (gifElements[i].elt.style.display !== "none") {
      gifElements[i].position(gifPositions[i].x, gifPositions[i].y);
    }
  }
}

function positionCookieSlider() {
  if (!cookieSlider) return;
  const x = 160;
  const y = 56;
  cookieSlider.position(x, y);
}
