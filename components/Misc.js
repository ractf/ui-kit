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
import { Container } from "@ractf/ui-kit";

import style from "./Misc.module.scss";


export const TextBlock = React.memo(({ children, className, ...props }) => (
    <div {...props} className={makeClass(style.textBlock, className)}>{children}</div>
));
TextBlock.displayName = "TextBlock";

export const SubtleText = React.memo(({ children, ...props }) => (
    <div className={style.subtleText} {...props}>{children}</div>
));
SubtleText.displayName = "SubtleText";
export const PageHead = React.memo(({ title, subTitle, back, children, tags }) => (
    <Container className={style.pageHead} full>
        <Container toolbar full>
            <div className={style.pageTitle}>{title || children}</div>
            {tags}
        </Container>
        {back}
        {subTitle && <p>{subTitle}</p>}
    </Container>
));
PageHead.displayName = "PageHead";

export const HiddenInput = () => null;

export const HR = basicComponent(style.hr, "HR");
export const Large = basicComponent(style.large, "Large", "p");
export const SiteWrap = basicComponent(style.siteWrap, "SiteWrap");
export const Wordmark = basicComponent(style.wordmark, "Wordmark");

export const Spinner = () => <div className={style.loadingSpinner}/>;
export const ModalSpinner = () => <div className={style.modalSpinner}><Spinner /></div>;
