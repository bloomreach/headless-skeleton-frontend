export const cheatsheet = [

    {
        "heading": "Getting component properties (simple properties)",
        "reactJsx": "component.getParameters();",
    },
    {
        "heading": "Getting component content (content properties)",
        "reactJsx": "import {getContainerItemContent} from \"@bloomreach/spa-sdk\"; \n ... \n getContainerItemContent(component, page);",
    },
    {
        'heading': "Getting the page document properties",
        "reactJsx": "page.getDocument().getData();",
    },
]