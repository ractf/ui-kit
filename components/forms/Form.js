import React, { cloneElement, useState, useEffect } from "react";
import { http } from "ractf";

import "./Form.scss";


export const BareForm = ({
    children, handle, action, method = "POST", headers, postSubmit, validator, onError, locked
}) => {
    const [formState, setFormState] = useState({ values: {}, error: null, errors: {}, disabled: false });

    useEffect(() => {
        setFormState(oldFormState => {
            const values = {};
            const getValues = (children) => {
                React.Children.toArray(children).filter(Boolean).forEach((i, n) => {
                    if (!i.props) return;

                    getValues(i.props.children);
                    if (i.props.name && !oldFormState.values.hasOwnProperty(i.props.name)) {
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

            return { ...oldFormState, values: { ...oldFormState.values, ...values } };
        });
    }, [children]);

    const onClick = (oldClick, e) => {
        if (oldClick) oldClick(e);
        submit();
    };

    const getErrorDetails = (e) => {
        if (!e.response && e.response.data) return {};
        if (typeof e.response.data.d !== "object") return {};

        return e.response.data.d;
    };

    const submit = () => {
        setFormState(oldFormState => {
            const performRequest = () => {
                http.makeRequest(method, action, { ...oldFormState.values }, headers).then(resp => {
                    setFormState(ofs => ({ ...ofs, errors: {}, error: null }));
                    if (postSubmit) postSubmit({ form: { ...oldFormState.values }, resp: resp });
                }).catch(e => {
                    const errorStr = http.getError(e);
                    setFormState(ofs => ({ ...ofs, errors: getErrorDetails(e), error: errorStr }));
                    if (onError) onError(errorStr, e);
                });
            };

            if (handle) {
                handle({ ...oldFormState.values });
            } else {
                if (validator)
                    validator({ ...oldFormState.values }).then(performRequest).catch((errors, errorStr) => {
                        setFormState(ofs => ({ ...ofs, errors, error: errorStr }));
                    });
                else performRequest();
            }
            return oldFormState;
        });
    };
    const onSubmit = (oldSubmit, value) => {
        if (oldSubmit) oldSubmit(value);
        submit();
    };

    const onChange = (name, value) => {
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
                props.onChange = onChange.bind(this, props.name);
                props.onSubmit = onSubmit.bind(this, props.onSubmit);
                if (formState.values[props.name] === undefined)
                    props.val = props.value = "";
                else
                    props.val = props.value = formState.values[props.name];
                props.error = formState.errors[props.name] || props.error;
            } else {
                props.val = props.value = "";
            }
            props.__ractf_managed = 1;

            if (props.submit) {
                props.onClick = onClick.bind(this, props.onClick);
            }

            newChildren[n] = cloneElement(i, props);
        });
        return newChildren;
    };

    const components = recurseChildren(children);
    return <>
        {components}
        {formState.error && <FormError>
            {formState.error}
        </FormError>}
    </>;
};

const Form = ({ ...props }) => {
    return <div className={"formWrapper"}>
        <BareForm {...props} />
    </div>;
};
export default Form;

export const FormError = ({ children }) => (
    <div className={"formError"}>{children}</div>
);
