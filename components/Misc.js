// Copyright (C) 2020-2021 Really Awesome Technology Ltd
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

import React from "react";

import { makeClass, basicComponent } from "@ractf/util";
import { Row } from "@ractf/ui-kit";

import style from "./Misc.module.scss";
import { Column } from "./layout/Layout";


export const TextBlock = React.memo(({ children, className, ...props }) => (
    <div {...props} className={makeClass(style.textBlock, className)}>{children}</div>
));
TextBlock.displayName = "TextBlock";

export const FormGroup = React.memo(({ children, label, htmlFor }) => (
    <div className={style.formGroup}>
        <label htmlFor={htmlFor}>{label}</label>
        {children}
    </div>
));
FormGroup.displayName = "FormGroup";

export const SubtleText = React.memo(({ children, ...props }) => (
    <div className={style.subtleText} {...props}>{children}</div>
));
SubtleText.displayName = "SubtleText";
export const PageHead = React.memo(({ title, subTitle, back, children, tags }) => (
    <Column className={style.pageHead}>
        <Row tight left>
            <div className={style.pageTitle}>{title || children}</div>
            { tags }
        </Row>
        {back}
        {subTitle && <p>{subTitle}</p>}
    </Column>
));
PageHead.displayName = "PageHead";

export const HiddenInput = () => null;

export const HR = basicComponent(style.hr, "HR");
export const H1 = basicComponent(style.h1, "H1", "h1");
export const H2 = basicComponent(style.h2, "H2", "h2");
export const H3 = basicComponent(style.h3, "H3", "h3");
export const H4 = basicComponent(style.h4, "H4", "h4");
export const H5 = basicComponent(style.h5, "H5", "h5");
export const H6 = basicComponent(style.h6, "H6", "h6");
export const Large = basicComponent(style.large, "Large", "p");
export const SiteWrap = basicComponent(style.siteWrap, "SiteWrap");
export const Wordmark = basicComponent(style.wordmark, "Wordmark");
export const Container = basicComponent(style.container, "Container");

export const Spinner = () => <div className={style.loadingSpinner}/>;
export const ModalSpinner = () => <div className={style.modalSpinner}><Spinner /></div>;
