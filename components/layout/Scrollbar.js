import React from "react";

import { makeClass } from "@ractf/util";

import style from "./Scrollbar.module.scss";

import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";


const Scrollbar = ({ children, height, primary, className }) => (
    <SimpleBar className={makeClass(primary && style.primary, className)}
        style={{ height: height || "100%" }}>
        {children}
    </SimpleBar>
);

export default React.memo(Scrollbar);
