import React from "react";


export default {
    title: "Typography",
    controls: {
        text: {
            name: "Preview text",
            control: "text"
        }
    }
};

export const Code = ({ text }) => <>Text <code>{ text }</code> text</>;
Code.args = { text: "Inline code" };
export const H1 = ({ text }) => <h1>{ text }</h1>;
H1.args = { text: "H1 Heading" };
export const H2 = ({ text }) => <h2>{ text }</h2>;
H2.args = { text: "H2 Heading" };
export const H3 = ({ text }) => <h3>{ text }</h3>;
H3.args = { text: "H3 Heading" };
export const H4 = ({ text }) => <h4>{ text }</h4>;
H4.args = { text: "H4 Heading" };
export const H5 = ({ text }) => <h5>{ text }</h5>;
H5.args = { text: "H5 Heading" };
export const H6 = ({ text }) => <h6>{ text }</h6>;
H6.args = { text: "H6 Heading" };
