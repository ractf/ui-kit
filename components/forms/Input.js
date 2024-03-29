// Copyright (C) 2020-2021 Really Awesome Technology Ltd
//
// This file is part of RACTF.
//
// RACTF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// RACTF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with RACTF.  If not, see <https://www.gnu.org/licenses/>.

import React, { PureComponent, createRef, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { makeClass } from "@ractf/util";
import { Button, Badge } from "@ractf/ui-kit";

import withRactfForm from "./ractfFormHoc.js";
import "react-datepicker/dist/react-datepicker.css";
import style from "./Input.module.scss";


export const DatePick = ({ initial, configSet, name, configKey }) => {
    const [value, setValue] = useState(initial * 1000);

    const onChange = value => {
        setValue(value);
        configSet(configKey, value.getTime() / 1000);
    };

    return <div>
        <DatePicker showTimeSelect
            dateFormat="yyyy-MM-dd H:mm"
            autoComplete="off"
            selected={value}
            onChange={onChange}
            style={{ zIndex: 50 }}
            wrapperClassName={style.inputWrapper}
            className={style.input}
            name={name}
        />
    </div>;
};

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
        <Button ref={button} onClick={props.onSubmit} disabled={disabled}>
            {props.button || "Submit"}
        </Button>
    } managed />;
};

export const InputTags = ({ disabled, val, limit, onChange, className }) => {
    const [newTag, setNewTag] = useState("");
    val = val || [];

    const limitFilter = (limit || []).filter(i => val.indexOf(i) === -1);
    const suggestions = limitFilter.filter(i => i.toLowerCase().indexOf(newTag.toLowerCase()) !== -1);
    const hasSuggestions = suggestions.length > 0;
    const valid = !limit || hasSuggestions || !newTag;

    const onKeyDown = (e) => {
        if (disabled)
            return e.preventDefault();

        if (e.keyCode === 13 || e.keyCode === 188) {
            e.preventDefault();
            const toInsert = limit ? suggestions[0] : newTag;
            if (valid && toInsert) {
                onChange([...val, toInsert]);
                setNewTag("");
            }
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
    const addTag = (tag) => {
        onChange([...val, tag]);
        setNewTag("");
    };
    const remove = (index) => {
        return () => {
            const newTags = [...val];
            newTags.splice(index, 1);
            onChange(newTags);
        };
    };

    return <div className={makeClass(
        style.inputTags, !valid && style.invalid,
        hasSuggestions && style.hasSuggestions, disabled && style.disabled,
        className
    )}>
        {val.map((i, n) => <Badge key={n + i} onClose={remove(n)} x>{i}</Badge>)}
        <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={onKeyDown} />

        {hasSuggestions && (<div className={style.tagsDropdown}>
            {suggestions.map(
                i => <div key={i} onMouseDown={() => addTag(i)}>{i}</div>
            )}
        </div>)}
    </div>;
};

const InputPin_ = ({ digits = 6, value = "", onChange, onSubmit, className }) => {
    const [current, setCurrent] = useState(0);

    const localOnChange = (n, val) => {
        if (onChange)
            onChange([
                ...value.slice(0, n),
                val.slice(val.length - 1, val.length),  // Last character
                "",  // Clear next character
                ...value.slice(n + 2, value.length)
            ].join(""));
        if (val.length !== 0)
            setCurrent(Math.min(digits - 1, n + 1));
        if (n === digits - 1 && onSubmit)
            onSubmit(value);
    };
    const onKeyDown = (n, e, val) => {
        if (e.keyCode === 8 && !val.length)
            setCurrent(Math.max(0, n - 1));
    };
    const onFocus = (n) => {
        if (onChange)
            onChange([
                ...value.slice(0, n),
                "",
                ...value.slice(n + 1, value.length)
            ].join(""));
    };
    const onPaste = (e) => {
        const clipboardData = e.clipboardData || window.clipboardData;
        const text = clipboardData.getData("Text");
        if (text && text.length) {
            if (onChange)
                onChange(text.slice(0, digits));
            setCurrent(Math.min(digits - 1, text.length));

            if (text.length <= digits && onSubmit)
                onSubmit(text.slice(0, digits));
        }
    };

    return <div>
        {(new Array(digits).fill(null)).map((_, n) => (
            <RawInput key={n}
                autoFocus={current === n}
                className={makeClass(style.inputPin, className)}
                onKeyDown={onKeyDown.bind(null, n)}
                onChange={localOnChange.bind(null, n)}
                onFocus={onFocus.bind(null, n)}
                onPaste={onPaste}
                val={value[n] || ""} />
        ))}
    </div>;
};
export const InputPin = withRactfForm(InputPin_);

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
        if (this.props.onKeyDown)
            this.props.onKeyDown(e, this.props.val);
    }

    click = (e) => {
        e.preventDefault();
        e.stopPropagation();
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.autoFocus && this.props.autoFocus)
            this.inputRef.current.focus();
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

        return <>
            <div className={inputClass} onClick={this.click}>
                {this.props.rows ?
                    <textarea
                        onKeyDown={this.keyDown}
                        ref={this.inputRef}
                        name={this.props.name}
                        value={this.props.val}
                        onChange={this.handleChange}
                        rows={this.state.rows}
                        autofill={this.props.autofill}
                        className={makeClass(style.textarea, this.props.monospace && style.monospaced)}
                        autoFocus={this.props.autoFocus}
                        onFocus={this.props.onFocus}
                        onPaste={this.props.onPaste}
                        disabled={this.props.disabled || this.props.readonly} />
                    : <input
                        onKeyDown={this.keyDown}
                        ref={this.inputRef}
                        name={this.props.name}
                        value={this.props.val}
                        type={
                            (this.props.password && !this.state.showPass) ? "password" : "text"
                        }
                        onChange={this.handleChange}
                        autofill={this.props.autofill}
                        className={makeClass(style.input, this.props.monospace && style.monospaced)}
                        autoFocus={this.props.autoFocus}
                        onFocus={this.props.onFocus}
                        onPaste={this.props.onPaste}
                        disabled={this.props.disabled || this.props.readonly} />}
                {this.props.limit && (
                    <div className={style.lengthCounter}>{this.props.val?.length}/{this.props.limit}</div>
                )}
                {this.props.password ? <div className={style.styledEye} onClick={this.togglePwd}>
                    {this.state.showPass ? <FiEyeOff /> : <FiEye />}
                </div> : null}
                {this.props.placeholder && (!this.props.val || this.props.val.length === 0) &&
                    <div className={makeClass(style.placeholder, this.props.monospace && style.monospaced)}>
                        <span>{this.props.placeholder}</span></div>}
            </div>
            {this.props.zxcvbn && (
                <div className={style.strength}
                    data-val={(this.props.val && this.props.val.length)
                        ? this.props.zxcvbn(this.props.val).score + 1 : 0}>
                    <div /><div /><div /><div /><div />
                </div>
            )}
        </>;
    }
}
export const Input = withRactfForm(RawInput);
