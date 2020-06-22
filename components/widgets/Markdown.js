import React from "react";
import { compiler } from "markdown-to-jsx";

import {
    Row, Card, FlashText, HR, Leader
} from "@ractf/ui-kit";
import { TYPES } from "@ractf/util";


// https://help.blackboard.com/Learn/Administrator/Hosting/Security/
//   Key_Security_Features/System_and_Information_Integrity/Safe_HTML
//   #html-body-tags-and-attributes_OTP-4
const BASE = ["id", "class", "lang", "dir", "title"];
const WHITELIST = {
    // Grouping
    div: [...BASE, "align"],
    span: ["id", "class", "xmlLang", "dir", "title", "align"],
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
    table: ["id", "border", "cellpadding", "cellspacing", "align", "class",
            "frame", "summary", "lang", "dir", "bgcolor", "width", "rules"],
    caption: ["id", "land", "dir", "title"],
    thread: [...BASE, "cellhalign", "cellvalign", "align", "char", "charoff",
            "valign"],
    tfoot: [...BASE, "cellhalign", "cellvalign", "align", "char", "charoff",
            "valign"],
    tbody: [...BASE, "align", "char", "charoff", "valign"],
    colgroup: [...BASE, "span", "width", "align", "char", "charoff", "valign"],
    col: [...BASE, "span", "width", "align", "char", "charoff", "valign"],
    tr: [...BASE, "bgcolor", "align", "char", "charoff", "valign"],
    th: [...BASE, "abbr", "axis", "headers", "scope", "rowspan", "colspan",
         "bgcolor", "align", "char", "charoff", "valign"],
    td: [...BASE, "abbr", "axis", "headers", "scope", "rowspan", "colspan",
         "bgcolor", "align", "char", "charoff", "valign"],
    
    // ui-kit specials
    row: ["left", "right"],
    card: ["header", "title", ...TYPES],
    alert: [...TYPES],
    leader: ["sub"],
    redact: []
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


export default ({ source }) => {
    const SPECIALS = {
        row: Row,
        card: Card,
        alert: FlashText,
        leader: Leader,
        hr: HR
    };

    const createElement = (type, props, ...children) => {
        if (!WHITELIST[type])
            return null;
        
        const safeProps = {};
        for (const i of WHITELIST[type])
            safeProps[i] = props[i];

        switch (type) {
            case "img":
                safeProps.src = uriTransformer(safeProps.src);
                break;
            case "a":
                safeProps.href = uriTransformer(safeProps.href);
                safeProps.target = "_blank";
                safeProps.rel = "noopener noreferrer";
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
