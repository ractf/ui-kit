import React, { PureComponent, createRef, useRef } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { makeClass } from "@ractf/util";
import { Button } from "@ractf/ui-kit";

import withRactfForm from "./ractfFormHoc.js";

import style from "./Input.module.scss";


export const InputHint = ({ children, disabled }) => (
    <div className={makeClass(style.inputHint, disabled && style.disabled)}>{children}</div>
);

export const InputGroup = withRactfForm(({ className, error, left, right, ...props }) => {
    return <div className={makeClass(style.inputGroup, props.disabled && style.disabled, className)}>
        {left}
        <RawInput {...props} error={!!error} className={style.igInput} />
        {right}
    </div>;
});

export const InputButton = ({ btnDisabled, ...props }) => {
    const button = useRef();

    return <InputGroup {...props} right={
        <Button large ref={button} onClick={props.onSubmit} disabled={btnDisabled || props.disabled}>
            {props.button || "Submit"}
        </Button>
    } managed />;
};


export class RawInput extends PureComponent {
    isInput = true;

    constructor(props) {
        super(props);

        this.state = {
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
                this.props.onSubmit(this.props.val);
        }
    }

    click = (e) => {
        e.preventDefault();
        e.stopPropagation();
    }

    render() {
        const inputClass = makeClass(
            style.inputWrapper, this.props.className,
            this.props.center && style.center,
            this.props.readonly && style.readonly,
            this.props.password && style.password,
            this.props.disabled && style.disabled,
            this.props.hidden && style.hidden,
            ((!(!this.props.val || this.props.val.length === 0 || this.state.valid) || this.props.error)
                && style.invalid),
        );

        return <div className={inputClass} onClick={this.click}>
            {this.props.rows ?
                <textarea
                    ref={this.inputRef}
                    value={this.props.val}
                    onChange={this.handleChange}
                    rows={this.state.rows}
                    autofill={this.props.autofill}
                    className={makeClass(style.textarea, this.props.monospace && style.monospaced)}
                    autoFocus={this.props.autoFocus}
                    disabled={this.props.disabled || this.props.readonly} />
                : <input
                    onKeyDown={this.keyDown}
                    ref={this.inputRef}
                    value={this.props.val}
                    type={
                        (this.props.password && !this.state.showPass) ? "password" : "text"
                    }
                    onChange={this.handleChange}
                    autofill={this.props.autofill}
                    className={makeClass(style.input, this.props.monospace && style.monospaced)}
                    autoFocus={this.props.autoFocus}
                    disabled={this.props.disabled || this.props.readonly} />}
            {this.props.limit && (
                <div className={style.lengthCounter}>{this.props.val?.length}/{this.props.limit}</div>
            )}
            {this.props.password ? <div className={style.styledEye} onClick={this.togglePwd}>
                {this.state.showPass ? <FaEyeSlash /> : <FaEye />}
            </div> : null}
            {this.props.zxcvbn &&
                <div className={style.inputStrength}
                    data-val={(this.props.val && this.props.val.length)
                        ? this.props.zxcvbn(this.props.val).score + 1 : 0} />}
            {this.props.placeholder && (!this.props.val || this.props.val.length === 0) &&
                <div className={makeClass(style.placeholder, this.props.monospace && style.monospaced)}>
                    <span>{this.props.placeholder}</span></div>}
        </div>;
    }
}
export const Input = withRactfForm(RawInput);
