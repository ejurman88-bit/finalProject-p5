let wallPaper
let cursor
let start
let errorImg
let loginImg
let login = true
let coca        
let clippy
let clippyVisible = false
let powerPoint = false
let powerPointImg
let pptOpen = false
let slides = []
let currentSlide = 0

let cookieOpen = true
let cookieSlider
let bonziImg     
let amazon     
let instagram    
let slide2Sound 
let slide3Sound  
let slide4Sound  
let slide3;       

// Location globals for slide 5
let userLat = null
let userLon = null
let locationStatus = "Click the button to share your location."
let userTown = ""; 
function preload() {
  amazon = loadImage("amazon.PNG");
  instagram = loadImage("instagram.PNG");
  slide3 = loadImage("slide3.png");
  coca = loadImage("cocacola.png");

  wallPaper = loadImage("wallPaper.jpg");
  cursor = loadImage("cursor-png.png");
  start = loadImage("start.png");
  errorImg = loadImage("error.png");
  powerPointImg = loadImage("Powerpoint.png");
  loginImg = loadImage("login.png");
  bonziImg = loadImage("bonzibuddy.gif"); // load BonziBuddy GIF

  // load audio for slide 2, 3, 4
  slide2Sound = loadSound("slide2.mp3");
  slide3Sound = loadSound("slide3.mp3");
  slide4Sound = loadSound("slide4.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CORNER);
  noCursor();

  clippy = createImg("would-you-like-help-clippy.gif");
  clippy.hide();

  cookieSlider = createSlider(0, 1, 0, 1);
  cookieSlider.style('width', '140px');
  cookieSlider.hide();
  cookieSlider.input(() => {
    if (cookieSlider.value() === 1) {
      cookieOpen = false;
      cookieSlider.remove();
      showClippy();
    }
  });

  positionCookieSlider();

  for (let i = 1; i <= 5; i++) {
    slides.push(i);
  }
}

function draw() {
  if (login) {
    image(loginImg, 0, 0, windowWidth, windowHeight);
    image(cursor, mouseX, mouseY, 30, 30);
    return;
  }

  background(100);
  image(wallPaper, 0, 0, windowWidth, windowHeight);

  const barHeight = 35;
  fill(180);
  noStroke();
  rect(0, height - barHeight, width, barHeight);
  image(start, 5, height - barHeight + 2, 36, 36);

  if (cookieOpen && !pptOpen) {
    const boxH = 90;
    fill(255, 255, 255, 235);
    rect(0, 0, width, boxH);

    fill(20);
    textSize(20);
    text("Do you accept all cookies?", 20, 16);
    textSize(12);
    text("Slide to accept ➜", 20, 50);
  }

  if (clippyVisible && !pptOpen) {
    drawClippySpeech();
  }

  if (powerPoint && !pptOpen) {
    image(powerPointImg, 0, 300, 325, 250);

    fill(255);
    stroke(0);
    strokeWeight(2);
    rect(100, 300, 150, 40, 10);

    noStroke();
    fill(0);
    textSize(18);
    textAlign(CENTER, CENTER);
    text("Click me", 175, 320);
  }

  if (pptOpen) {
    drawSlideViewer();
  }

  image(cursor, mouseX, mouseY, 30, 30);
}

function showClippy() {
  clippyVisible = true;
  clippy.show();
  clippy.position(windowWidth / 2 - 150, windowHeight / 2 - 150);
}

function drawClippySpeech() {
  let boxW = 720;
  let boxH = 80;
  let boxX = windowWidth / 2 - boxW / 2;
  let boxY = windowHeight / 2 - boxH - 160;

  fill(255);
  stroke(0);
  strokeWeight(2);
  rect(boxX, boxY, boxW, boxH, 12);

  fill(0);
  textSize(16);
  textAlign(CENTER, CENTER);
  noStroke();
  text(
    "Hi there! My name’s Clippy and I am here to teach you some IMPORTANT information CLICK ME!",
    boxX + boxW / 2,
    boxY + boxH / 2
  );
}

function mousePressed() {
  if (!pptOpen && clippyVisible) {
    let cx = windowWidth / 2 - 150;
    let cy = windowHeight / 2 - 150;
    let cw = 300;
    let ch = 300;

    if (
      mouseX > cx && mouseX < cx + cw &&
      mouseY > cy && mouseY < cy + ch
    ) {
      powerPoint = true;
    }
  }

  if (powerPoint && !pptOpen) {
    if (
      mouseX > 0 && mouseX < 325 &&
      mouseY > 300 && mouseY < 550
    ) {
      clippyVisible = false;
      clippy.hide();
      powerPoint = false;
      pptOpen = true;
      currentSlide = 0;
    }
  }

  let bw = 800;
  let bh = 450;
  let bx = windowWidth / 2 - bw / 2;
  let by = windowHeight / 2 - bh / 2;

  let btnX = bx + 10;
  let btnY = by + 10;
  let btnW = 180;
  let btnH = 30;

  if (pptOpen) {
    // Close PowerPoint button
    if (
      mouseX > btnX && mouseX < btnX + btnW &&
      mouseY > btnY && mouseY < btnY + btnH
    ) {
      closePowerPoint();
    }

    // Slide 5 "Share my location" button
    if (currentSlide === 4) {
      let btnW5 = 260;
      let btnH5 = 40;
      let btnX5 = bx + bw / 2 - btnW5 / 2;
      let btnY5 = by + 300;

      if (
        mouseX > btnX5 && mouseX < btnX5 + btnW5 &&
        mouseY > btnY5 && mouseY < btnY5 + btnH5
      ) {
        requestLocation();
      }
    }
  }
}

function drawSlideViewer() {
  let bw = 800;
  let bh = 450;
  let bx = windowWidth / 2 - bw / 2;
  let by = windowHeight / 2 - bh / 2;

  fill(255);
  stroke(0);
  strokeWeight(3);
  rect(bx, by, bw, bh, 20);

  fill(180);
  noStroke();
  rect(bx, by, bw, 50);

  fill(255);
  stroke(0);
  strokeWeight(1);
  let btnX = bx + 10;
  let btnY = by + 10;
  let btnW = 180;
  let btnH = 30;
  rect(btnX, btnY, btnW, btnH, 6);

  fill(0);
  textSize(16);
  textAlign(LEFT, CENTER);
  noStroke();
  text("Close PowerPoint", btnX + 10, btnY + btnH / 2);

  // MAIN SLIDE TITLE:
  // hidden on slide 1 & 2; on slide 3 custom; on slide 4 "AI Advertisements"; slide 5 "Slide 5"
  fill(0);
  textSize(50);
  textAlign(CENTER, CENTER);
  noStroke();

  if (currentSlide > 1) {
    let titleText;
    if (currentSlide === 2) {
      titleText = "MFA site(Made For Advertisement)"; // Slide 3 title
    } else if (currentSlide === 3) {
      titleText = "AI Advertisements";                // Slide 4 title
    } else {
      titleText = "Slide " + slides[currentSlide];    // Slide 5 etc.
    }
    text(titleText, bx + bw / 2, by + 80);
  }

  // ---- CUSTOM CONTENT FOR SLIDE 1 ----
  if (currentSlide === 0) {
    textSize(26);
    text("The modern problem with forced advertisement.",
         bx + bw / 2,
         by + 120);

    image(bonziImg, bx + bw / 2 - 100, by + 200, 200, 200);
  }

  // ---- CUSTOM CONTENT FOR SLIDE 2 ----
  if (currentSlide === 1) {
    textSize(40);
    text("Tracking Cookies",
         bx + bw / 2,
         by + 75);

    // Logos on the sides
    image(instagram, bx + 40,       by + 100, 260, 300);  // Left side
    image(amazon,    bx + bw - 300, by + 100, 260, 300);  // Right side
  }

  // ---- CUSTOM CONTENT FOR SLIDE 3 ----
  if (currentSlide === 2) {
    // Center slide3.png in the middle of the slide window
    const imgW = 500;
    const imgH = 280;
    const imgX = bx + bw / 2 - imgW / 2;
    const imgY = by + bh / 2 - imgH / 2 + 20; // slight downward offset
    image(slide3, imgX, imgY, imgW, imgH);
  }

  // ---- CUSTOM CONTENT FOR SLIDE 4 ----
  if (currentSlide === 3) {
    // Show cocacola.png in the middle-ish of the slide
    const imgW = 400;
    const imgH = 250;
    const imgX = bx + bw / 2 - imgW / 2;
    const imgY = by + bh / 2 - imgH / 2 + 20;
    image(coca, imgX, imgY, imgW, imgH);
  }

  // ---- CUSTOM CONTENT FOR SLIDE 5 (Location + Town) ----
  if (currentSlide === 4) {
    textSize(24);
    textAlign(CENTER, CENTER);
    noStroke();
    fill(0);

    text("Your Location:", bx + bw / 2, by + 140);

    textSize(16);
    text(locationStatus, bx + bw / 2, by + 180);

    if (userLat !== null && userLon !== null) {
      text("Latitude: " + userLat.toFixed(5),  bx + bw / 2, by + 220);
      text("Longitude: " + userLon.toFixed(5), bx + bw / 2, by + 250);
    }

    if (userTown !== "") {
      text("Town: " + userTown, bx + bw / 2, by + 280);
    }

    // "Share my location" button
    let btnW5 = 260;
    let btnH5 = 40;
    let btnX5 = bx + bw / 2 - btnW5 / 2;
    let btnY5 = by + 300;

    fill(230);
    stroke(0);
    strokeWeight(1);
    rect(btnX5, btnY5, btnW5, btnH5, 8);

    noStroke();
    fill(0);
    textSize(18);
    text("Share my location", btnX5 + btnW5 / 2, btnY5 + btnH5 / 2);
  }

  // Slide navigation hint
  textSize(20);
  text("(Use ← & → arrows to navigate)",
       bx + bw / 2,
       by + bh - 40);

  // ---- AUDIO CONTROL FOR SLIDE 2, 3, 4 ----
  if (currentSlide === 1) {
    if (slide2Sound && !slide2Sound.isPlaying()) {
      slide2Sound.play();
    }
    if (slide3Sound && slide3Sound.isPlaying()) {
      slide3Sound.stop();
    }
    if (slide4Sound && slide4Sound.isPlaying()) {
      slide4Sound.stop();
    }
  } else if (currentSlide === 2) {
    if (slide3Sound && !slide3Sound.isPlaying()) {
      slide3Sound.play();
    }
    if (slide2Sound && slide2Sound.isPlaying()) {
      slide2Sound.stop();
    }
    if (slide4Sound && slide4Sound.isPlaying()) {
      slide4Sound.stop();
    }
  } else if (currentSlide === 3) {
    if (slide4Sound && !slide4Sound.isPlaying()) {
      slide4Sound.play();
    }
    if (slide2Sound && slide2Sound.isPlaying()) {
      slide2Sound.stop();
    }
    if (slide3Sound && slide3Sound.isPlaying()) {
      slide3Sound.stop();
    }
  } else {
    if (slide2Sound && slide2Sound.isPlaying()) {
      slide2Sound.stop();
    }
    if (slide3Sound && slide3Sound.isPlaying()) {
      slide3Sound.stop();
    }
    if (slide4Sound && slide4Sound.isPlaying()) {
      slide4Sound.stop();
    }
  }
}

function closePowerPoint() {
  pptOpen = false;
  powerPoint = true;
  clippyVisible = true;
  clippy.show();

  // Stop audio if PowerPoint is closed while on slide 2, 3, or 4
  if (slide2Sound && slide2Sound.isPlaying()) {
    slide2Sound.stop();
  }
  if (slide3Sound && slide3Sound.isPlaying()) {
    slide3Sound.stop();
  }
  if (slide4Sound && slide4Sound.isPlaying()) {
    slide4Sound.stop();
  }
}

function keyPressed() {
  if (key === ' ') {
    cookieSlider.show();
    login = false;
  }

  if (pptOpen) {
    if (keyCode === RIGHT_ARROW) {
      currentSlide = (currentSlide + 1) % slides.length;
    }
    if (keyCode === LEFT_ARROW) {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  positionCookieSlider();
}

function positionCookieSlider() {
  if (!cookieSlider) return;
  cookieSlider.position(160, 56);
}

// Request browser geolocation (used on slide 5)
function requestLocation() {
  if (!navigator.geolocation) {
    locationStatus = "Geolocation is not supported by your browser.";
    return;
  }

  locationStatus = "Requesting location...";
  userTown = "";

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      userLat = pos.coords.latitude;
      userLon = pos.coords.longitude;
      locationStatus = "Location received:";
      getTownName(userLat, userLon);
    },
    (err) => {
      locationStatus = "Unable to retrieve location (" + err.message + ")";
    }
  );
}

// Reverse-geocode lat/lon to a town/city name using OpenStreetMap Nominatim
function getTownName(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data && data.address) {
        userTown =
          data.address.town ||
          data.address.city ||
          data.address.village ||
          data.address.hamlet ||
          "Unknown town";
      } else {
        userTown = "Unknown town";
      }
    })
    .catch((err) => {
      console.error(err);
      userTown = "Lookup failed";
    });
}
