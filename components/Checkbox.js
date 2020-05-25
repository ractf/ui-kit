import React, { Component } from "react";

import style from "./Checkbox.module.scss";

export default class Checkbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            val: !!props.checked
        };
    }

    click = () => {
        this.setState({ val: !this.state.val });
    };

    render() {
        return <div className={style.checkbox + (this.state.val ? " " + style.checked : "")} onClick={this.click}>
            <div className={style.box} />
            <div className={style.cbLabel}>{this.props.children}</div>
        </div>;
    }
}
