import { Ease } from "./types";

export const map = (number: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}
export const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);
export const easing = (num: number, ease: Ease) => {
    switch (ease) {
        case "easeIn":
            return num * num;
            
        case "easeOut":
            return 1 - Math.pow(1 - num, 2);

        case "easeInOut":
            return num * num * (3 - 2 * num);

        case "linear":
        default:
            return num;
    }
};