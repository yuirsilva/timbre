export interface Hsl {
    h: number; // 0–359
    s: number; // 0–100
    l: number; // 0–100
}

export interface HslOptions {
    hue?: [number, number]; // inclusive range
    saturation?: [number, number]; // inclusive range
    lightness?: [number, number]; // inclusive range
    /** If true, return also as CSS string. Default true. */
    asString?: boolean;
}

export interface HslResult extends Hsl {
    css: string;
}

/**
 * Generate a random HSL color within optional ranges.
 *
 * All ranges are clamped to valid bounds. If min > max they are swapped.
 */
export function generateHsl(opts: HslOptions = {}): HslResult {
    const {
        hue = [0, 359],
        saturation = [40, 90], // narrower defaults give more vivid colors
        lightness = [35, 70],
    } = opts;

    const norm = (range: [number, number], max: number) => {
        let [a, b] = range;
        if (a > b) [a, b] = [b, a];
        a = Math.max(0, Math.min(a, max));
        b = Math.max(0, Math.min(b, max));
        return [a, b] as [number, number];
    };

    const [hMin, hMax] = norm(hue, 359);
    const [sMin, sMax] = norm(saturation, 100);
    const [lMin, lMax] = norm(lightness, 100);

    const randInt = (min: number, max: number) =>
        Math.floor(Math.random() * (max - min + 1)) + min;

    const h = randInt(hMin, hMax);
    const s = randInt(sMin, sMax);
    const l = randInt(lMin, lMax);

    return {
        h,
        s,
        l,
        css: `hsl(${h} ${s}% ${l}%)`, // or `hsl(${h}, ${s}%, ${l}%)`
    };
}
