const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

let stars = [];
const layerCount = 3; // 3 layers for parallax
const speeds = [0.05, 0.1, 0.2]; // Slower speeds for distant stars
const baseStarCount = 50; // Base count of stars per layer
let shootingStar = null;

// Generate a random gray color for stars, based on data-theme
function getRandomGrayColor() {
  const theme = document.body.getAttribute("data-theme");
  const grayValue = Math.floor(Math.random() * 256);
  return theme === "dark"
    ? `rgb(255-${grayValue}, 255-${grayValue}, 255-${grayValue})`
    : `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
}

// Resize the canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  createStars(); // Recreate stars based on new dimensions
}

// Create the starfield
function createStars() {
  stars = [];
  const scalingFactor = Math.max(canvas.width, canvas.height) / 1000; // Scale star count
  for (let i = 0; i < layerCount; i++) {
    const starCount = Math.floor(baseStarCount * scalingFactor * (i + 1));
    for (let j = 0; j < starCount; j++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * (i + 1) + 0.5, // Larger stars for closer layers
        speed: speeds[i],
        opacity: Math.random(),
        baseOpacity: Math.random() * 0.5 + 0.5, // Base opacity for twinkling
        layer: i, // Track which layer the star belongs to
      });
    }
  }
}

// Update star positions and simulate twinkling
function updateStars() {
  stars.forEach((star) => {
    star.y -= star.speed; // All stars move upward
    star.opacity =
      star.baseOpacity + Math.sin(Date.now() * 0.001 * star.speed) * 0.3; // Smooth twinkle

    // Reset star position when it goes off-screen
    if (star.y < 0) {
      star.y = canvas.height;
      star.x = Math.random() * canvas.width;
    }
  });
}

// Draw the stars
function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Add a dark radial blur gradient background
  const gradient = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 8, // Start small for a blur effect
    canvas.width / 2,
    canvas.height / 2,
    canvas.width // Expand to the edges
  );

  //   Make gradient background based on data-theme
  const theme = document.body.getAttribute("data-theme");
  if (theme === "dark") {
    gradient.addColorStop(0, "rgba(10, 20, 40, 1)"); // Deep dark blue at the center
    gradient.addColorStop(1, "rgba(0, 0, 0, 1)"); // Black at the edges
  } else {
    gradient.addColorStop(0, "rgba(245, 250, 230, 1)"); // Light gray at the center
    gradient.addColorStop(1, "rgba(255, 255, 255, 1)"); // White at the edges
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw stars with parallax effect
  stars.forEach((star) => {
    // Make star color based on data-theme
    const theme = document.body.getAttribute("data-theme");
    const starColor =
      theme === "dark" ? "rgba(255, 255, 255, 1)" : "rgba(0, 0, 0, 1)";
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI);
    ctx.fillStyle = starColor;
    ctx.fill();
  });
}

// Initialize a shooting star
function createShootingStar() {
  const startX = Math.random() * canvas.width;
  const startY = Math.random() * canvas.height;
  const angle = Math.random() * Math.PI * 2; // Random direction
  const length = Math.random() * 300 + 100; // Random trail length
  const speed = Math.random() * 4 + 2;

  shootingStar = {
    x: startX,
    y: startY,
    length: length,
    speed: speed,
    opacity: 1,
    dx: Math.cos(angle) * speed,
    dy: Math.sin(angle) * speed,
  };

  // Schedule the next shooting star (20–40 seconds for rare appearance)
  const nextAppearance = Math.random() * 20000 + 20000;
  setTimeout(createShootingStar, nextAppearance);
}

// Update shooting star position
function updateShootingStar() {
  if (!shootingStar) return;

  shootingStar.x += shootingStar.dx;
  shootingStar.y += shootingStar.dy;
  shootingStar.opacity -= 0.01;

  if (
    shootingStar.opacity <= 0 ||
    shootingStar.x < 0 ||
    shootingStar.x > canvas.width ||
    shootingStar.y < 0 ||
    shootingStar.y > canvas.height
  ) {
    shootingStar = null; // Remove shooting star
  }
}

// Draw the shooting star
function drawShootingStar() {
  if (!shootingStar) return;

  const gradient = ctx.createLinearGradient(
    shootingStar.x,
    shootingStar.y,
    shootingStar.x - shootingStar.dx * shootingStar.length,
    shootingStar.y - shootingStar.dy * shootingStar.length
  );
  gradient.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.opacity})`);
  gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

  ctx.beginPath();
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 2;
  ctx.moveTo(shootingStar.x, shootingStar.y);
  ctx.lineTo(
    shootingStar.x - shootingStar.dx * shootingStar.length,
    shootingStar.y - shootingStar.dy * shootingStar.length
  );
  ctx.stroke();
  ctx.closePath();
}

// Animation loop
function animate() {
  updateStars();
  updateShootingStar();
  drawStars();
  drawShootingStar();
  requestAnimationFrame(animate);
}

// Handle resizing
window.addEventListener("resize", resizeCanvas);

// Initialize
resizeCanvas();
createStars();
setTimeout(createShootingStar, Math.random() * 20000 + 20000); // Rare shooting stars
animate();
