import React from "react";
import { Scatter } from "react-chartjs-2";

import { plotHoc, getPalette } from "./common.js";
import { cssVar, transparentize } from "@ractf/util";


const Graph = plotHoc(({ data, filled, timeGraph, xLabel, yLabel, noAnimate, percent }) => {
    const hasLabels = (data || []).map(i => i && !!i.label).reduce((a, b) => a || b, false);
    const options = {
        legend: {
            position: "bottom",
            labels: {
                fontColor: cssVar("--col-color"),
            },
            display: hasLabels,
        },
        scales: {
            xAxes: [{
                gridLines: {
                    borderColor: cssVar("--col-color"),
                    tickMarkLength: 15,
                    color: cssVar("--col-back-lift"),
                },
                ticks: {
                    color: "#f0f",
                    padding: 100,
                    fontColor: cssVar("--col-color"),
                },
                scaleLabel: {
                    display: !!xLabel,
                    labelString: xLabel,
                },
            }],
            yAxes: [{
                gridLines: {
                    borderColor: cssVar("--col-color"),
                    drawTicks: false,
                    color: cssVar("--col-back-lift"),
                },
                ticks: {
                    fontColor: cssVar("--col-color"),
                    padding: 8,
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
                label: tooltipItem => {
                    if (percent)
                        return (Math.round(tooltipItem.yLabel * 100) / 100) + "%";
                    return tooltipItem.yLabel;
                }
            }
        },
    };

    if (timeGraph)
        options.scales.xAxes[0].type = "time";
    if (noAnimate)
        options.animation = { duration: 0 };

    const palette = getPalette();
    data.forEach((i, n) => {
        if (!("lineTension" in i)) i.lineTension = 0;
        if (!("pointHitRadius" in i)) i.pointHitRadius = 20;

        const colour = palette[n % palette.length];
        console.log(colour,palette);
        if (!("borderColor" in i)) i.borderColor = colour;
        if (!("pointBackgroundColor" in i)) i.pointBackgroundColor = colour;
        if (!("pointBorderColor" in i)) i.pointBorderColor = colour;
        if (!("backgroundColor" in i)) i.backgroundColor = filled ? transparentize(colour, .8) : colour;
        if (!("fill" in i)) i.fill = filled ? "zero" : false;
    });

    return <Scatter data={{ datasets: data }} options={options} />;
});
export default Graph;
