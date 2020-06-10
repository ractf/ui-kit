import React, { useState } from "react";

import { Link } from "@ractf/ui-kit";

import style from "./Table.module.scss";


export default ({ sorter, headings, data, noSort }) => {
    const [sortMode, setSortMode] = useState(null);
    let sorterFunc;
    if (!noSort)
        sorterFunc = sorter || ((i, j) => (
            j === null ? i :
                i.sort((a, b) => (
                    a === b ? 0 :
                        (j[1] ? a[j[0]] < b[j[0]] : a[j[0]] > b[j[0]]) * 2 - 1
                ))
        ));
    else sorterFunc = x => x;

    const toggleSort = n => {
        return e => {
            e.preventDefault();
            if (sortMode !== null && sortMode[0] === n)
                setSortMode([n, !sortMode[1]]);
            else
                setSortMode([n, true]);
        };
    };

    return <div className={style.tableWrap}><table>
        <thead>
            <tr className={style.heading}>
                {headings.map((i, n) => (
                    <th key={n} onClick={noSort || toggleSort(n)} className={noSort ? "" : style.sortable}>
                        <span>{i}</span>
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            {sorterFunc(data, sortMode).map((i, n) => {
                const meta = i[headings.length] || {};

                return <tr key={n} className={style[meta.type] || ""}>
                    {i.slice(0, headings.length).map((j, m) => (
                        <td key={m}>
                            {meta.link ? <Link to={meta.link}>{j}</Link> : <span>{j}</span>}
                        </td>
                    ))}
                </tr>;
            })}
        </tbody>
    </table></div>;
};
