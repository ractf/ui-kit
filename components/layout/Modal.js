// Copyright (C) 2020 Really Awesome Technology Ltd
//
// This file is part of RACTF.
//
// RACTF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// RACTF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with RACTF.  If not, see <https://www.gnu.org/licenses/>.

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";

import { Button, Scrollbar, Form, Select, Input } from "@ractf/ui-kit";
import { makeClass, propsToTypeClass } from "@ractf/util";

import style from "./Modal.module.scss";


const Modal = ({ header, children, show, onClose, onConfirm, noCancel, buttons, cancelLabel, okayLabel, ...props }) => {
    const [display, setDisplay] = useState(((typeof show) === "undefined") ? true : show);
    const { t } = useTranslation();
    useEffect(() => {
        if ((typeof show) !== "undefined")
            setDisplay(show);
        else
            setDisplay(true);
    }, [show]);

    const backClick = useCallback(() => {
        if (onClose) onClose(true);
        setDisplay(false);
    }, [onClose]);
    const cancelClick = useCallback(() => {
        if (onClose) onClose();
        setDisplay(false);
    }, [onClose]);
    const mainClick = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);
    const okayClick = useCallback((e) => {
        if (onConfirm) onConfirm();
        else setDisplay(false);
    }, [onConfirm]);

    if (!display) return null;
    return <div className={style.modalWrap} onClick={backClick}>
        <div className={makeClass(style.modal, propsToTypeClass(props, style))} onClick={mainClick}>
            {header && <div className={style.header}>{header}</div>}
            <div className={style.content}>
                {props.fullHeight ? <Scrollbar>{children}</Scrollbar> : children}
            </div>
            <div className={style.actions}>
                {buttons ? buttons : <>
                    {!noCancel && <Button onClick={cancelClick}>{cancelLabel || t("cancel")}</Button>}
                    <Button onClick={okayClick}>{okayLabel || t("okay")}</Button>
                </>}
            </div>
        </div>
    </div>;
};
export default React.memo(Modal);


export const ModalPrompt = React.memo(({ body, promise, onHide, inputs }) => {
    const { t } = useTranslation();
    const submit = useRef();
    const doSubmit = useCallback(() => {
        if (submit.current)
            submit.current();
        else promise.resolve();
    }, [promise]);

    const buttons = (<>
        {body.remove && <>
            <Button warning lesser onClick={() => {
                body.remove().then(() => {
                    promise.reject(); onHide && onHide();
                });
            }}>Remove</Button>
            <div style={{ flexGrow: 1 }} />
        </>}
        {!body.noCancel &&
            <Button onClick={() => { promise.reject(); onHide && onHide(); }} lesser>
                {body.cancel || t("cancel")}
            </Button>}
        <Button onClick={doSubmit}>{body.okay || t("okay")}</Button>
    </>);

    return <Modal onClose={() => { promise.reject(); onHide && onHide(); }} buttons={buttons}
        small={body.small} centre header={inputs.length ? body.message : null}>
        {inputs.length === 0 && <p>
            {body.message}
        </p>}
        {!!inputs.length && (
            <Form handle={promise.resolve} submitRef={submit}>
                {inputs.map((i, n) => {
                    const parts = [];
                    if (i.label) parts.push(
                        <label htmlFor={i.name}>{i.label}</label>
                    );
                    if (i.options) parts.push(
                        <Select key={n} {...i} />
                    ); else parts.push(
                        <Input key={n} {...i} />
                    );
                    return parts;
                })}
            </Form>
        )}
    </Modal>;
});
ModalPrompt.displayName = "ModalPrompt";

export const ModalForm = React.memo(({ children, handle, ...props }) => {
    const submitRef = useRef();
    const submit = useCallback(() => {
        submitRef.current();
    }, []);

    return <Modal {...props} onConfirm={submit}>
        <Form handle={handle} submitRef={submitRef}>
            {children}
        </Form>
    </Modal>;
});
ModalForm.displayName = "ModalForm";
