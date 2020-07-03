import React from "react";
import { Bar as CJSBar } from "react-chartjs-2";

import colours from "@ractf/ui-kit/Colours.scss";

import { plotHoc, palette } from "./common.js";


const Bar = plotHoc(({ data, colors, noAnimate, yMin, yMax, xLabel, yLabel }) => {
    const options = {
        legend: {
            display: false,
        },
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: !!xLabel,
                    labelString: xLabel,
                },
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    min: yMin || 0,
                    max: yMax || undefined,
                },
                scaleLabel: {
                    display: !!yLabel,
                    labelString: yLabel,
                },
            }],
        },
        maintainAspectRatio: false,
    };

    if (noAnimate)
        options.animation = { duration: 0 };

    const labels = Object.keys(data);
    data = labels.map(i => data[i]);

    data = { data };
    if (!("borderColor" in data)) data.borderColor = colours.background;
    if (!("backgroundColor" in data)) data.backgroundColor = colors || palette;
    if (!("hoverBackgroundColor" in data)) data.hoverBackgroundColor = colors || palette;

    return <CJSBar data={{ datasets: [data], labels }} options={options} />;
});
export default Bar;
