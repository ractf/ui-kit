import React from "react";
import { Bar as CJSBar } from "react-chartjs-2";

import { plotHoc, getPalette } from "./common.js";
import { cssVar } from "@ractf/util/index.js";


const Bar = plotHoc(({ data, colors, noAnimate, yMin, yMax, xLabel, yLabel, percent }) => {
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
        tooltips: {
            callbacks: {
                label: ({ yLabel }) => {
                    if (percent)
                        return (Math.round(yLabel * 100) / 100) + "%";
                    return yLabel;
                }
            }
        },
    };

    if (noAnimate)
        options.animation = { duration: 0 };

    const labels = Object.keys(data);
    data = labels.map(i => data[i]);

    const palette = getPalette();
    const paddedColours = data.map((_, n) => (colors || palette)[n % (colors || palette).length]);

    data = { data };
    if (!("borderColor" in data)) data.borderColor = cssVar("--col-background");
    if (!("backgroundColor" in data)) data.backgroundColor = paddedColours;
    if (!("hoverBackgroundColor" in data)) data.hoverBackgroundColor = paddedColours;
    if (!("fillColor" in data)) data.fillColor = paddedColours;

    return <CJSBar data={{ datasets: [data], labels }} options={options} />;
});
export default Bar;
