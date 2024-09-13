import { Application, Sprite, Texture } from 'pixi.js';

/**
 * Initialize the application.
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
        backgroundColor: 0x1099bb,
        antialias: false,
        roundPixels: true,
    });

    document.body.appendChild(app.canvas);

    app.stage.scale.x = displayWidth / gameWidth;
    app.stage.scale.y = displayHeight / gameHeight;

    app.canvas.style.width = `${displayWidth}px`;
    app.canvas.style.height = `${displayHeight}px`;

    const rectangle = new Sprite(Texture.WHITE);
    rectangle.tint = 0xffffff;
    rectangle.width = 40;
    rectangle.height = 40;
    rectangle.x = gameWidth / 8;
    rectangle.y = gameHeight / 8;
    rectangle.anchor.set(0.5);
    app.stage.addChild(rectangle);

    app.ticker.add(() => {
        rectangle.rotation += 0.001;
    });
}
