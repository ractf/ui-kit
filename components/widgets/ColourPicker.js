import React, { useRef, useCallback, useEffect, useState } from "react";

import { COLOURS } from "@ractf/ui-kit/colours";
import { colourToRGBA, rgb2hex, rgb2hsv, hsv2rgb, makeClass } from "@ractf/util";

import style from "./ColourPicker.module.scss";


const DRAG_GRADIENT = "gradient";
const DRAG_HUE = "hue";
const DRAG_ALPHA = "alpha";

const PALETTE = [
    "green", "teal", "cyan", "blue", "indigo", "purple", "pink", "red",
    "orange", "yellow", "black", "darkGrey", "grey", "lightGrey", "white"
];

const getPos = (e, bounds) => {
    const x = Math.max(0, Math.min(1, (e.pageX - bounds.left) / bounds.width));
    const y = Math.max(0, Math.min(1, (e.pageY - bounds.top) / bounds.height));
    return [x, y];
};

const clickBlock = (e) => {
    e.preventDefault();
    e.stopPropagation();
};

const getInputValues = (hsvaRGB, oldInputs = null, preserve = null) => {
    let h, s, v, a, r, g, b;
    if (hsvaRGB.length === 7)
        [h, s, v, a, r, g, b] = hsvaRGB;
    else {
        [h, s, v, a] = hsvaRGB;
        [r, g, b] = hsv2rgb(h, s, v);
    }

    const newInputs = {
        r: Math.round(r).toString(), g: Math.round(g).toString(),
        b: Math.round(b).toString(), a: Math.round(a * 100).toString(),
        h: Math.round(h * 360).toString(),
        s: Math.round(s * 100).toString(),
        v: Math.round(v * 100).toString(),
        hex: rgb2hex(r, g, b, a * 255)
    };
    if (oldInputs && preserve)
        preserve.forEach(i => { newInputs[i] = oldInputs[i]; });
    return newInputs;
};

export const getForegroundColour = (bgOrR, g, b) => {
    if (!bgOrR) return "#fff";

    let r;
    if (!(g && b))
        [r, g, b] = colourToRGBA(bgOrR);
    else r = bgOrR;

    const intensity = (r * 0.299 + g * 0.587 + b * 0.114);
    return intensity > 186 ? "#000" : "#fff";
};

