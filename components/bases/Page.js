import React, { useEffect } from "react";

import { Container } from "@ractf/ui-kit";


const Page = ({ title, noWrap, children, ...props }) => {
    useEffect(() => {
        if (title) document.title = title;
    }, [title]);

    if (noWrap) return children;

    return <Container {...props}>
        {children}
    </Container>;
};
export default Page;
