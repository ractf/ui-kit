import React, { Component } from "react";

import { makeClass } from "@ractf/util";
import { Button, Row } from "@ractf/ui-kit";

import style from "./ToggleButton.module.scss";


export default class SwitchButton extends Component {
    constructor(props) {
        super(props);

        let initial = 0;
        if (typeof this.props.default !== "undefined") {
            this.props.options.forEach(([opt, val], n) => {
                if (val === this.props.default) {
                    initial = n;
                }
            });
        }
        this.state = {
            active: initial,
        };
    }

    makeActive(n) {
        return () => {
            this.setState({ active: n });

            if (this.props.onChange) {
                this.props.onChange(this.props.options[n][1]);
            }
        };
    }

    render() {
        const buttons = [];
        this.props.options.map((val) =>
            buttons.push(<Button
                tiny={this.props.small} large={this.props.large} key={val[1]}
                pill={this.props.pill}
                className={makeClass(style.btn, this.props.small && style.small,
                    this.props.large && style.large)}
                onClick={this.makeActive(buttons.length)}
                lesser={this.state.active !== buttons.length}
            >{val[0]}</Button>)
        );

        return <Row left className={style.switchButtonWrap}>
            {buttons}
        </Row>;
    }
}
