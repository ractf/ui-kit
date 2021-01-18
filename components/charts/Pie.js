import React from "react";
import { Doughnut } from "react-chartjs-2";

import { plotHoc, getPalette } from "./common.js";
import { cssVar } from "@ractf/util";


const Pie = plotHoc(({ data, labels, colors, noAnimate, percent }) => {
    const options = {
        legend: {
            position: "bottom",
            labels: {
                fontColor: cssVar("--col-color"),
            },
        },
        maintainAspectRatio: false,
        tooltips: {
            callbacks: {
                label: ({ index }) => {
                    if (percent)
                        return (Math.round(data.data[index] * 100) / 100) + "%";
                    return data.data[index];
                }
            }
        }
    };

    if (noAnimate)
        options.animation = { duration: 0 };

    data = { data };
    const palette = getPalette();
    if (!("borderColor" in data)) data.borderColor = cssVar("--col-background");
    if (!("backgroundColor" in data)) data.backgroundColor = colors || palette;
    if (!("hoverBackgroundColor" in data)) data.hoverBackgroundColor = colors || palette;

    return <Doughnut data={{ datasets: [data], labels: labels }} options={options} />;
});
export default Pie;
