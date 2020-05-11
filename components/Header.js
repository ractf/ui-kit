import React from "react";

import { Link } from "@ractf/ui-kit";

import Wordmark from "../../../../components/Wordmark";

import "./Header.scss";


export default React.memo(() => <>
    <div id={"headerPad"} />
    <header>
        <Link to="/">
            <Wordmark />
        </Link>
    </header>
</>);
