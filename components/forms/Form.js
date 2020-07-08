import React, { cloneElement, useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import http from "@ractf/http";

import "./Form.scss";


export const BareForm = React.memo(({
    children, handle, action, method = "POST", headers, postSubmit, validator, onError, locked
}) => {
    const generateValues = (children, previous = {}) => {
        const values = {};
        const getValues = (children) => {
            React.Children.toArray(children).filter(Boolean).forEach((i, n) => {
                if (!i.props) return;

                getValues(i.props.children);
                if (i.props.name && !previous.hasOwnProperty(i.props.name)) {
                    if (i.props.value) {
                        values[i.props.name] = i.props.value;
                    } else if (i.props.val) {
                        values[i.props.name] = i.props.val;
                    } else {
                        values[i.props.name] = "";
                    }
                }
            });
        };
        getValues(children);
        return values;
    };

    const [formState, setFormState] = useState({
        values: generateValues(children), error: null, errors: {}, disabled: false
    });
    const hasCustomFormError = useRef(false);
    const required = useRef({});
    const { t } = useTranslation();

    useEffect(() => {
        setFormState(oldFormState => {
            return {
                ...oldFormState,
                values: { ...oldFormState.values, ...generateValues(children, oldFormState.values) }
            };
        });
    }, [children]);

    const onClick = (oldClick, e) => {
        if (oldClick) oldClick(e);
        submit();
    };

    const getErrorDetails = (e) => {
        if (!(e.response && e.response.data)) return {};
        if (typeof e.response.data.d !== "object") return {};

        return e.response.data.d;
    };

    const genericValidator = (values) => {
        return new Promise((resolve, reject) => {
            const errors = {};
            Object.keys(values).forEach(i => {
                if (required.current[i] && !values[i])
                    errors[i] = t("required");
            });
            if (Object.keys(errors).length)
                return reject(errors);
            resolve();
        });
    };
    const submit = (extraValues) => {
        setFormState(oldFormState => {
            const formData = { ...oldFormState.values, ...extraValues };
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

            const localValidator = validator || genericValidator;
            const handler = handle || performRequest;

            localValidator(formData).then(() => handler(formData, setFormState)).catch((errors, errorStr) => {
                setFormState(ofs => ({ ...ofs, disabled: false, errors, error: errorStr }));
            });
            return { ...oldFormState, disabled: true };
        });
    };
    const onSubmit = (oldSubmit, value) => {
        if (oldSubmit) oldSubmit(value);
        submit();
    };

    const onChange = (oldChange, name, value) => {
        if (oldChange) oldChange(value);
        setFormState(oldFormState => ({
            ...oldFormState, errors: {
                ...oldFormState.errors, [name]: null
            }, values: {
                ...oldFormState.values, [name]: value
            }
        }));
    };

    const recurseChildren = (children) => {
        const newChildren = React.Children.toArray(children).filter(Boolean);
        newChildren.forEach((i, n) => {
            if (!i.props) return;

            const myChildren = recurseChildren(i.props.children);
            const props = { ...i.props };

            props.disabled = locked || formState.disabled || props.disabled;
            props.children = myChildren;
            if (props.name) {
                props.onChange = onChange.bind(this, props.onChange, props.name);
                props.onSubmit = onSubmit.bind(this, props.onSubmit);
                if (formState.values[props.name] === undefined)
                    props.val = props.value = "";
                else
                    props.val = props.value = formState.values[props.name];
                props.error = formState.errors[props.name] || props.error;
                required.current[props.name] = props.required;
                props.key = props.name;
            } else {
                props.val = props.value = "";
            }
            props.__ractf_global_error = formState.error;
            props.__ractf_managed = 1;

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

const Form = ({ ...props }) => {
    return <div className={"formWrapper"}>
        <BareForm {...props} />
    </div>;
};
export default React.memo(Form);

export const FormError = React.memo(({ children, __ractf_global_error }) => (
    <div className={"formError"}>{__ractf_global_error || children}</div>
));
FormError.displayName = "FormError";
