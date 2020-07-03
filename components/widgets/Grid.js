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

import React from "react";

import { makeClass } from "@ractf/util";

import style from "./Grid.module.scss";


const Grid = ({ data, headings, colPair, className }) => {
    return <table className={makeClass(style.grid, colPair && style.colPair, className)}>
        {headings && <thead>
            <tr>
            {headings.map((i, n) => <td key={n}>{i}</td>)}
            </tr>
        </thead>}
        <tbody>
            {data.map((i, n) => <tr key={n}>
                {i.map((i, n) => <td key={n}>{i}</td>)}
            </tr>)}
        </tbody>
    </table>;
};
export default React.memo(Grid);
