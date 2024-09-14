import { Application, Sprite, Texture, Container } from 'pixi.js';

/**
 * Initializes the game environment with specified settings including canvas
 * dimensions, background color, and various animations such as a moving
 * rectangle, and a star-field effect.
 *
 * @return {Promise<void>} A promise that resolves when the game initialization
 * completes.
 */
export async function gameInit(): Promise<void> {
    const gameWidth = 640;
    const gameHeight = 400;
    const displayWidth = gameWidth * 2;
    const displayHeight = gameHeight * 2;

    const app = new Application();

    await app.init({
        width: gameWidth,
        height: gameHeight,
        backgroundColor: 0x000000, // Set the background to black
        antialias: false,
        roundPixels: true,
    });

    document.body.appendChild(app.canvas);

    app.stage.scale.set(displayWidth / gameWidth);

    app.canvas.style.width = `${displayWidth}px`;
    app.canvas.style.height = `${displayHeight}px`;

    // Starfield Effect
    const starContainer = new Container();
    app.stage.addChild(starContainer);

    const stars: Sprite[] = [];
    const starCount = 10000;
    const warpSpeedMultiplier = 5;
    let isWarping = false;
    let warpStartTime = 0;
    const warpDuration = 3000; // Warp effect lasts for 3 seconds
    let lastWarpTime = performance.now();

    for (let i = 0; i < starCount; i++) {
        const star = new Sprite(Texture.WHITE);
        star.tint = 0x00ffff * (Math.random() * 0.5 + 0.5);
        star.width = 2;
        star.height = 2;
        star.alpha = 0.3;
        resetStar(star);
        stars.push(star);
        starContainer.addChild(star);
    }

    /**
     * Resets the position, speed, and direction of the given star sprite.
     * @param {Sprite} star - The star sprite to be reset.
     * @return {void}
     */
    function resetStar(star: Sprite) {
        star.x = gameWidth / 4;
        star.y = gameHeight / 4;
        star.speed = Math.random() * 0.0001 + 0;
        star.direction = Math.random() * Math.PI * 2;
    }

    /**
     * Animate the stars by updating their positions and speeds. Stars will trigger a warp effect every 10 seconds,
     * increasing their speed temporarily. When a star moves out of bounds, it will be reset to its initial position.
     * @return {void} This method does not return a value.
     */
    function animateStars() {
        const currentTime = performance.now();

        let speedMultiplier = 0.5;
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
