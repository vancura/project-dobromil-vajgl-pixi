import { Application, Sprite, Texture } from 'pixi.js';

// Declare a constant to check if the environment is production.
declare const IS_PRODUCTION: boolean;

// Check if the environment is not production.
if (IS_PRODUCTION) {
    console.log('Production build');
} else {
    console.log('Debug build');

    // Set up a listener for changes in the development environment.
    new EventSource('/esbuild').addEventListener('change', (e: Event) => {
        if (e instanceof MessageEvent) {
            const { added, removed, updated } = JSON.parse(e.data);

            // If there are no added or removed files, but one updated file.
            if (!added.length && !removed.length && updated.length === 1) {
                for (const link of document.getElementsByTagName('link')) {
                    const url = new URL(link.href);

                    // TODO: Remove, debugging.
                    console.log(`Reload URL: ${url}`);

                    if (url.host === location.host && url.pathname === updated[0]) {
                        const next = link.cloneNode() as HTMLLinkElement;

                        // Append a random query string to force reload.
                        next.href = `${updated[0]}?${Math.random().toString(36).slice(2)}`;

                        // remove the old link after the new one loads.
                        next.onload = () => link.remove();

                        // Insert the new link after the old one.
                        link.parentNode?.insertBefore(next, link.nextSibling);

                        return;
                    }
                }
            }
        }

        // Reload the page if no specific updates were handled.
        location.reload();
    });
}

/**
 * Initialize the application.
 */
async function init(): Promise<void> {
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

init().catch(console.error);
