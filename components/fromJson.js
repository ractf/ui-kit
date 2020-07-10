import React from "react";

import {
    FormGroup, Input, Select, HR, Spoiler
} from "@ractf/ui-kit";

const fromJson = (fields = [], data = {}) => {
    const generateFields = (fields) => {
        const retFields = [];
        let n = 0;

        fields.forEach(field => {
            switch (field.type) {
                case "multiline":
                case "code":
                case "text":
                case "number":
                    const val = data[field.name];
                    const format = field.type === "number" ? /\d+/ : /.+/;
                    retFields.push(<FormGroup htmlFor={field.name} label={field.label} key={(n++)}>
                        <Input val={val !== undefined ? val.toString() : undefined} name={field.name}
                            placeholder={field.label} format={format}
                            rows={field.type === "multiline" || field.type === "code" ? 5 : ""}
                            monospace={field.type === "code"} />
                    </FormGroup>);
                    break;
                case "select":
                    const idx = field.options.map(i => i.key).indexOf(data[field.name]);
                    retFields.push(<FormGroup key={(n++)} htmlFor={field.name} label={field.label}>
                        <Select name={field.name} options={field.options}
                            initial={idx !== -1 ? idx : 0} />
                    </FormGroup>);
                    break;
                case "label":
                    retFields.push(<div key={(n++)}>{field.label}</div>);
                    break;
                case "hr":
                    retFields.push(<HR key={(n++)} />);
                    break;
                case "group":
                    retFields.push(<Spoiler key={(n++)} title={field.label}>
                        {generateFields(field.children)}
                    </Spoiler>);
                    break;
                default:
                    retFields.push(<div key={(n++)}>Unknown field type: {field.type}</div>);
                    break;
            }
        });
        return retFields;
    };
    return generateFields(fields);
};
export default fromJson;
