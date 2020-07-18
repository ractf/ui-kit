import React, { useRef, useEffect } from "react";

import { makeClass } from "@ractf/util";

import style from "./Scrollbar.module.scss";

import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";


const Scrollbar = ({ children, height, primary, className }) => {
    const ref = useRef();
    useEffect(() => {
        const reCalc = () => ref.current.recalculate();
        window.addEventListener("resize", reCalc);
        return () => window.removeEventListener("resize", reCalc);
    });
    
    return <SimpleBar className={makeClass(primary && style.primary, className)}
        style={{ height: height || "100%" }} ref={ref}>
        {children}
    </SimpleBar>;
};

export default React.memo(Scrollbar);
