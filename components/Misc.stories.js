import React from "react";

import {
    TextBlock as UIKitTextBlock,
} from "./Misc";


export default {
    title: "Misc",
};

export const TextBlock = () => (
    <UIKitTextBlock>
        Text block
    </UIKitTextBlock>
);
TextBlock.parameters = { controls: { hideNoControlsWarning: true } };
