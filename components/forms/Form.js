import React, { cloneElement, useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { makeClass } from "@ractf/util";
import http from "@ractf/http";

import style from "./Form.module.scss";


const setValue = (object, key, value, disableDotExpansion=false) => {
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
const getValue = (object, key, disableDotExpansion=false) => {
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


const generateValues = (children, previous = {}, displayValues, disableDotExpansion) => {
    const values = {};
    const getValues = (children) => {
        React.Children.toArray(children).filter(Boolean).forEach((i, n) => {
            if (!i.props) return;

            getValues(i.props.children);
            if (i.props.name && !previous.hasOwnProperty(i.props.name)) {
                const cast = (!displayValues && i.props.cast) || (i => i);

                if (typeof i.props.value !== "undefined") {
                    setValue(values, i.props.name, i.props.value && cast(i.props.value), disableDotExpansion);
                } else if (typeof i.props.val !== "undefined") {
                    setValue(values, i.props.name, i.props.val && cast(i.props.val), disableDotExpansion);
                } else if (typeof i.props.initial !== "undefined" && typeof i.props.options !== undefined
                    && Object.hasOwnProperty(i.props.options, i.props.initial)) {
                    setValue(values, i.props.name, i.props.options[i.props.initial].key, disableDotExpansion);
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


export const BareForm = React.memo(({
    children, handle, action, method = "POST", headers, postSubmit, validator, onError, locked, submitRef,
    valuesRef, onChange, transformer, disableDotExpansion
}) => {
    const [formState, setFormState] = useState({
        displayValues: generateValues(children, {}, true, disableDotExpansion),
        values: generateValues(children, {}, false, disableDotExpansion),
        error: null, errors: {}, disabled: false
    });
    const hasCustomFormError = useRef(false);
    const required = useRef({});
    const { t } = useTranslation();
    const lastState = useRef(formState.values);

    useEffect(() => {
        setFormState(oldFormState => {
            return {
                ...oldFormState,
                displayValues: {
                    ...oldFormState.displayValues,
                    ...generateValues(children, oldFormState.values, false, disableDotExpansion)
                },
                values: {
                    ...oldFormState.values,
                    ...generateValues(children, oldFormState.values, false, disableDotExpansion)
                },
            };
        });
    }, [children, disableDotExpansion]);
    useEffect(() => {
        if (valuesRef)
            valuesRef.current = formState.values;
        if (onChange && different(lastState.current, formState.values)) {
            lastState.current = formState.values;
            onChange(formState.values);
        }
    }, [valuesRef, formState.values, onChange]);

    const onClick = (oldClick, e) => {
        if (oldClick) oldClick(e);
        submit();
    };

    const genericValidator = (values) => {
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
    };
    const submit = (extraValues) => {
        setFormState(oldFormState => {
            if (oldFormState.disabled) return oldFormState;

            let formData = { ...oldFormState.values, ...extraValues };
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

                http.makeRequest(method, action, formData, headers).then(resp => {
                    setFormState(ofs => ({ ...ofs, disabled: false, errors: {}, error: null }));
                    if (postSubmit) postSubmit({ form: formData, resp: resp });
                }).catch(e => {
                    const errorStr = http.getError(e);
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
                        errors: getErrorDetails(e),
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
    };
    const onSubmit = (oldSubmit, value) => {
        if (oldSubmit) oldSubmit(value);
        submit();
    };
    if (submitRef) submitRef.current = submit;

    const onChangeLocal = (oldChange, cast, name, value) => {
        let casted = value;
        if (value && cast) casted = cast(value);
        if (oldChange) oldChange(value);

        setFormState(oldFormState => {
            const newErrors = { ...oldFormState.errors };
            const newValues = { ...oldFormState.values };
            const newDisplayValues = { ...oldFormState.displayValues };
            setValue(newErrors, name, null, disableDotExpansion);
            setValue(newValues, name, casted, disableDotExpansion);
            setValue(newDisplayValues, name, value, disableDotExpansion);
            return {
                ...oldFormState, errors: newErrors, values: newValues, displayValues: newDisplayValues
            };
        });
    };

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
                props.onChange = onChangeLocal.bind(this, props.onChange, props.cast, props.name);
                props.onSubmit = onSubmit.bind(this, props.onSubmit);
                if (getValue(formState.values, props.name, disableDotExpansion) === undefined)
                    props.val = props.value = "";
                else
                    props.val = props.value = getValue(formState.displayValues, props.name, disableDotExpansion);
                props.error = getValue(formState.errors, props.name, disableDotExpansion) || props.error;
                required.current[props.name] = props.required;
                props.key = props.name;
            } else {
                props.val = props.value = "";
            }
            if (props.formRequires) {
                props.formRequires.forEach(i => {
                    props[i] = getValue(formState.values, i, disableDotExpansion);
                });
            }
            props.__ractf_global_error = formState.error;
            props.managed = 1;

            if (i.type === FormError)
                hasCustomFormError.current = true;

            if (props.submit) {
                props.onClick = onClick.bind(this, props.onClick);
            }

            newChildren[n] = cloneElement(i, props);
        });
        return newChildren;
    };

    hasCustomFormError.current = false;
    const components = recurseChildren(children);
    return <>
        {components}
        {!hasCustomFormError.current && formState.error && <FormError>
            {formState.error}
        </FormError>}
    </>;
});
BareForm.displayName = "BareForm";

const Form = ({ className, ...props }) => {
    return <div className={makeClass(style.formWrapper, className)}>
        <BareForm {...props} />
    </div>;
};
export default React.memo(Form);

export const FormError = React.memo(({ children, __ractf_global_error }) => (
    <div className={style.formError}>{__ractf_global_error || children}</div>
));
FormError.displayName = "FormError";
