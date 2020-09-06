import React from "react";
import { compiler } from "markdown-to-jsx";

import {
    Row, Card, FlashText, HR, Leader, H1, H2, H3, H4, H5, H6, Button
} from "@ractf/ui-kit";
import { TYPES, makeClass } from "@ractf/util";

import style from "./Markdown.module.scss";
import gridStyle from "./Grid.module.scss";


// https://help.blackboard.com/Learn/Administrator/Hosting/Security/
//   Key_Security_Features/System_and_Information_Integrity/Safe_HTML
//   #html-body-tags-and-attributes_OTP-4
const BASE = ["id", "class", "lang", "dir", "title"];
const WHITELIST = {
    // Grouping
    div: [...BASE, "align"],
    span: ["id", "class", "xmlLang", "dir", "title", "align"],
    center: [...BASE],
    // Images
    img: [...BASE, "src", "alt", "longdesc", "name", "align", "width", "height", "border", "hspace", "vspace"],
    // Headings
    h1: [...BASE, "align"],
    h2: [...BASE, "align"],
    h3: [...BASE, "align"],
    h4: [...BASE, "align"],
    h5: [...BASE, "align"],
    h6: [...BASE, "align"],
    // address
    address: BASE,
    // Font style
    tt: BASE, i: BASE, b: BASE, big: BASE, small: BASE,
    // HR
    hr: BASE,
    // Lists
    ul: BASE, li: BASE, ol: BASE,
    // Definition lists
    dl: BASE, dt: BASE, dd: BASE,
    dir: ["id", "class", "dir", "title", "compact"],
    menu: [...BASE, "compact"],
    // Links
    a: [...BASE, "href", "name", "rev", "tabIndex", "name"],
    // Phrase elements
    em: BASE, strong: BASE, cite: BASE, dfn: BASE, code: BASE, samp: BASE,
    kbd: BASE, var: BASE, abbr: BASE, acronym: BASE,
    // Quotations
    blockquote: BASE, q: BASE,
    // Super/subscripts
    sub: BASE, sup: BASE,
    // Lines and paragraphs
    p: [...BASE, "align"], br: ["id", "class", "title", "clear"], pre: BASE,
    // Tables:
    table: ["id", "border", "cellPadding", "cellSpacing", "align", "class",
            "frame", "summary", "lang", "dir", "bgColor", "width", "rules"],
    caption: ["id", "land", "dir", "title"],
    thread: [...BASE, "cellhalign", "cellvalign", "align", "char", "charOff",
            "valign"],
    tfoot: [...BASE, "cellhalign", "cellvalign", "align", "char", "charOff",
            "valign"],
    thead: [...BASE, "align", "char", "charOff", "valign"],
    tbody: [...BASE, "align", "char", "charOff", "valign"],
    colgroup: [...BASE, "span", "width", "align", "char", "charOff", "valign"],
    col: [...BASE, "span", "width", "align", "char", "charOff", "valign"],
    tr: [...BASE, "bgColor", "align", "char", "charOff", "valign"],
    th: [...BASE, "abbr", "axis", "headers", "scope", "rowSpan", "colSpan",
         "bgColor", "align", "char", "charOff", "valign"],
    td: [...BASE, "abbr", "axis", "headers", "scope", "rowSpan", "colSpan",
         "bgColor", "align", "char", "charOff", "valign"],

    // ui-kit specials
    row: ["left", "right"],
    card: ["header", "title", ...TYPES],
    alert: [...TYPES],
    leader: ["sub"],
    redact: [],
    button: ["to", "lesser", "tooltip", "disabled", "large", "tiny", "pill", ...TYPES],
};

const PROTOCOLS = ["http", "https", "mailto", "tel"];


const uriTransformer = uri => {
    const url = (uri || "").trim();
    const first = url.charAt(0);

    if (first === "#" || first === "/")
        return url;

    const colon = url.indexOf(":");
    if (colon === -1) return url;

    for (const protocol of PROTOCOLS)
        if (colon === protocol.length && url.slice(0, protocol.length).toLowerCase() === protocol)
            return url;

    let index;
    index = url.indexOf("?");
    if (index !== -1 && colon > index) return url;

    index = url.indexOf("#");
    if (index !== -1 && colon > index) return url;

    // eslint-disable-next-line no-script-url
    return "javascript:void(0)";
};

const Markdown = ({ className, source, LinkElem = "a" }) => {
    const SPECIALS = {
        row: Row,
        card: Card,
        alert: FlashText,
        leader: Leader,
        button: Button,
        hr: HR,
        h1: H1,
        h2: H2,
        h3: H3,
        h4: H4,
        h5: H5,
        h6: H6,
    };

    const createElement = (type, props, ...children) => {
        if (!WHITELIST[type])
            return null;
        
        const safeProps = {};
        for (const i of WHITELIST[type])
            safeProps[i] = props[i];
        safeProps.key = props.key;

        switch (type) {
            case "img":
                safeProps.src = uriTransformer(safeProps.src);
                safeProps.style = { maxWidth: "100%" };
                break;
            case "div":
                safeProps["class"] = makeClass(safeProps["class"], className, style.div);
                break;
            case "table":
                safeProps["class"] = makeClass(gridStyle.grid, safeProps["class"]);
                break;
            case "a":
                const href = uriTransformer(safeProps.href);
                const firstChar = href.charAt(0);
                if ((firstChar === "#" || firstChar === "/" || href.length === 0)) {
                    // Internal link
                    if (LinkElem !== "a") {
                        delete safeProps.href;
                        safeProps.to = href;
                    }
                    type = LinkElem;
                } else {
                    safeProps.href = href;
                    safeProps.target = "_blank";
                    safeProps.rel = "noopener noreferrer";
                }
                break;
            case "del":
            case "redact":
                return <span className={"redacted"}>{children}</span>;
            default:
                if (SPECIALS[type])
                    type = SPECIALS[type];
                break;
        }
        safeProps.className = safeProps["class"];
        delete safeProps["class"];
        return React.createElement(type, safeProps, ...children);
    };

    if (!source) source = "";
    if (typeof source !== "string") return null;

    const children = compiler(source, { forceBlock: true, createElement });
    return children;
};
export default Markdown;
