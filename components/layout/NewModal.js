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

import React, { useState, useEffect, useCallback } from "react";

import { makeClass, propsToTypeClass } from "@ractf/util";
import { Button, Scrollbar } from "@ractf/ui-kit";

import style from "./NewModal.module.scss";


const NewModal = ({ header, children, show, onClose, onConfirm, buttons, ...props }) => {
    const [display, setDisplay] = useState(((typeof show) === "undefined") ? true : show);
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
        setDisplay(false);
    }, [onConfirm]);

    if (!display) return;
    return <div className={style.modalWrap} onClick={backClick}>
        <div className={makeClass(style.modal, propsToTypeClass(props, style))} onClick={mainClick}>
            {header && <div className={style.header}>{header}</div>}
            <div className={style.content}>
                {props.fullHeight ? <Scrollbar>{children}</Scrollbar> : children}
            </div>
            <div className={style.actions}>
                {buttons ? buttons : <>
                    <Button click={cancelClick}>Cancel</Button>
                    <Button click={okayClick}>Okay</Button>
                </>}
            </div>
        </div>
    </div>;
};
export default React.memo(NewModal);
