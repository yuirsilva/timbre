import { Howl } from "howler";
import barba from "@barba/core";

import { gsap } from "@/lib/gsap";

export const FADE_DURATION = 600;
export const VOLUME = 0.3;

export const sound = new Howl({
    src: ["/loop.webm"],
    loop: true,
    volume: VOLUME,
});

const playOnClick = () => {
    if (barba.data.next.namespace === "Catalog") {
        window.removeEventListener("click", playOnClick);
        return;
    }

    if (barba.data.current.namespace === "Home") {
        if (!sound.playing()) {
            sound.fade(0, VOLUME, FADE_DURATION).play();

            gsap.to(".home-player-button-svg", {
                scale: 1,
            });
            gsap.to(".home-player-button-play-svg", {
                scale: 0,
            });

            window.removeEventListener("click", playOnClick);
        }
    }
};

window.addEventListener("click", playOnClick);
