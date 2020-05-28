import React, { Component } from "react";

import { makeClass } from "@ractf/util";
import { Input, Button } from "@ractf/ui-kit";

import style from "./InputButton.module.scss";


export default class InputButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            val: props.val || "",
        };
        this.button = React.createRef();
    }

    onChange = (val) => {
        this.setState({ val: val });
    };

    onSubmit = () => {
        if (this.props.click)
            this.props.click();
    }

    render() {
        return <div className={makeClass(style.inlineButton, this.props.className)}>
            <Input {...this.props} onSubmit={this.onSubmit} onChange={this.onChange} val={this.state.val}
                className={style.input} />
            <Button large ref={this.button} click={this.onSubmit} disabled={this.props.disabled} className={style.btn}>
                {this.props.button || "Submit"}
            </Button>
        </div>;
    }
}
