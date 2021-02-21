import React, { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@ractf/ui-kit";

import style from "./FileUpload.module.scss";
import { InputGroup } from "./Input";


const FileUpload = ({ name, onChange, globalDrag, error }) => {
    const [isOver, setOver] = useState(false);
    const [filename, setFilename] = useState(null);
    const timeoutRef = useRef();
    const inputRef = useRef();

    const localOnChange = useCallback((e) => {
        const files = e.target.files;
        if (files.length === 0) {
            if (onChange)
                onChange(null);
            setFilename(null);
        } else {
            if (onChange)
                onChange(files[0]);
            setFilename(files[0].name);
        }
    }, [onChange]);
    useEffect(() => {
        if (globalDrag) {
            const onDragOver = (e) => {
                setOver(true);
                e.preventDefault();
                e.stopPropagation();
                if (timeoutRef.current)
                    clearTimeout(timeoutRef.current);
            };
            const onDragExit = () => {
                if (timeoutRef.current)
                    clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => {
                    setOver(false);
                }, 100);
            };
            const onDrop = (e) => {
                inputRef.current.files = e.dataTransfer.files;
                e.preventDefault();
                if (timeoutRef.current)
                    clearTimeout(timeoutRef.current);
                setOver(false);
                localOnChange({ target: { files: e.dataTransfer.files }});
            };

            document.addEventListener("dragover", onDragOver);
            document.addEventListener("dragleave", onDragExit);
            document.addEventListener("drop", onDrop);
            return () => {
                document.removeEventListener("dragover", onDragOver);
                document.removeEventListener("dragleave", onDragExit);
                document.removeEventListener("drop", onDrop);
                if (timeoutRef.current)
                    clearTimeout(timeoutRef.current);
            };
        }
    }, [globalDrag, localOnChange]);
    const onClick = useCallback(() => {
        inputRef.current.click();
    }, []);

    return <>
        {isOver && (
            <div htmlFor={name} class={style.hoverOverlay}>
                <span>Drop file anywhere to upload</span>
            </div>
        )}
        <input onChange={localOnChange} ref={inputRef} id={name} name={name}
            type="file" style={{ display: "none" }} />

        <InputGroup name={"null"} disabled managed val={filename || "No file selected"} left={
            <Button onClick={onClick}>Select File</Button>
        } error={error} />
    </>;
};
export default React.memo(FileUpload);
