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

import React, { useState, useEffect, useCallback, useRef, useContext } from "react";

import { UiKitContext, Button, Scrollbar, Form, Select, Input, ProgressBar } from "@ractf/ui-kit";
import { makeClass, propsToTypeClass } from "@ractf/util";

import style from "./Modal.module.scss";


const Modal = ({
    header = null, cancel = true, okay = true, buttons = null,
    onClose, onConfirm, show, noHide, children, ...props
}) => {
    const { t } = useContext(UiKitContext);
    const [display, setDisplay] = useState(((typeof show) === "undefined") ? true : show);
    const baseRef = useRef();
    useEffect(() => {
        if ((typeof show) !== "undefined")
            setDisplay(show);
        else
            setDisplay(true);
    }, [show]);

    const backClick = useCallback((e) => {
        if (e.target !== baseRef.current) return;
        if (noHide) return;

        if (onClose) onClose(true);
        setDisplay(false);
    }, [onClose, noHide]);
    const cancelClick = useCallback(() => {
        if (onClose) onClose();
        setDisplay(false);
    }, [onClose]);
    const mainClick = useCallback((e) => {
        // e.preventDefault();
        // e.stopPropagation();
    }, []);
    const okayClick = useCallback((e) => {
        if (onConfirm) onConfirm();
        else setDisplay(false);
    }, [onConfirm]);

    const hasButtons = cancel || okay || buttons;

    if (!display) return null;

    return <div className={style.modalWrap} onMouseDown={backClick} ref={baseRef}>
        <div className={makeClass(style.modal, propsToTypeClass(props, style))} onClick={mainClick}>
            {header && (
                <div className={style.header}>{header}</div>
            )}
            <div className={style.content}>
                {props.fullHeight ? <Scrollbar>{children}</Scrollbar> : children}
            </div>
            {hasButtons && (
                <div className={style.actions}>
                    {buttons}
                    {cancel && (
                        <Button onClick={cancelClick} lesser>
                            {((typeof cancel) === "string") ? cancel : t("cancel")}
                        </Button>
                    )}
                    {okay && (
                        <Button onClick={okayClick}>
                            {((typeof okay) === "string") ? okay : t("okay")}
                        </Button>
                    )}
                </div>
            )}
        </div>
    </div>;
};
export default React.memo(Modal);

export const ModalPrompt = React.memo(({ body, promise, onHide, inputs }) => {
    const { t } = useContext(UiKitContext);
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
                    promise.reject(true); onHide && onHide();
                });
            }}>Remove</Button>
            <div style={{ flexGrow: 1 }} />
        </>}
        {!body.noCancel &&
            <Button onClick={() => { promise.reject(true); onHide && onHide(); }} lesser>
                {body.cancel || t("cancel")}
            </Button>}
        <Button onClick={doSubmit}>{body.okay || t("okay")}</Button>
    </>);

    return <Modal onClose={() => { promise.reject(false); onHide && onHide(); }}
        okay={false} cancel={false} buttons={buttons}
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
                    if (i.Component) parts.push(
                        <i.Component key={n} {...i} />
                    );
                    else if (i.options) parts.push(
                        <Select key={n} {...i} />
                    );
                    else parts.push(
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

export const UiKitModals = React.createContext({
    alert: () => () => { new Promise(); },
    promptConfirm: () => { new Promise(); },
    showProgress: () => { new Promise(); },
});
export const ModalMount = ({ children }) => {
    const [modals, setModals] = useState([]);
    const progressModal = useRef();

    const closeModal = useCallback((modal) => {
        setModals(old => old.filter(i => i !== modal));
    }, []);

    const promptConfirm = useCallback((body, inputs = 0) => {
        if (inputs === 0) inputs = [];
        if (!body.message) body = { message: body, small: true };

        return new Promise((resolveOuter, rejectOuter) => {
            let modal;

            const innerPromise = new Promise((resolve, reject) => {
                modal = {
                    isProgress: false,
                    body: body,
                    promise: { resolve: resolve, reject: reject },
                    inputs: inputs,
                    _id: Math.random()
                };
                setModals(old => [...old, modal]);
            });

            innerPromise.then(values => {
                closeModal(modal);
                resolveOuter(values);
            }).catch(values => {
                closeModal(modal);
                rejectOuter(values);
            });
        });
    }, [closeModal]);
    const showProgress = useCallback((text, progress) => {
        if (progressModal.current) {
            closeModal(progressModal.current);
            progressModal.current = null;
        }
        if (text) {
            const modal = {
                isProgress: true, text: text, progress: progress,
                _id: Math.random()
            };
            setModals(old => [...old, modal]);
            progressModal.current = modal;
        }
    }, [closeModal]);
    const alert = useCallback((message) => {
        return promptConfirm({ message: message, noCancel: true, small: true }).catch(() => {});
    }, [promptConfirm]);

    return <UiKitModals.Provider value={{ alert, promptConfirm, showProgress }}>
        {children}
        {modals.map(i => {
            if (i.isProgress) {
                return <Modal small cancel={false} okay={false} header={"Progress"}
                    noHide progressModal key={i._id}>
                    <p>{i.text}</p>
                    <ProgressBar progress={i.progress} />
                </Modal>;
            }
            return <ModalPrompt
                key={i._id}
                body={i.body}
                promise={i.promise}
                inputs={i.inputs}
            />;
        })}
    </UiKitModals.Provider>;
};
