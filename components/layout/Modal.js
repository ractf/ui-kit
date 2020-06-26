import React from "react";
import { useTranslation } from "react-i18next";

import { Button, Form, Input, Select, Row, Scrollbar } from "@ractf/ui-kit";

import "./Modal.scss";

import { fastClick } from "ractf";


const Modal = ({ onHide, children, centre, small }) => {
    //const app = useContext(appContext);
    const doHide = hider => {
        return e => {
            //app.setModalOpen(false);
            if (hider)
                hider(e);
        };
    };

    return <div className={"modalWrap"}>
        {!small && <style>{"@media (max-width: 930px) {body{overflow: hidden; height: 100vh;}}"}</style>}
        <div className={"darken"} onClick={doHide(onHide)} {...fastClick} />
        <div className={"modalBoxWrap"}>
            {!small && <div className={"modalX"} onClick={doHide(onHide)}>&times;</div>}
            <div className={"modalBox" + (centre ? " centre" : "") + (small ? " small" : "")}>
                {small ? children : <Scrollbar>
                    <div>
                        {children}
                    </div>
                </Scrollbar>}
            </div>
        </div>
    </div>;
};


export const ModalPrompt = ({ body, promise, onHide, inputs }) => {
    const { t } = useTranslation();
    return <Modal onHide={() => { promise.reject(); onHide && onHide(); }} small={body.small} centre>
        <p>
            {body.message}
            {inputs.length ? <br /> : null}
        </p>

        <Form handle={promise.resolve}>
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

            <Row centre>
                <Button submit>{body.okay || t("okay")}</Button>
                {!body.noCancel &&
                    <Button onClick={() => { promise.reject(); onHide && onHide(); }} lesser>
                        {body.cancel || t("cancel")}
                    </Button>}
                {body.remove &&
                    <Button warning onClick={() => {
                        body.remove().then(() => {
                            promise.reject(); onHide && onHide();
                        });
                    }}>Remove</Button>}
            </Row>
        </Form>
    </Modal>;
};


export default Modal;
