export const cheatsheet = [

    {
        "heading": "Getting component properties (simple properties)",
        "reactJsx": "const properties = component.getParameters();",
    },
    {
        "heading": "Getting component content (complex properties)",
        "reactJsx": "import {getContainerItemContent} from \"@bloomreach/spa-sdk\"; \n ... \n const content = getContainerItemContent(component, page);",
    },
    {
        'heading': "Getting the page document attributes",
        "reactJsx": "const pagedocument = page.getDocument().getData();",
    },
]