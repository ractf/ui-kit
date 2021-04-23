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

import React, { cloneElement, useState, useRef, useEffect, useContext, useCallback } from "react";

import { UiKitContext, Container } from "@ractf/ui-kit";
import * as http from "@ractf/util/http";

import style from "./Form.module.scss";


const setValue = (object, key, value, disableDotExpansion = false) => {
    if (disableDotExpansion) {
        object[key] = value;
        return;
    }

    const split = key.split(".");
    for (let i = 0; i < split.length - 1; i++) {
        if (typeof object[split[i]] === "undefined") {
            if (/^[0-9]+$/.test(split[i + 1]))
                object[split[i]] = [];
            else
                object[split[i]] = {};
        }
        object = object[split[i]];
    }
    object[split[split.length - 1]] = value;
};

const getValue = (object, key, disableDotExpansion = false) => {
    if (disableDotExpansion)
        return object[key];

    const index = (obj, i) => typeof obj === "undefined" ? undefined : obj[i];
    return key.split(".").reduce(index, object);
};

const different = (obj1, obj2) => {
    const object1keys = Object.keys(obj1).sort();
    const object2keys = Object.keys(obj2).sort();
    if (object1keys.length !== object2keys.length)
        return true;
    if (!object1keys.every((i, n) => i === object2keys[n]))
        return true;
    if (!object1keys.every(i => {
        if (typeof obj1[i] !== typeof obj2[i])
            return false;
        if (typeof obj1[i] === "object")
            return !different(obj1[i], obj2[i]);
        return obj1[i] === obj2[i];
    }))
        return true;
    return false;
};

const generateValues = (children, previous = {}, disableDotExpansion) => {
    const values = {};
    const getValues = (children) => {
        React.Children.toArray(children).filter(Boolean).forEach(i => {
            if (!i.props) return;

            getValues(i.props.children);
            if (i.props.name && !previous.hasOwnProperty(i.props.name)) {
                const cast = i.props.cast || (i => i);

                if (typeof i.props.value !== "undefined") {
                    setValue(values, i.props.name, i.props.value && cast(i.props.value), disableDotExpansion);
                } else if (typeof i.props.val !== "undefined") {
                    setValue(values, i.props.name, i.props.val && cast(i.props.val), disableDotExpansion);
                } else if (typeof i.props.initial !== "undefined" && typeof i.props.options !== "undefined") {
                    setValue(values, i.props.name, i.props.initial, disableDotExpansion);
                } else {
                    setValue(values, i.props.name, "", disableDotExpansion);
                }
            }
        });
    };
    getValues(children);
    return values;
};

const getErrorDetails = (e) => {
    if (!(e.response && e.response.data)) return {};
    if (typeof e.response.data.d !== "object") return {};

    return e.response.data.d;
};

const _ManagedInput = ({ C, initial, onChange, _onChange, onSubmit, _onSubmit, error, ...props }) => {
    const [value, setValue] = useState(initial);
    const [localError, setError] = useState(error);
    useEffect(() => setValue(initial), [initial]);
    useEffect(() => setError(error), [error]);
    const localOnChange = useCallback(value => {
        setValue(value);
        setError(null);
        if (onChange)
            onChange(_onChange, props.cast, props.name, value);
    }, [onChange, props.name, _onChange, props.cast]);
    const localOnSubmit = useCallback(() => {
        if (_onSubmit)
            _onSubmit();
        onSubmit();
    }, [onSubmit, _onSubmit]);
    return <C
        {...props} error={localError} onChange={localOnChange} initial={initial}
        onSubmit={localOnSubmit} value={value} val={value} managed
    />;
};
const ManagedInput = React.memo(_ManagedInput);

const ReceiveWrap = ({ C, _values, receive, ...props }) => {
    const [value, setValue] = useState(_values.current?.[receive]);
    const testVal = _values.current?.[receive];
    useEffect(() => {
        setValue(_values.current?.[receive]);
    }, [testVal, receive, setValue, _values]);
    return <C
        {...props} value={value} val={value} managed
    />;
};

