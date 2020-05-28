import React, { Component } from "react";

import { makeClass } from "@ractf/util";

import style from "./Radio.module.scss";

//import { fastClick } from "ractf";


export default class Radio extends Component {
    isInput = true;

    constructor(props) {
        super(props);

        this.state = {
            val: this.props.value !== undefined ? this.props.value : "",
        };
        this.ids = this.props.options.map(() => Math.random().toString().substring(2, 9999));
    }

    okd(e) {
        if (e.keyCode === 13 || e.keyCode === 32) {
            e.target.click();
        }
    }

    change = value => {
        if (value !== this.state.val) {
            this.setState({ val: value });
            if (this.props.onChange)
                this.props.onChange(value);
        }
    }

    render() {
        return <div className={style.radioWrap}>
            {this.props.options.map((i, n) => <div key={n}>
                <div onClick={e => this.change(i[1])} /*{...fastClick}*/
                    onKeyDown={this.okd} tabIndex="0"
                    className={makeClass(style.radioLabel, (i[1] === this.state.val) && style.checked)}
                    htmlFor={this.ids[n]}>
                    <div className={style.radioButton} />
                    <div className={style.radioLab}>{i[0]}</div>
                </div>
            </div>)}
        </div>;
    }
}
