import { Application, Sprite, Texture } from 'pixi.js';

console.log('Hello World');

declare const IS_PRODUCTION: boolean;

if (!IS_PRODUCTION) {
    console.log('Not production');

    new EventSource('/esbuild').addEventListener('change', (e: Event) => {
        console.log('Change!!!');

        if (e instanceof MessageEvent) {
            const { added, removed, updated } = JSON.parse(e.data);

            if (!added.length && !removed.length && updated.length === 1) {
                for (const link of document.getElementsByTagName('link')) {
                    const url = new URL(link.href);

                    console.log(url);

                    if (url.host === location.host && url.pathname === updated[0]) {
                        const next = link.cloneNode() as HTMLLinkElement;
                        next.href = `${updated[0]}?${Math.random().toString(36).slice(2)}`;
                        next.onload = () => link.remove();
                        link.parentNode?.insertBefore(next, link.nextSibling);
                        return;
                    }
                }
            }
        }

        location.reload();
    });
} else {
    console.log('Production');
}

async function init(): Promise<void> {
    // Define the game's internal resolution
    const gameWidth = 640;
    const gameHeight = 400;

    // Define the desired display size
    const displayWidth = gameWidth * 2;
    const displayHeight = gameHeight * 2;

    // Create the application
    const app = new Application();

    // Initialize the app with the game resolution
    await app.init({
        width: gameWidth,
        height: gameHeight,
        backgroundColor: 0x1099bb,
        hello: true,
        antialias: false,
        roundPixels: true,
    });

    // Add the canvas to the DOM
    document.body.appendChild(app.canvas);

    // Scale up the stage to fit the display size
    app.stage.scale.x = displayWidth / gameWidth;
    app.stage.scale.y = displayHeight / gameHeight;

    // Adjust the canvas style to display at the larger size
    app.canvas.style.width = `${displayWidth}px`;
    app.canvas.style.height = `${displayHeight}px`;

    // Create a red rectangle and add it to the stage
    const rectangle = new Sprite(Texture.WHITE);
    rectangle.tint = 0xffffff;
    rectangle.width = 40;
    rectangle.height = 40;
    rectangle.x = gameWidth / 8;
    rectangle.y = gameHeight / 8;
    rectangle.anchor.set(0.5);
    app.stage.addChild(rectangle);

    console.log('Rectangle added to stage');

    // Listen for frame updates
    app.ticker.add(() => {
        // rectangle.x += 0.001;
        rectangle.rotation += 0.001; // Rotate slightly each frame
    });

    console.log('Ticker added');
}

init().catch(console.error);
