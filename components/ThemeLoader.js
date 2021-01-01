import React from "react";

import { COLOURS, TYPES } from "@ractf/ui-kit/colours";

const makeProp = (name, value) => {
    if (value.startsWith("--"))
        value = `var(${value})`;
    return `${name}: ${value};`;
};

const ThemeLoader = ({
    colours = {}, types = {},
    root = [":root", "#root"]
}) => {
    colours = { ...COLOURS, ...colours };
    types = { ...TYPES, ...types };

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
