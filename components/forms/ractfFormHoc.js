import React from "react";

import style from "./ractfFormHoc.module.scss";

const withRactfForm = BaseComponent => ({ error, ...props }) => {
    if (!props.__ractf_managed) throw Error("Form element must be managed by a form!");
    if (!props.name) console.warn("Component missing name");

    const inner = <BaseComponent error={error} {...props} />;

    const hasError = (error && (typeof error === "string" || Array.isArray(error)));

    const WrappedForm = <div className={style.inputErrorWrap}>
        {inner}
        {hasError && Array.isArray(error) ? error.map((i, n) => (
            <div key={n} className={style.inputError}>{i}</div>
        )) : <div className={style.inputError}>{error}</div>}
    </div>;
    return WrappedForm;
};
export default withRactfForm;
