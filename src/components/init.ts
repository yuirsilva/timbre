import { Howl } from "howler";

import { gsap } from "@/lib/gsap";
import { VOLUME } from "@/lib/howler";
import { downloadResource } from "@/lib/uploadthing";

export const initPlayer = () => {
    const catalogNote = document.querySelector<HTMLDivElement>(".catalog-note");

    const blueNote = new Howl({
        src: ["/blue_note.opus.webm"],
        volume: VOLUME * 2,
    });

    catalogNote?.addEventListener("click", () => {
        blueNote.play();
    });

    const sounds: { [key: string]: Howl } = {};

    const playButton =
        document.querySelectorAll<HTMLButtonElement>(".play-button");
    const download =
        document.querySelectorAll<HTMLButtonElement>(".download-button");

    download.forEach((button) => {
        const url = button.dataset.url;
        const filename = button.dataset.filename;
        if (!url || !filename) return;

        button.addEventListener("click", () => {
            downloadResource(url, filename, button);
        });
    });

    const ANIM_DURATION = 0.74;

    playButton.forEach((button) => {
        const url = button.dataset.url;
        const filename = button.dataset.filename;
        const bg = button.dataset.bg;

        if (!url || !filename) return;

        const play = button.querySelector(".play-button-play");
        const pause = button.querySelector(".play-button-pause");

        const parent = button.parentElement?.parentElement;

        sounds[filename] = new Howl({
            src: [url],
            html5: true,
            format: "webm",
            preload: true,
            onplay: () => {
                if (parent)
                    gsap.to(parent, {
                        backgroundColor: bg,
                        duration: ANIM_DURATION * 0.25,
                        ease: "secondary-ease",
                    });

                gsap.to(play, {
                    scale: 0,
                    duration: ANIM_DURATION,
                });
                gsap.to(pause, {
                    scale: 1,
                    opacity: 1,
                    duration: ANIM_DURATION,
                });
            },
            onstop: () => {
                if (parent)
                    gsap.to(parent, {
                        duration: ANIM_DURATION * 0.25,
                        clearProps: "backgroundColor",
                        ease: "secondary-ease",
                    });

                gsap.to(play, {
                    scale: 1,
                    opacity: 1,
                    duration: ANIM_DURATION,
                });
                gsap.to(pause, {
                    scale: 0,
                    opacity: 0,
                    duration: ANIM_DURATION,
                });
            },
            onend: () => {
                if (parent)
                    gsap.to(parent, {
                        duration: ANIM_DURATION * 0.25,
                        clearProps: "backgroundColor",
                        ease: "secondary-ease",
                    });

                gsap.to(play, {
                    scale: 1,
                    opacity: 1,
                    duration: ANIM_DURATION,
                });
                gsap.to(pause, {
                    scale: 0,
                    opacity: 0,
                    duration: ANIM_DURATION,
                });
            },
        });

        button.addEventListener("click", () => {
            Object.values(sounds).forEach((sound) => {
                if (sound !== sounds[filename] && sound.playing()) {
                    sound.stop();
                }
            });

            sounds[filename]?.playing()
                ? sounds[filename].stop()
                : sounds[filename]?.play();
        });
    });
};
