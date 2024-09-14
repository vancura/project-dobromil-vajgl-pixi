import { Application, Sprite, Texture, Container } from 'pixi.js';

/**
 * Initialize the application.
 */
export async function gameInit(): Promise<void> {
    const gameWidth = 640;
    const gameHeight = 400;
    const displayWidth = gameWidth * 1;
    const displayHeight = gameHeight * 1;

    const app = new Application();

    await app.init({
        width: gameWidth,
        height: gameHeight,
        backgroundColor: 0x000000, // Set background to black
        antialias: false,
        roundPixels: true,
    });

    document.body.appendChild(app.canvas);

    app.stage.scale.set(displayWidth / gameWidth);

    app.canvas.style.width = `${displayWidth}px`;
    app.canvas.style.height = `${displayHeight}px`;

    // Rectangle Animation
    const rectangle = new Sprite(Texture.WHITE);
    rectangle.tint = 0xffffff;
    rectangle.width = 40;
    rectangle.height = 40;
    rectangle.anchor.set(0.5);
    app.stage.addChild(rectangle);

    const corners = [
        { x: 0, y: 0 },
        { x: gameWidth, y: 0 },
        { x: gameWidth, y: gameHeight },
        { x: 0, y: gameHeight },
    ];

    let cornerIndex = 0;
    let startTime = 0;
    const moveDuration = 2000; // Duration to move between corners in milliseconds

    function animateRectangle(deltaTime: number) {
        if (startTime === 0) startTime = performance.now();
        const currentTime = performance.now();
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / moveDuration, 1);

        // Ease-in-out function
        const easedProgress = 0.5 * (1 - Math.cos(Math.PI * progress));

        const startPoint = corners[cornerIndex];
        const endPoint = corners[(cornerIndex + 1) % corners.length];

        rectangle.x = startPoint.x + (endPoint.x - startPoint.x) * easedProgress;
        rectangle.y = startPoint.y + (endPoint.y - startPoint.y) * easedProgress;

        if (progress >= 1) {
            cornerIndex = (cornerIndex + 1) % corners.length;
            startTime = currentTime;
        }
    }

    app.ticker.add(animateRectangle);

    // Starfield Effect
    const starContainer = new Container();
    app.stage.addChild(starContainer);

    const stars: Sprite[] = [];
    const starCount = 100;
    const warpSpeedMultiplier = 5;
    let isWarping = false;
    let warpStartTime = 0;
    const warpDuration = 3000; // Warp effect lasts for 3 seconds
    let lastWarpTime = performance.now();

    for (let i = 0; i < starCount; i++) {
        const star = new Sprite(Texture.WHITE);
        star.tint = 0xffffff;
        star.width = 2;
        star.height = 2;
        resetStar(star);
        stars.push(star);
        starContainer.addChild(star);
    }

    function resetStar(star: Sprite) {
        star.x = gameWidth / 2;
        star.y = gameHeight / 2;
        star.speed = Math.random() * 2 + 1;
        star.direction = Math.random() * Math.PI * 2;
    }

    function animateStars(deltaTime: number) {
        const currentTime = performance.now();

        // Trigger warp effect every 10 seconds
        if (currentTime - lastWarpTime >= 10000 && !isWarping) {
            isWarping = true;
            warpStartTime = currentTime;
            lastWarpTime = currentTime;
        }

        let speedMultiplier = 1;
        if (isWarping) {
            speedMultiplier = warpSpeedMultiplier;
            if (currentTime - warpStartTime >= warpDuration) {
                isWarping = false;
            }
        }

        stars.forEach(star => {
            star.x += Math.cos(star.direction) * star.speed * speedMultiplier;
            star.y += Math.sin(star.direction) * star.speed * speedMultiplier;
            star.speed += 0.05 * speedMultiplier;

            const outOfBounds =
                star.x < 0 || star.x > gameWidth || star.y < 0 || star.y > gameHeight;

            if (outOfBounds) {
                resetStar(star);
            }
        });
    }

    app.ticker.add(animateStars);
}
