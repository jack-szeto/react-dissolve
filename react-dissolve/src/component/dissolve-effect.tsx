import React, { useEffect, useRef, useState } from "react";
import SimplexNoise from 'simplex-noise';
import Sketch from "react-p5";
import p5Types from "p5";
import colorString from "color-string";
import { useHover, useOnScreen, useWindowSize } from "./hooks";
import Slider from "rc-slider/lib/Slider";

import 'rc-slider/assets/index.css';
import styles from './style.module.scss';
import { Animate, Ease } from "./types";
import { map, clamp, easing } from "./helpers";

export interface DissolveEffectProps {
    className?: string,
    style?: React.CSSProperties,
    width: number,
    height: number,
    frameRate?: number,
    src?: string,
    color?: string,
    threshold?: number,
    animate?: Animate,
    animateMobile?: Animate,
    breakpoint?: number,
    handle?: boolean,
    zoom?: number,
    softenShape?: boolean,
    fade?: {
        innerEffect?: boolean,
        innerEdge?: number,
        outerEdge?: number,
        offset?: {x: number, y: number},
        ease?: Ease,
    },
    debug?: boolean,
}

const DissolveEffect: React.FC<DissolveEffectProps> = ({
    className, 
    style, 
    width, 
    height, 
    frameRate,
    src, 
    color,
    threshold, 
    animate, 
    animateMobile,
    breakpoint,
    handle,
    zoom,
    softenShape,
    fade,
    debug,
}: DissolveEffectProps) => {
    const ref = useRef<HTMLDivElement|null>(null);
    const isVisible = useOnScreen(ref);
    const isHover = useHover(ref);
    const windowSize = useWindowSize();
    const [time, setTime] = useState(0);
    const [seed] = useState(Math.random());

    const simplex = new SimplexNoise(seed);
    const getNoiseValue = ({x, y, zoom, offset, time}:{
        x: number, 
        y: number, 
        zoom?: number, 
        offset?: {x: number, y: number}, 
        time?: number
    }) => {
        const s = zoom ?? 1;
        const os = offset ?? {x:0,y:0};
        return map(simplex.noise3D(x / s + os.x, y / s + os.y, time ?? 0), -1, 1, 0, 1);
    };
    const [_frameRate, set_frameRate] = useState(frameRate ?? 30);
    const [_threshold, set_threshold] = useState(clamp(threshold ?? 0.5, 0, 1));
    const [_src, set_src] = useState<FileList|string|null|undefined>(src);
    const [_img, set_img] = useState<p5Types.Image|null>(null);
    const [_color, set_color] = useState(color??"#40DECF");
    const cStr = colorString.get(_color);
    const [_animate, set_animate] = useState(animate ?? "always");
    const [_animateMobile, set_animateMobile] = useState(animateMobile ?? "none");
    const [_breakpoint, set_breakpoint] = useState(breakpoint ?? 768);
    const [_zoom, set_zoom] = useState(zoom ?? 40);
    const [_offset, set_offset] = useState(fade?.offset ?? {x: 0, y: 0});
    const [_innerEdge, set_innerEdge] = useState(fade?.innerEdge ?? 0);
    const [_outerEdge, set_outerEdge] = useState(fade?.outerEdge ?? 1);
    const [_ease, set_ease] = useState(fade?.ease ?? "linear");
    const [_softenShape, set_softenShape] = useState(softenShape??false);
    const [_innerEffect, set_innerEffect] = useState(fade?.innerEffect??false);
    const [_debug, set_debug] = useState(debug ?? false);

    const radius = Math.min(width, height) / 2;
    const fadeCenter = {x: width / 2 + (_offset.x), y: height / 2 + (_offset.y)};
    const innerEdge = Math.max(_innerEdge, 0) * radius;
    const outerEdge = Math.max(_outerEdge, 0) * radius;
    const ease = _ease;

    const drawPicture = (p5: p5Types) => {
        p5.clear();
        
        if (_img) {
            p5.background(_img);
        }

        p5.loadPixels();

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const index = (x + y * height) * 4;
                const noiseValue = getNoiseValue({x: x, y: y, zoom: _zoom, time: time});
                
                // get distance ratio between inner edge and outer edge
                const xDiff = x - fadeCenter.x;
                const yDiff = y - fadeCenter.y;
                const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
                const distanceRatio = clamp(map(distance, innerEdge, outerEdge, 0, 1), 0, 1);
                
                /**
                 * value is in the range from 0 to 1
                 */
                var value: number;
                if (distanceRatio <= 0) {
                    value = _innerEffect ? noiseValue > _threshold ? _softenShape ? map(noiseValue, _threshold, 1, 0, 1) : 1 : 0 : 1;
                } else if (distanceRatio >= 1) {
                    value = 0;
                } else {
                    var nv = noiseValue;
                    if (_innerEffect) {
                        nv = clamp(map(nv, easing(distanceRatio, ease), 1, _threshold * easing(distanceRatio, ease), 1), 0, 1);
                        value = nv > _threshold ? _softenShape ? map(nv, _threshold, 1, 0, 1) : 1 : 0;
                    } else {
                        nv = clamp(map(nv, 0, _threshold * easing(distanceRatio, ease), 0, 1 * easing(1-distanceRatio, ease)), 0, 1);
                        value = nv >= _threshold ? _softenShape ? map(nv, _threshold, 1, 0, 1) : 1 : 0;
                    }
                }

                // apply the color
                if (!_img) {
                    p5.pixels[index + 0] = cStr?.value[0] ?? 255;
                    p5.pixels[index + 1] = cStr?.value[1] ?? 255;
                    p5.pixels[index + 2] = cStr?.value[2] ?? 255;
                }
                p5.pixels[index + 3] = value * 255;
            }
        }
        p5.updatePixels();
        
        if (_debug) {
            // visualise the effect range
            const crossSize = 4;
            p5.noFill();
            p5.stroke(255, 0, 0);
            p5.line(fadeCenter.x, fadeCenter.y - crossSize, fadeCenter.x, fadeCenter.y + crossSize);
            p5.line(fadeCenter.x - crossSize, fadeCenter.y, fadeCenter.x + crossSize, fadeCenter.y);
            p5.stroke(255, 200, 0);
            p5.ellipse(fadeCenter.x, fadeCenter.y, innerEdge * 2);
            p5.stroke(0, 255, 0);
            p5.ellipse(fadeCenter.x, fadeCenter.y, outerEdge * 2);
        }
    }

    const play = (p5: p5Types) => {
        drawPicture(p5);
        setTime((t)=> t + 1 / p5.frameRate());
    }

    const preload = (p5: p5Types) => {
        if (_src !== null) {
            p5.loadImage(_src as string, img => {
                set_img(img)
                set_src(null);
            });
        }
    }

    const setup = (p5: p5Types, canvasParentRef: Element) => {
		p5.createCanvas(width, height).parent(canvasParentRef);
        p5.frameRate(_frameRate);
        p5.pixelDensity(1);
        drawPicture(p5);
	};

	const draw = (p5: p5Types) => {
        if (p5.frameCount <= 1) return;
        var run = false;
        if (windowSize.width <= _breakpoint) {
            // mobile device
            run = isVisible && (_animateMobile === "always" || (_animateMobile === "hover" && isHover));
        } else {
            // large device
            run = isVisible && (_animate === "always" || (_animate === "hover" && isHover));
        }
        if (run) play(p5);
	};

    return (
        <div className={styles["react-dissolve-effect"]}>
            <div ref={ref} className={`${styles.wrapper} ${_debug?styles.debug:""}`}>
                <Sketch preload={preload} setup={setup} draw={draw} className={`${styles.canvasParent} ${className}`} style={{...style as { [key: string]: number|string }}} />
            </div>
            {handle && <div className={styles.handles}>
                <h2>Handles</h2>
                <div className={styles.handle}>
                    <span>🧨 Debug</span>
                    <input type={"checkbox"} onChange={(v) => set_debug(v.target.checked)} checked={_debug} />
                </div>
                <div className={styles.handle}>
                    <span>Frame Rate <sub style={{color: "#ff6464"}}>only change before render</sub></span>
                    <Slider disabled min={1} max={120} onChange={(v) => set_frameRate(v)} value={_frameRate} />
                    <input disabled type="number" min={1} max={120} onChange={(e) => set_frameRate(+e.target.value)} value={_frameRate} />
                </div>
                <div className={styles.handle}>
                    <span>Threshold</span>
                    <Slider step={0.01} min={0} max={1} onChange={(v) => set_threshold(v)} value={_threshold} />
                    <input type="number" min={0} max={1} onChange={(e) => set_threshold(+e.target.value)} value={_threshold} />
                </div>
                <div className={styles.handle}>
                    <span>Color</span>
                    <input type="color" onChange={(e) => set_color(e.target.value)} value={_color} />
                </div>
                <div className={styles.handle}>
                    <span>Animate</span>
                    <select 
                        value={_animate}
                        onChange={(e) => set_animate(e.target.value as Animate)}
                    >
                        <option value={"always"}>Always</option>
                        <option value={"hover"}>Hover</option>
                        <option value={"none"}>None</option>
                    </select>
                </div>
                {windowSize.width <= _breakpoint && (
                    <>
                        <div className={styles.handle}>
                            <span>Animate Mobile</span>
                            <select 
                                value={_animateMobile}
                                onChange={(e) => set_animateMobile(e.target.value as Animate)}
                            >
                                <option value={"always"}>Always</option>
                                <option value={"hover"}>Hover</option>
                                <option value={"none"}>None</option>
                            </select>
                        </div>
                        <div className={styles.handle}>
                            <span>Breakpoint</span>
                            <Slider min={1} max={2560} onChange={(v) => set_breakpoint(v)} value={_breakpoint} />
                            <input type="number" min={1} max={2560} onChange={(e) => set_breakpoint(+e.target.value)} value={_breakpoint} />
                        </div>
                    </>
                )}
                <div className={styles.handle}>
                    <span>Zoom</span>
                    <Slider min={1} max={100} onChange={(v) => set_zoom(v)} value={_zoom} />
                    <input type="number" min={1} max={100} onChange={(e) => set_zoom(+e.target.value)} value={_zoom} />
                </div>
                <div className={styles.handle}>
                    <span>Offset X</span>
                    <Slider min={-width} max={width} onChange={(v) => set_offset((p)=>({x: v, y: p.y}))} value={_offset.x} />
                    <input type="number" min={-width} max={width} onChange={(e) => set_offset((p)=>({x: +e.target.value, y: p.y}))} value={_offset.x} />
                </div>
                <div className={styles.handle}>
                    <span>Offset Y</span>
                    <Slider min={-height} max={height} onChange={(v) => set_offset((p)=>({x: p.x, y: v}))} value={_offset.y} />
                    <input type="number" min={-height} max={height} onChange={(e) => set_offset((p)=>({x: p.x, y: +e.target.value}))} value={_offset.y} />
                </div>
                <div className={styles.handle}>
                    <span>Inner Edge</span>
                    <Slider step={0.01} min={0} max={3} onChange={(v) => set_innerEdge(v)} value={_innerEdge} />
                    <input type="number" min={0} max={3} onChange={(e) => set_innerEdge(+e.target.value)} value={_innerEdge} />
                </div>
                <div className={styles.handle}>
                    <span>Outer Edge</span>
                    <Slider step={0.01} min={0} max={3} onChange={(v) => set_outerEdge(v)} value={_outerEdge} />
                    <input type="number" min={0} max={3} onChange={(e) => set_outerEdge(+e.target.value)} value={_outerEdge} />
                </div>
                <div className={styles.handle}>
                    <span>Edge Easing</span>
                    <select 
                        value={_ease}
                        onChange={(e) => set_ease(e.target.value as Ease)}
                    >
                        <option value={"linear"}>Linear</option>
                        <option value={"easeIn"}>Ease In</option>
                        <option value={"easeOut"}>Ease Out</option>
                        <option value={"easeInOut"}>Ease In Out</option>
                    </select>
                </div>
                <div className={styles.handle}>
                    <span>Soften Shape</span>
                    <input type={"checkbox"} onChange={(v) => set_softenShape(v.target.checked)} checked={_softenShape} />
                </div>
                <div className={styles.handle}>
                    <span>Inner Effect</span>
                    <input type={"checkbox"} onChange={(v) => set_innerEffect(v.target.checked)} checked={_innerEffect} />
                </div>
            </div>}
        </div>
    )
}

export default DissolveEffect;