import React, { useState } from "react";

import style from "./Table.module.scss";


const Table = ({ sorter, headings, data, noSort, onHeaderClick }) => {
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
                    <th key={n} onClick={onHeaderClick ? () => {onHeaderClick(i); } : (noSort || toggleSort(n))}
                    className={noSort ? "" : style.sortable}>
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
                        <td key={m}>{(typeof j === "string" || typeof j === "number") ? <span>{j}</span> : j}</td>
                    ))}
                </tr>;
            })}
        </tbody>
    </table></div>;
};
export default React.memo(Table);
