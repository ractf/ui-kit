import React from "react";
import { Doughnut } from "react-chartjs-2";

import colours from "@ractf/ui-kit/Colours.scss";

import { plotHoc, palette } from "./common.js";


const Pie = plotHoc(({ data, labels, colors, noAnimate }) => {
    const options = {
        legend: {
            position: "bottom",
            labels: {
                fontColor: colours.color,
            },
        },
        maintainAspectRatio: false,
    };

    if (noAnimate)
        options.animation = { duration: 0 };

    data = { data };
    if (!("borderColor" in data)) data.borderColor = colours.background;
    if (!("backgroundColor" in data)) data.backgroundColor = colors || palette;
    if (!("hoverBackgroundColor" in data)) data.hoverBackgroundColor = colors || palette;

    return <Doughnut data={{ datasets: [data], labels: labels }} options={options} />;
});
export default Pie;
