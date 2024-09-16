import { Application, Graphics } from 'pixi.js';

const pigeonWidth = 20;
const pigeonHeight = 40;
const pigeonBodyColor = 0x888888;
const pigeonHeadColor = 0x555555;

const pigeonHeadOffs = -40;
const pigeonHeadRadius = 10;
const jumpDistanceMultiplier = 20;

export async function gameInit(): Promise<void> {
    const gameWidth = 640;
    const gameHeight = 400;
    const displayWidth = gameWidth * 2;
    const displayHeight = gameHeight * 2;

    const app = new Application();

    await app.init({
        width: gameWidth,
        height: gameHeight,
        backgroundColor: 0x111111,
        antialias: false,
        roundPixels: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
    });

    document.body.appendChild(app.canvas);

    app.canvas.style.width = `${displayWidth}px`;
    app.canvas.style.height = `${displayHeight}px`;

    // Create the pigeon
    const pigeon = new Graphics();

    // Draw the body (ellipse)
    pigeon.ellipse(0, 0, pigeonWidth, pigeonHeight);
    pigeon.fill(pigeonBodyColor);

    // Draw the head (circle) at one end of the body
    pigeon.circle(0, pigeonHeadOffs, pigeonHeadRadius);
    pigeon.fill(pigeonHeadColor);

    // Set the initial position
    pigeon.x = gameWidth / 2;
    pigeon.y = gameHeight / 2;

    // Set the pivot point to the center of the body for proper rotation.
    pigeon.pivot.set(0, 0);

    app.stage.addChild(pigeon);

    // Keyboard input handling
    const keys: Record<string, boolean> = {
        ArrowLeft: false,
        ArrowRight: false,
        ArrowUp: false,
        ArrowDown: false,
        Space: false,
    };

    window.addEventListener('keydown', e => {
        if (e.code in keys) {
            keys[e.code] = true;
        }
    });

    window.addEventListener('keyup', e => {
        if (e.code in keys) {
            keys[e.code] = false;
        }
    });

    const speed = 2;
    const rotationSpeed = 0.05;

    app.ticker.add(delta => {
        // Rotate the pigeon
        if (keys.ArrowLeft) {
            pigeon.rotation -= rotationSpeed * delta.deltaTime;
        }
        if (keys.ArrowRight) {
            pigeon.rotation += rotationSpeed * delta.deltaTime;
        }

        // Move the pigeon
        let moveSpeed = 0;

        if (keys.ArrowUp) {
            moveSpeed = speed;
        }
        if (keys.ArrowDown) {
            moveSpeed = -speed;
        }
        if (keys.Space) {
            moveSpeed = speed * jumpDistanceMultiplier;
            keys.Space = false;
        }

        if (moveSpeed !== 0) {
            const dx = Math.sin(pigeon.rotation) * moveSpeed * delta.deltaTime;
            const dy = -Math.cos(pigeon.rotation) * moveSpeed * delta.deltaTime;

            pigeon.x += dx;
            pigeon.y += dy;

            // Collision detection with screen edges
            const leftBound = 0;
            const rightBound = gameWidth;
            const topBound = 0;
            const bottomBound = gameHeight;

            // Ensure the pigeon doesn't go off-screen
            pigeon.x = Math.max(leftBound, Math.min(pigeon.x, rightBound));
            pigeon.y = Math.max(topBound, Math.min(pigeon.y, bottomBound));
        }
    });
}
