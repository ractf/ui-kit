import React, { PureComponent, createRef, useRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { makeClass } from "@ractf/util";
import { Button } from "@ractf/ui-kit";

import withRactfForm from "./ractfFormHoc.js";

import style from "./Input.module.scss";
import Badge from "../widgets/Badge.js";


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
    const disabled = btnDisabled || props.disabled;

    return <InputGroup {...props} onSubmit={!disabled && props.onSubmit} right={
        <Button large ref={button} onClick={props.onSubmit} disabled={disabled}>
            {props.button || "Submit"}
        </Button>
    } managed />;
};

export const InputTags = ({ disabled, val, onChange }) => {
    const [newTag, setNewTag] = useState("");
    val = val || [];

    const onKeyDown = (e) => {
        if (disabled)
            return e.preventDefault();

        if (e.keyCode === 13 || e.keyCode === 188) {
            e.preventDefault();
            onChange([...val, newTag]);
            setNewTag("");
        } else if (e.keyCode === 32) {
            if (newTag.length === 0)
                e.preventDefault();
        } else if (e.keyCode === 8) {
            if (newTag.length === 0) {
                e.preventDefault();
                if (val.length) {
                    setNewTag(val[val.length - 1]);
                    const newTags = [...val];
                    newTags.pop();
                    onChange(newTags);
                }
            }
        }
    };
    const remove = (index) => {
        return () => {
            const newTags = [...val];
            newTags.splice(index, 1);
            onChange(newTags);
        };
    };

    return <div className={makeClass(style.inputTags, disabled && style.disabled)}>
        {val.map((i, n) => <Badge key={n + i} onClose={remove(n)} x>{i}</Badge>)}
        <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={onKeyDown} />
    </div>;
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

    handleChange(event, value) {
        value = value || event.target.value;
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

    insertString = (string) => {
        const elem = this.inputRef.current;
        const s = elem.selectionStart;
        elem.value = (
            elem.value.substring(0, elem.selectionStart) + string + elem.value.substring(elem.selectionEnd)
        );
        elem.selectionEnd = s + string.length;
        this.handleChange({ target: elem }, elem.value);
    }

    currentLine = () => {
        if (!this.props.rows)
            return this.state.val;

        const elem = this.inputRef.current;
        const lines = elem.value.substring(0, elem.selectionStart).split("\n");
        return lines[lines.length - 1];
    }

    getSelectedLines = () => {
        const elem = this.inputRef.current;
        const lines = [];
        let line = 0;
        const start = elem.selectionStart;
        const end = elem.selectionEnd;

        for (const [i, n] of [...elem.value].map((i, n) => [i, n])) {
            if (n > end) {
                return lines;
            } else if (n >= start) {
                if (lines.indexOf(line) === -1) {
                    lines.push(line);
                }
            }
            if (i === "\n") line++;
        }
        return lines;
    }

    tabUnindent = () => {
        const elem = this.inputRef.current;

        const selectedLines = this.getSelectedLines();
        const text = elem.value.split("\n");
        for (const i of selectedLines) {
            const match = /^([\t ]{0,4})/.exec(text[i])[0];
            text[i] = text[i].replace(/^([\t ]{0,4})/, "");
        }
        let newStart = 0, newEnd = -1;
        for (const n in text) {
            if (n < selectedLines[0]) newStart += text[n].length + 1;
            if (n <= selectedLines[selectedLines.length - 1]) newEnd += text[n].length + 1;
        }

        elem.value = text.join("\n");
        this.handleChange({ target: elem }, elem.value);
        elem.setSelectionRange(newStart, newEnd);
    }

    tabIndent = () => {
        const elem = this.inputRef.current;
        if (elem.selectionStart === elem.selectionEnd)
            return this.insertString("    ");

        const selectedLines = this.getSelectedLines();
        const text = elem.value.split("\n");
        for (const i of selectedLines) {
            text[i] = "    " + text[i];
        }
        let newStart = 0, newEnd = -1;
        for (const n in text) {
            if (n < selectedLines[0]) newStart += text[n].length + 1;
            if (n <= selectedLines[selectedLines.length - 1]) newEnd += text[n].length + 1;
        }

        elem.value = text.join("\n");
        this.handleChange({ target: elem }, elem.value);
        elem.setSelectionRange(newStart, newEnd);
    }

    keyDown = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            if (this.props.rows) {
                const line = this.currentLine();
                this.insertString("\n" + /^([ \t]*)/.exec(line)[0]);
            } else if (this.props.onSubmit)
                this.props.onSubmit(this.props.val);
        } else if (e.keyCode === 9 && this.props.monospace) {
            e.preventDefault();
            if (e.shiftKey)
                this.tabUnindent();
            else
                this.tabIndent();
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
                    onKeyDown={this.keyDown}
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
