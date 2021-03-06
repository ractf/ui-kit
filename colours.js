import { copyObj } from "@ractf/util";


export const BASE_COLOURS = {
    white: "#fff",
    lightGrey: "#f2f2f2",
    grey: "#e0e1e2",
    darkGrey: "#5b5b5b",
    black: "#363636",

    blue: "#4582ec",
    indigo: "#6610f2",
    purple: "#6f42c1",
    pink: "#e83e8c",
    red: "#d9534f",
    orange: "#fd7e14",
    yellow: "#f0ad4e",
    green: "#02b875",
    teal: "#20c997",
    cyan: "#17a2b8",

    accent: "#4582ec",

    background: "--col-white",
    color: "--col-black",

    "back-lift": "rgba(54, 54, 54, 0.125)",
    "back-lift-2x": "rgba(54, 54, 54, 0.25)",
};
export const COLOURS = copyObj(BASE_COLOURS);

export const BASE_TYPES = {
    primary: {
        fg: "--col-white",
        bg: "--col-accent",
    },
    secondary: {
        fg: "--col-darkGrey",
        bg: "--col-grey",
        "fg-lesser": "--col-darkGrey",
    },
    success: {
        fg: "--col-white",
        bg: "--col-green",
    },
    info: {
        fg: "--col-white",
        bg: "--col-cyan",
    },
    warning: {
        fg: "--col-black",
        bg: "--col-yellow",
    },
    danger: {
        fg: "--col-white",
        bg: "--col-red",
    },
    dark: {
        fg: "--col-white",
        bg: "--col-black",
    },
    light: {
        fg: "--col-black",
        bg: "--col-lightGrey",
        "fg-lesser": "--col-black",
        "bg-lesser": "--col-lightGrey",
    },
};
export const TYPES = copyObj(BASE_TYPES);

window.__ractf_colours = COLOURS;
window.__ractf_types = TYPES;