const _BareForm = ({
    children, handle, action, method = "POST", headers, postSubmit, validator, onError, locked, submitRef,
    valuesRef, onChange, transformer, disableDotExpansion, multipart, onUploadProgress
}) => {
    const { t } = useContext(UiKitContext);
    const [formState, setFormState] = useState({
        error: null, errors: {}, disabled: false
    });
    const hasCustomFormError = useRef(false);
    const required = useRef({});

    const values = useRef({
        ...generateValues(children, {}, disableDotExpansion)
    });
    const lastState = useRef(values.current);

    useEffect(() => {
        values.current = {
            ...values.current,
            ...generateValues(children, values.current, disableDotExpansion)
        };
    }, [children, disableDotExpansion]);

    useEffect(() => {
        if (valuesRef)
            valuesRef.current = values.current;
        if (onChange && different(lastState.current, values.current)) {
            lastState.current = values.current;
            onChange(values.current);
        }
    }, [valuesRef, onChange]);

    const onClick = (oldClick, e) => {
        if (oldClick) oldClick(e);
        submit();
    };

    const genericValidator = useCallback((values) => {
        return new Promise((resolve, reject) => {
            const errors = {};
            Object.keys(values).forEach(i => {
                if (required.current[i] && !values[i])
                    setValue(errors, i, t("required"), disableDotExpansion);
            });
            if (Object.keys(errors).length)
                return reject(errors);
            resolve(values);
        });
    }, [disableDotExpansion, t]);
    const submit = useCallback((extraValues) => {
        setFormState(oldFormState => {
            if (oldFormState.disabled) return oldFormState;

            let formData = { ...values.current, ...extraValues };
            if (transformer)
                formData = transformer(formData);

            const performRequest = () => {
                if (!method || !action) {
                    setFormState(ofs => ({
                        ...ofs,
                        disabled: false,
                    }));
                    return;
                }

                http.makeRequest(method, action, formData, headers, {}, multipart, onUploadProgress).then(resp => {
                    setFormState(ofs => ({ ...ofs, disabled: false, errors: {}, error: null }));
                    if (postSubmit) postSubmit({ form: formData, resp: resp });
                }).catch(e => {
                    const errorStr = http.getError(e);
                    const errors = getErrorDetails(e);
                    let shouldError = true;
                    if (onError)
                        if (onError({
                            error: e,
                            str: errorStr,
                            form: formData,
                            resp: e.response?.data?.d,
                            retry: submit,
                            showError: error => setFormState(ofs => ({ ...ofs, error: error })),
                        }) === false)
                            shouldError = false;
                    setFormState(ofs => ({
                        ...ofs,
                        errors: errors,
                        disabled: false,
                        error: shouldError ? errorStr : null
                    }));
                });
            };

            const localValidator = validator || ((data) => data);
            const handler = handle || performRequest;

            genericValidator(formData).then(localValidator).then(
                () => handler(formData, setFormState)
            ).catch((errors, errorStr) => {
                setFormState(ofs => ({ ...ofs, disabled: false, errors, error: errorStr }));
            });
            return { ...oldFormState, disabled: !handle };
        });
    }, [
        // This is a long list, but none of these values should change frequently, if at all.
        action, genericValidator, handle, headers, method, multipart, onError, onUploadProgress,
        postSubmit, transformer, validator
    ]);
    if (submitRef) submitRef.current = submit;

    const onChangeLocal = useCallback((oldChange, cast, name, value) => {
        let casted = value;
        if (value && cast) casted = cast(value);
        if (oldChange) oldChange(value);

        const newValues = { ...values.current };
        setValue(newValues, name, casted, disableDotExpansion);
        values.current = newValues;
        if (valuesRef)
            valuesRef.current = newValues;

        if (onChange && different(lastState.current, values.current)) {
            lastState.current = values.current;
            onChange(values.current);
        }
    }, [disableDotExpansion, onChange, valuesRef]);

    const recurseChildren = (children) => {
        const newChildren = React.Children.toArray(children).filter(Boolean);
        newChildren.forEach((i, n) => {
            if (!i.props) return;

            const myChildren = recurseChildren(i.props.children);
            if ((typeof i.type) === "string") return;

            const props = { ...i.props };

            props.disabled = locked || formState.disabled || props.disabled;
            props.children = myChildren;
            if (props.name) {
                // Originals
                props._onChange = props.onChange;
                props._onSubmit = props.onSubmit;
                // useCallback
                props.onChange = onChangeLocal;
                props.onSubmit = submit;

                // [] !== [], but null === null
                if (Array.isArray(props.children) && props.children.length === 0)
                    props.children = null;

                props.initial = (
                    (typeof props.initial !== "undefined")
                        ? props.initial
                        : (props.value || props.val || "")
                );
                props.error = getValue(formState.errors, props.name, disableDotExpansion) || props.error;
                required.current[props.name] = props.required;
                props.key = props.name;
            } else if (props.receive) {
                if (Array.isArray(props.children) && props.children.length === 0)
                    props.children = null;

                props.error = getValue(formState.errors, props.receive, disableDotExpansion) || props.error;
                props.key = props.receive;
            } else {
                props.val = props.value = "";
            }
            if (props.formRequires) {
                props.formRequires.forEach(i => {
                    props[i] = getValue(values.current, i, disableDotExpansion);
                });
            }
            props.__ractf_global_error = formState.error;
            props.managed = 1;

            if (i.type === FormErrorType)
                hasCustomFormError.current = true;

            if (props.submit) {
                props.onClick = onClick.bind(this, props.onClick);
            }

            if (props.name)
                newChildren[n] = <ManagedInput C={i.type} {...props} />;
            else if (props.receive)
                newChildren[n] = <ReceiveWrap C={i.type} {...props} _values={values} />;
            else
                newChildren[n] = cloneElement(i, props);
        });
        return newChildren;
    };

    hasCustomFormError.current = false;
    const components = recurseChildren(children);
    return <>
        {components}
        {!hasCustomFormError.current && formState.error && <Form.Error>
            {formState.error}
        </Form.Error>}
    </>;
};
export const BareForm = _BareForm;

const Form = ({ className, centre, ...props }) => {
    return <Container.Form full centre={centre} className={className}>
        <BareForm {...props} />
    </Container.Form>;
};
export default Form;

// Disable false positive
// eslint-disable-next-line react/display-name
Form.Error = ({ children, __ractf_global_error }) => (
    <div className={style.formError}>{__ractf_global_error || children}</div>
);
Form.Error.displayName = "Form.Error";
// https://github.com/gaearon/react-hot-loader/issues/304
const FormErrorType = (<Form.Error />).type;

Form.Group = ({ children, label, htmlFor }) => (
    <div className={style.formGroup}>
        <label htmlFor={htmlFor}>{label}</label>
        {children}
    </div>
);
Form.Group.displayName = "Form.Group";

Form.Row = ({ children }) => (
    <div className={style.formRow}>
        {children}
    </div>
);
Form.Row.displayName = "Form.Row";
