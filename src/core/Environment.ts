declare const IS_PRODUCTION: boolean;

/**
 * Determines the current build environment and sets up appropriate logging and event listeners.
 *
 * This method checks if the environment is configured for production.
 * If it is, it logs “Production build” to the console.
 * In a development environment, it logs “Debug build” and sets up a listener for changes in the development environment
 * using EventSource.
 *
 * The change listener listens for updates and performs a conditional check to reload specific
 * updated CSS files without a full page refresh.
 * If no specific updates are handled, the page is reloaded.
 *
 * @return {void}
 */
export function checkBuildEnvironment(): void {
    if (IS_PRODUCTION) {
        console.log('Production build');
    } else {
        console.log('Debug build');

        new EventSource('/esbuild').addEventListener('change', (e: Event) => {
            if (e instanceof MessageEvent) {
                const { added, removed, updated } = JSON.parse(e.data);

                if (!added.length && !removed.length && updated.length === 1) {
                    for (const link of document.getElementsByTagName('link')) {
                        const url = new URL(link.href);

                        // TODO: Remove, debugging.
                        console.log(`Reload URL: ${url}`);

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
    }
}
