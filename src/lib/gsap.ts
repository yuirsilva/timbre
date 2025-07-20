import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(CustomEase, SplitText);

CustomEase.create("primary-ease", "0.62, 0.05, 0.01, 0.99");
CustomEase.create("secondary-ease", "0.19, 1, 0.22, 1");

gsap.config({
    autoSleep: 60,
});

gsap.defaults({
    duration: 0.6,
    ease: "primary-ease",
});

export { gsap, SplitText };
