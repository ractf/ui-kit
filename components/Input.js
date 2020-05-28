import React, { Component, createRef } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { makeClass } from "@ractf/util";
import { Button } from "@ractf/ui-kit";

import style from "./Input.module.scss";


export const InputHint = ({ children }) => (
    <div className={style.inputHint}>{ children }</div>
);

export class InputGroup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            val: props.val || "",
        };
    }

    onChange = (val) => {
        this.setState({ val: val });
        if (this.props.onChange) this.props.onChange(val);
    };

    render() {
        return <div className={makeClass(style.inputGroup, this.props.className)}>
            { this.props.left }
            <Input {...this.props} className={style.igInput} onChange={this.onChange} val={this.state.val} />
            { this.props.right }
        </div>;
    }
}


export class InputButton extends Component {
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
        return <InputGroup {...this.props} right={
            <Button large ref={this.button} click={this.onSubmit} disabled={this.props.disabled}>
                {this.props.button || "Submit"}
            </Button>  
        } onSubmit={this.onSubmit} onChange={this.onChange} val={this.state.val} />;
    }
}


export class Input extends Component {
    isInput = true;

    constructor(props) {
        super(props);

        this.state = {
            val: props.val || "",
            valid: true,
            showPass: false,
            rows: props.rows,
        };
        if (props.rows && props.val)
            this.state.rows = Math.max(props.rows, props.val.split("\n").length);

        this.handleChange = this.handleChange.bind(this);
        this.inputRef = createRef();

        this.isInput = true;
    }

    handleChange(event) {
        let value = event.target.value;
        // Length limit
        if (this.props.limit)
            value = value.substring(0, this.props.limit);
        // Regex testing
        let valid;
        if (this.props.format) {
            valid = this.props.format.test(value);
            this.setState({ valid: valid });
        } else valid = true;

        let rows = 0;
        if (this.props.rows)
            rows = Math.max(this.props.rows, value.split("\n").length);
        this.setState({ val: value, rows: rows });
        if (this.props.onChange)
            this.props.onChange(value, valid);
    }

    togglePwd = () => {
        this.setState({ showPass: !this.state.showPass });
    }

    keyDown = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            if (this.props.onSubmit)
               this.props.onSubmit(this.state.val);
            if (this.props.next && this.props.next.current)
                this.props.next.current.click();
        }
    }

    click = () => {
        this.inputRef.current.focus();
    }

    render() {
        const inputClass = makeClass(
            style.inputWrapper, this.props.className,
            this.props.center && style.center,
            this.props.password && style.password,
            this.props.disabled && style.disabled,
            this.props.hidden && style.hidden,
            this.props.slim && style.slim,
            (!(this.state.val.length === 0 || this.state.valid)) && style.invalid,
        );

        return <div className={inputClass}>
            {this.props.rows ?
                <textarea
                    ref={this.inputRef}
                    value={this.state.val}
                    onChange={this.handleChange}
                    rows={this.state.rows}
                    autofill={this.props.autofill}
                    className={makeClass(style.textarea, this.props.monospace && style.monospaced)}
                    disabled={this.props.disabled} />
                : <input
                    onKeyDown={this.keyDown}
                    ref={this.inputRef}
                    value={this.state.val}
                    type={
                        (this.props.password && !this.state.showPass) ? "password" : "text"
                    }
                    onChange={this.handleChange}
                    autofill={this.props.autofill}
                    className={makeClass(style.input, this.props.monospace && style.monospaced)}
                    disabled={this.props.disabled} />}
            {this.props.center || this.props.noCount ? null
                : <div className={style.lengthCounter}>{this.state.val.length}{this.props.limit
                    ? "/" + this.props.limit
                    : ""
                }</div>}
            {this.props.password ? <div className={style.styledEye} onClick={this.togglePwd}>
                {this.state.showPass ? <FaEyeSlash /> : <FaEye />}
            </div> : null}
            {this.props.zxcvbn &&
                <div className={style.inputStrength}
                        data-val={this.state.val.length ? this.props.zxcvbn(this.state.val).score + 1 : 0} />}
            {this.props.placeholder && this.state.val.length === 0 &&
                <div className={makeClass(style.placeholder, this.props.monospace && style.monospaced)}>
                    <span>{this.props.placeholder}</span></div>}
        </div>;
    }
}
