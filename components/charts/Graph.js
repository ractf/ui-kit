import React from "react";
import { Scatter } from "react-chartjs-2";

import colours from "@ractf/ui-kit/Colours.scss";

import { plotHoc, palette } from "./common.js";
import { transparentize } from "polished";


const Graph = plotHoc(({ data, filled, timeGraph, xLabel, yLabel, noAnimate }) => {
    const options = {
        legend: {
            position: "bottom",
            labels: {
                fontColor: colours.color,
            },
        },
        scales: {
            xAxes: [{
                gridLines: {
                    borderColor: colours.color,
                    tickMarkLength: 15,
                    color: colours.backLift,
                },
                ticks: {
                    color: "#f0f",
                    padding: 100,
                    fontColor: colours.color,
                },
                scaleLabel: {
                    display: !!xLabel,
                    labelString: xLabel,
                },
            }],
            yAxes: [{
                gridLines: {
                    borderColor: colours.color,
                    drawTicks: false,
                    color: colours.backLift,
                },
                ticks: {
                    fontColor: colours.color,
                    padding: 8,
                },
                scaleLabel: {
                    display: !!yLabel,
                    labelString: yLabel,
                },
            }],
        },
        maintainAspectRatio: false,
    };

    if (timeGraph)
        options.scales.xAxes[0].type = "time";
    if (noAnimate)
        options.animation = { duration: 0 };

    data.forEach((i, n) => {
        if (!("lineTension" in i)) i.lineTension = 0;
        if (!("pointHitRadius" in i)) i.pointHitRadius = 20;

        const colour = palette[n % palette.length];
        if (!("borderColor" in i)) i.borderColor = colour;
        if (!("pointBackgroundColor" in i)) i.pointBackgroundColor = colour;
        if (!("pointBorderColor" in i)) i.pointBorderColor = colour;
        if (!("backgroundColor" in i)) i.backgroundColor = filled ? transparentize(.8, colour) : colour;
        if (!("fill" in i)) i.fill = filled ? "zero" : false;
    });

    return <Scatter data={{ datasets: data }} options={options} />;
});
export default Graph;
