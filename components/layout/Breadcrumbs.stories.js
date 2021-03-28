import React from "react";

import UIKitBreadcrumbs from "./Breadcrumbs";


export default {
    title: "Breadcrumbs",
    component: UIKitBreadcrumbs
};

export const Breadcrumbs = () => (
    <UIKitBreadcrumbs>
        <UIKitBreadcrumbs.Crumb><span className={"linkStyle"}>You</span></UIKitBreadcrumbs.Crumb>
        <UIKitBreadcrumbs.Crumb><span className={"linkStyle"}>Are</span></UIKitBreadcrumbs.Crumb>
        <UIKitBreadcrumbs.Crumb>Here!</UIKitBreadcrumbs.Crumb>
    </UIKitBreadcrumbs>
);
Breadcrumbs.parameters = { controls: { hideNoControlsWarning: true } };
