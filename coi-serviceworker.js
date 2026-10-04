/*
 * coi-serviceworker.js
 *
 * Adds COOP/COEP headers to every response via a service worker so a static
 * host (Cloudflare Pages, GitHub Pages, ...) can serve a cross-origin
 * isolated page (needed for SharedArrayBuffer / wasm pthreads).
 *
 * Usage: put this file in the SAME folder as index.html and load it as the
 * very first script in <head>:
 *
 *     <script src="coi-serviceworker.js"></script>
 *
 * The same file acts as both the page-side registrar and the worker itself.
 * A service worker can only control its own folder and below, so it must live
 * in /games/kisakcod-port/ (not the site root) unless you want it site-wide.
 *
 * Optional config (define BEFORE the script tag):
 *     <script>window.coi = { quiet: true };</script>
 */

if (typeof window === "undefined") {

    /* ------------------------------------------------------------
     * Service worker side
     * ------------------------------------------------------------ */

    self.addEventListener("install", () => self.skipWaiting());

    self.addEventListener("activate", (event) =>
        event.waitUntil(self.clients.claim())
    );

    self.addEventListener("message", (event) => {

        if (!event.data) return;

        if (event.data.type === "deregister") {

            self.registration
                .unregister()
                .then(() => self.clients.matchAll())
                .then((clients) =>
                    clients.forEach((client) => client.navigate(client.url))
                );

        }

    });

    self.addEventListener("fetch", (event) => {

        const request = event.request;

        // Chrome bug: only-if-cached requests must be same-origin.
        if (
            request.cache === "only-if-cached" &&
            request.mode !== "same-origin"
        ) {
            return;
        }

        event.respondWith(

            fetch(request)
                .then((response) => {

                    // Opaque responses can't be re-wrapped.
                    if (response.status === 0) {
                        return response;
                    }

                    const headers = new Headers(response.headers);

                    headers.set(
                        "Cross-Origin-Embedder-Policy",
                        "require-corp"
                    );

                    headers.set(
                        "Cross-Origin-Resource-Policy",
                        "cross-origin"
                    );

                    headers.set(
                        "Cross-Origin-Opener-Policy",
                        "same-origin"
                    );

                    return new Response(response.body, {
                        status: response.status,
                        statusText: response.statusText,
                        headers
                    });

                })
                .catch((error) => {
                    console.error("[coi-sw] fetch failed:", error);
                    return Response.error();
                })

        );

    });

} else {

    /* ------------------------------------------------------------
     * Page side: register the worker, reload once so it takes control
     * ------------------------------------------------------------ */

    (() => {

        const RELOAD_KEY = "coiReloadedBySelf";

        const reloadedBySelf =
            window.sessionStorage.getItem(RELOAD_KEY);

        window.sessionStorage.removeItem(RELOAD_KEY);

        const coi = {
            shouldRegister: () => !reloadedBySelf,
            shouldDeregister: () => false,
            doReload: () => window.location.reload(),
            quiet: false,
            ...window.coi
        };

        const log = (...args) => {
            if (!coi.quiet) console.log("[coi-sw]", ...args);
        };

        const nav = navigator;

        if (
            nav.serviceWorker &&
            nav.serviceWorker.controller &&
            coi.shouldDeregister()
        ) {
            nav.serviceWorker.controller.postMessage({
                type: "deregister"
            });
        }

        // Already isolated (real headers or worker already active), or we
        // already reloaded once this cycle: nothing to do.
        if (
            window.crossOriginIsolated !== false ||
            !coi.shouldRegister()
        ) {
            return;
        }

        if (!window.isSecureContext) {
            log("Not registered: a secure context (https/localhost) is required.");
            return;
        }

        if (!nav.serviceWorker) {
            log("Not registered: service workers are unsupported.");
            return;
        }

        nav.serviceWorker
            .register(window.document.currentScript.src)
            .then(
                (registration) => {

                    log("Registered, scope:", registration.scope);

                    registration.addEventListener("updatefound", () => {

                        log("Worker updated; reloading.");

                        window.sessionStorage.setItem(
                            RELOAD_KEY,
                            "updatefound"
                        );

                        coi.doReload();

                    });

                    // Worker is already active but isn't controlling this
                    // page yet (first visit): reload so it can.
                    if (
                        registration.active &&
                        !nav.serviceWorker.controller
                    ) {

                        log("Reloading so the worker takes control.");

                        window.sessionStorage.setItem(
                            RELOAD_KEY,
                            "notcontrolling"
                        );

                        coi.doReload();

                    }

                },
                (error) => {
                    console.error("[coi-sw] registration failed:", error);
                }
            );

    })();

}