const getInitialCPState = (value) => {
    // Default to H=0, S=50, V=50
    const initial = colourToRGBA(value) || [126, 63, 63, 255];
    const initialHSVA = [...rgb2hsv(initial[0] / 255, initial[1] / 255, initial[2] / 255), initial[3] / 255];
    return {
        hsva: initialHSVA,
        inputs: getInputValues(initialHSVA)
    };
};
const ColourPicker = ({ onChange, className, value }) => {
    const [{ hsva, inputs }, setState] = useState(getInitialCPState(value));
    const hsvaRef = useRef(hsva);
    useEffect(() => { hsvaRef.current = hsva; }, [hsva]);
    // useEffect(() => { setState(getInitialCPState(value)); }, [value]);

    const alphaBarRef = useRef();
    const draggingOn = useRef();
    const hueBarRef = useRef();
    const wrapRef = useRef();

    const localPalette = PALETTE.map(i => COLOURS[i]);

    const [absR, absG, absB] = hsv2rgb(hsva[0], 1, 1);
    const [r, g, b] = hsv2rgb(hsva[0], hsva[1], hsva[2]);

    const lastMove = useRef();
    useEffect(() => {
        const move = (e) => {
            if (e.buttons !== 1) return;
            if (!draggingOn.current) return;
            clickBlock(e);
            if (document.activeElement)
                document.activeElement.blur();

            // We needn't update faster than 60fps
            if (lastMove.current && ((new Date()) - lastMove.current) < 15)
                return;
            lastMove.current = new Date();

            let [h, s, v, a] = hsvaRef.current;

            let bounds;
            switch (draggingOn.current) {
                case DRAG_GRADIENT:
                    bounds = wrapRef.current.getBoundingClientRect();
                    const [x, y] = getPos(e, bounds);
                    s = x; v = 1 - y;
                    break;
                case DRAG_HUE:
                    bounds = hueBarRef.current.getBoundingClientRect();
                    h = getPos(e, bounds)[0];
                    break;
                case DRAG_ALPHA:
                    bounds = alphaBarRef.current.getBoundingClientRect();
                    a = getPos(e, bounds)[0];
                    break;
                default: break;
            }

            const [r, g, b] = hsv2rgb(h, s, v);
            if (onChange)
                onChange(
                    [r, g, b, a * 255],
                    [h * 360, s * 100, v * 100]
                );

            setState({ hsva: [h, s, v, a], inputs: getInputValues([h, s, v, a]) });
        };
        const mouseDown = (e) => {
            switch (e.target) {
                case wrapRef.current:
                    draggingOn.current = DRAG_GRADIENT;
                    clickBlock(e);
                    break;
                case hueBarRef.current:
                    draggingOn.current = DRAG_HUE;
                    clickBlock(e);
                    break;
                case alphaBarRef.current:
                    draggingOn.current = DRAG_ALPHA;
                    clickBlock(e);
                    break;
                default:
                    draggingOn.current = null;
                    break;
            }
            move(e);
        };

        document.addEventListener("mousemove", move);
        document.addEventListener("mousedown", mouseDown);
        return () => {
            document.removeEventListener("mousemove", move);
            document.removeEventListener("mousedown", mouseDown);
        };
    }, [onChange]);

    const setCol = useCallback((e) => {
        const colour = e.target.getAttribute("data-colour");
        const [r, g, b, a] = colourToRGBA(colour);
        const [h, s, v] = rgb2hsv(r / 255, g / 255, b / 255);
        setState({
            hsva: [h, s, v, a / 255],
            inputs: getInputValues([h, s, v, a / 255, r, g, b])
        });

        if (onChange)
            onChange([r, g, b, a], [h * 360, s * 100, v * 100]);
    }, [onChange]);

    const inputChange = useCallback((e) => {
        const inputName = e.target.getAttribute("data-for");
        const newVal = e.target.value;
        const value = parseFloat(newVal);

        setState(({ inputs: oldInputs, hsva: oldHSVA }) => {
            let inputs = { ...oldInputs, [inputName]: newVal };

            // Check if we have a valid colour. Also handles NaN.
            if (!((0 <= value) && (value <= 255)) && inputName !== "hex")
                return { hsva: oldHSVA, inputs };

            let [r, g, b] = hsv2rgb(...oldHSVA);

            let h = oldHSVA[0], s = oldHSVA[1], v = oldHSVA[2], a = oldHSVA[3];
            switch (inputName) {
                case "a":
                    a = value / 100;
                    break;
                case "r":
                    r = value / 255;
                    [h, s, v] = rgb2hsv(value / 255, g / 255, b / 255);
                    break;
                case "g":
                    g = value / 255;
                    [h, s, v] = rgb2hsv(r / 255, value / 255, b / 255);
                    break;
                case "b":
                    b = value / 255;
                    [h, s, v] = rgb2hsv(r / 255, g / 255, value / 255);
                    break;
                case "h":
                    h = value / 360;
                    break;
                case "s":
                    s = value / 100;
                    break;
                case "v":
                    v = value / 100;
                    break;
                case "hex":
                    const rgb = colourToRGBA(newVal);
                    if (rgb) {
                        [r, g, b] = rgb;
                        [h, s, v] = rgb2hsv(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255);
                        a = rgb[3] / 100;
                    }
                    break;
                default: break;
            }
            switch (inputName) {
                case "h":
                case "s":
                case "v":
                    [r, g, b] = hsv2rgb(h, s, v);
                    break;
                default:
                    break;
            }
            h = Math.max(0, Math.min(1, h));
            s = Math.max(0, Math.min(1, s));
            v = Math.max(0, Math.min(1, v));
            a = Math.max(0, Math.min(1, a));
            switch (inputName) {
                case "r":
                case "g":
                case "b":
                case "a":
                    inputs = getInputValues([h, s, v, a, r, g, b], inputs, ["r", "g", "b", "a"]);
                    break;
                case "h":
                case "s":
                case "v":
                    inputs = getInputValues([h, s, v, a], inputs, ["h", "s", "v"]);
                    break;
                case "hex":
                    inputs = getInputValues([h, s, v, a, r, g, b], inputs, ["hex"]);
                    break;
                default: break;
            }

            if (onChange)
                onChange(
                    [r, g, b, a * 255],
                    [h * 360, s * 100, v * 100]
                );

            return { hsva: [h, s, v, a], inputs };
        });
    }, [onChange]);

    return <div className={makeClass(style.colourPicker, className)} onClick={clickBlock}>
        <div className={style.gradientWrap} style={{
            backgroundColor: `rgb(${absR}, ${absG}, ${absB})`
        }} ref={wrapRef}>
            <div className={style.marker} style={{
                left: hsva[1] * 100 + "%", bottom: hsva[2] * 100 + "%"
            }} />
        </div>
        <div className={style.lower}>
            <div className={style.palette}>
                {localPalette.map(i => (
                    <div
                        className={style.sample} style={{ backgroundColor: i }}
                        data-colour={i} onClick={setCol} key={i} />
                ))}
            </div>
            <div>
                <div className={style.barsRow}>
                    <div className={style.bars}>
                        <div className={`${style.bar} ${style.hueBar}`} ref={hueBarRef}>
                            <div className={style.handle} style={{
                                left: hsva[0] * 100 + "%"
                            }} />
                        </div>
                        <div className={`${style.bar} ${style.alphaBar}`} ref={alphaBarRef}>
                            <div className={style.barGradient} style={{
                                background: `linear-gradient(to right, rgba(${r}, ${g}, ${b}, 0) 0%, `
                                    + `rgb(${r}, ${g}, ${b}) 100%)`
                            }} />
                            <div className={style.handle} style={{
                                left: hsva[3] * 100 + "%"
                            }} />
                        </div>
                    </div>
                    <div className={style.sample} style={{
                        backgroundColor: `rgba(${r}, ${g}, ${b}, ${hsva[3]})`
                    }} />
                </div>
                <div className={style.inputRow}>
                    <div>
                        <input value={inputs.r} data-for={"r"} onChange={inputChange} />
                        <span>R</span>
                    </div>
                    <div>
                        <input value={inputs.g} data-for={"g"} onChange={inputChange} />
                        <span>G</span>
                    </div>
                    <div>
                        <input value={inputs.b} data-for={"b"} onChange={inputChange} />
                        <span>B</span>
                    </div>
                    <div>
                        <input value={inputs.a} data-for={"a"} onChange={inputChange} />
                        <span>A</span>
                    </div>
                </div>
                <div className={style.inputRow}>
                    <div>
                        <input value={inputs.h} data-for={"h"} onChange={inputChange} />
                        <span>H</span>
                    </div>
                    <div>
                        <input value={inputs.s} data-for={"s"} onChange={inputChange} />
                        <span>S</span>
                    </div>
                    <div>
                        <input value={inputs.v} data-for={"v"} onChange={inputChange} />
                        <span>V</span>
                    </div>
                </div>
                <div className={style.inputRow}>
                    <div>
                        <input value={inputs.hex} data-for={"hex"} onChange={inputChange} />
                        <span>Hex</span>
                    </div>
                </div>

            </div>
        </div>
    </div>;
};
export default React.memo(ColourPicker);

