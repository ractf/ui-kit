import React from "react";

import { COLOURS, TYPES } from "@ractf/ui-kit/colours";
import { mergeObj, mergeObjInto } from "@ractf/util";


const makeProp = (name, value) => {
    if (value.startsWith("--"))
        value = `var(${value})`;
    return `${name}: ${value};`;
};

const ThemeLoader = ({
    theme = null, global = false, minimal = false,
    colours = {}, types = {},
    root = [":root", "#root"]
}) => {
    if (theme) {
        colours = mergeObj(theme.colours || {}, colours);
        types = mergeObj(theme.types || {}, types);
    }
    if (global) {
        mergeObjInto(COLOURS, colours);
        mergeObjInto(TYPES, types);
    }
    if (!minimal) {
        colours = mergeObj(COLOURS, colours);
        types = mergeObj(TYPES, types);
    }

    let style = `${root[0]} {`;
    Object.keys(colours).forEach(colour => {
        style += makeProp(`--col-${colour}`, colours[colour]);
    });
    style += `} ${root[1]} {`;
    Object.keys(types).forEach(type => {
        Object.keys(types[type]).forEach(key => {
            style += makeProp(`--type-${type}-${key}`, types[type][key]);
        });
    });
    style += "}";

    return <style dangerouslySetInnerHTML={{ __html: style }} />;
};
export default React.memo(ThemeLoader);
