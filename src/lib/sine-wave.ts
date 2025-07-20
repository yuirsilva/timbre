import { gsap } from "./gsap";

export const sine = (
    svg: string,
    polyline: string,
    width: number,
    amplitude: number = 30,
    frequency: number = 5,
    segments: number = 30
) => {
    const parent = document.querySelector<SVGSVGElement>(svg);
    const wave = document.querySelector<SVGPolylineElement>(polyline);

    if (!wave || !parent) return;

    const interval = width / segments;

    for (var i = 0; i < segments; i++) {
        let norm = i / (segments - 1);
        let point = wave.points.appendItem(parent.createSVGPoint());

        point.x = i * interval;
        point.y = amplitude / 2;

        gsap.to(point, {
            y: -point.y,
            repeat: -1,
            yoyo: true,
            duration: 0.8,
            ease: "sine.inOut",
        }).progress(norm * frequency);
    }
};