const getInitialPPState = (value) => {
    // Default to H=0, S=50, V=50
    const initial = colourToRGBA(value) || [126, 63, 63, 255];
    return {
        hsva: [...rgb2hsv(initial[0] / 255, initial[1] / 255, initial[2] / 255), initial[3]],
        hex: rgb2hex(initial[0], initial[1], initial[2], initial[3])
    };
};
const PalettePicker_ = ({ onChange, className, value }) => {
    const [{ hsva, hex }, setState] = useState(getInitialPPState(value));
    const [r, g, b] = hsv2rgb(hsva[0], hsva[1], hsva[2]);
    useEffect(() => { setState(getInitialPPState(value)); }, [value]);

    const localPalette = PALETTE.map(i => `--col-${i}`);

    const setCol = useCallback((e) => {
        const colour = e.target.getAttribute("data-colour");
        const [r, g, b, a] = colourToRGBA(colour);
        const [h, s, v] = rgb2hsv(r / 255, g / 255, b / 255);
        setState({
            hsva: [h, s, v, a / 255],
            hex: rgb2hex(r, g, b, a)
        });
        if (onChange)
            onChange(colour);
    }, [onChange]);

    return <div className={makeClass(style.palettePicker, className)} onClick={clickBlock}>
        <div className={style.colourSlab} style={{
            backgroundColor: `rgba(${r}, ${g}, ${b}, ${hsva[3]})`
        }}>
            <span style={{
                color: getForegroundColour(r, g, b)
            }}>{hex}</span>
        </div>
        <div className={`${style.palette} ${style.row}`}>
            {localPalette.map(i => (
                <div
                    className={style.sample} style={{ backgroundColor: `var(${i})` }}
                    data-colour={i} onClick={setCol} key={i} />
            ))}
        </div>
    </div>;
};
export const PalettePicker = React.memo(PalettePicker_);
