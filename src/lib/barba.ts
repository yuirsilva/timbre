import barba from "@barba/core";
import type { ITransitionData } from "@barba/core/dist/core/src/src/defs";

import { sine } from "@/lib/sine-wave";
import { gsap, SplitText } from "@/lib/gsap";
import { FADE_DURATION, sound } from "@/lib/howler";

import { initPlayer } from "@components/init";
import Canvas from "@/components/background/ogl";

let homeCanvas: Canvas | null = null;

const homeCanvasWrapper = document.querySelector<HTMLDivElement>(
    "#home-canvas-wrapper"
);

const reveal = (): gsap.core.Timeline => {
    const tl = gsap.timeline({
        defaults: {
            duration: 1.47,
        },
    });

    tl.to(".reveal p", {
        y: 0,
    });

    tl.to(".reveal", {
        autoAlpha: 0,
        duration: 0.7,
    });

    tl.set(".reveal", {
        display: "none",
        pointerEvents: "none",
    });

    return tl;
};

const home = (): gsap.core.Timeline => {
    const split_heading = SplitText.create("[data-split-lines]", {
        type: "lines",
        tag: "span",
        mask: "lines",
    });

    const tl = gsap.timeline({
        defaults: {
            duration: 1.47,
        },
    });

    if (homeCanvas)
        tl.to(homeCanvas.program.uniforms.uPlay, {
            value: 1,
        });

    tl.from(
        ".home-nav-credits",
        {
            yPercent: 100,
        },
        "<0.1"
    );

    tl.fromTo(
        split_heading.lines,
        {
            yPercent: 100,
        },
        {
            yPercent: -10,
            stagger: 0.07,
            duration: 1.47,
        },
        "<"
    );

    tl.from(
        ".home-check-button",
        {
            autoAlpha: 0,
        },
        "<"
    );

    return tl;
};

const catalog = (): gsap.core.Timeline => {
    const tl = gsap.timeline({
        defaults: {
            duration: 1.47,
        },
    });

    tl.from(".catalog-note", {
        autoAlpha: 0,
    });

    tl.fromTo(
        ".catalog-heading",
        {
            yPercent: 100,
        },
        {
            yPercent: -7,
        },
        "<"
    );

    tl.from(
        ".catalog-description",
        {
            yPercent: 100,
        },
        "<0.1"
    );

    tl.from(
        ".catalog",
        {
            autoAlpha: 0,
            yPercent: 18,
        },
        "<0.4"
    );

    tl.from(
        ".request-link",
        {
            autoAlpha: 0,
        },
        "<"
    );

    return tl;
};

const leave = (data: ITransitionData): gsap.core.Timeline => {
    const tl = gsap.timeline({
        defaults: {
            duration: 1.47,
        },
    });

    tl.to(
        data.current.container,
        {
            yPercent: -20,
        },
        "<"
    );

    tl.set(
        data.current.container,
        {
            zIndex: -10,
        },
        "<"
    );

    tl.to(
        ".transition-layer",
        {
            display: "block",
            opacity: 1,
        },
        "<"
    );

    return tl;
};

barba.init({
    preventRunning: true,
    timeout: 7000,
    views: [
        {
            namespace: "Home",
            beforeEnter: () => {
                if (homeCanvasWrapper)
                    homeCanvas = new Canvas({
                        element: homeCanvasWrapper,
                    });

                sine(
                    ".home-check-button-svg",
                    ".home-check-button-line",
                    50,
                    15,
                    2.5,
                    40
                );
            },
        },
        {
            namespace: "Catalog",
            beforeEnter: () => {
                if (sound.playing()) {
                    sound.fade(sound.volume(), 0, FADE_DURATION);
                    setTimeout(() => {
                        sound.pause();
                    }, FADE_DURATION);
                }

                initPlayer();
            },
            afterEnter: () => {},
        },
    ],
    transitions: [
        {
            name: "to-catalog",
            from: {},
            to: { namespace: "Catalog" },
            once: async () => {
                const tl = gsap.timeline();
                tl.add(reveal());
                tl.add(catalog(), ">-0.8");

                await tl;
            },
        },
        {
            sync: true,
            name: "from-home",
            from: { namespace: "Home" },
            to: { namespace: "Catalog" },
            leave: async (data: ITransitionData) => {
                await leave(data);
            },
            enter: async (data: ITransitionData) => {
                const tl = gsap.timeline({
                    defaults: {
                        duration: 1.47,
                    },
                });

                tl.set(
                    data.next.container,
                    {
                        zIndex: 0,
                    },
                    "<"
                );

                tl.from(".catalog-background", {
                    yPercent: 100,
                });

                tl.add(catalog(), ">-0.8");

                await tl;
            },
        },
        {
            name: "to-home",
            to: { namespace: "Home" },
            enter: async () => {
                await home();
            },
            once: async () => {
                const tl = gsap.timeline();
                tl.add(reveal());

                tl.add(home(), ">-0.85");

                await tl;
            },
        },
        {
            name: "default",
            once: async () => {
                const tl = gsap.timeline();
                tl.add(reveal());

                await tl;
            },
        },
    ],
});
