export const templates = {
    "BrPage": "<BrPage ...  mapping={{..., {componentname}}}>\n" +
        "...\n"+
                "</BrPage>",
    "reactJsx": "import {getContainerItemContent} from \"@bloomreach/spa-sdk\";\n" +
        "\n" +
        "export function {componentname}({component, page}) {\n" +
        "\n" +
        "    const content = getContainerItemContent(component, page);\n" +
        "    const properties = component.getParameters()\n" +
        "    const pagedocument = page.getDocument().getData();\n" +
        "\n" +
        "    return (\n" +
        "        <div>\n" +
        "            <h3>{component.getName()}</h3>\n" +
        "            <pre>content: {JSON.stringify(content, null, 2)}</pre>\n" +
        "            <pre>properties: {JSON.stringify(properties, null, 2)}</pre>\n" +
        "            <pre>page document: {JSON.stringify(pagedocument, null, 2)}</pre>\n" +
        "        </div>\n" +
        "    );\n" +
        "}",
    "reactTsx": "import {getContainerItemContent} from \"@bloomreach/spa-sdk\";\n" +
        "import React from \"react\";\n" +
        "\n" +
        "export function {componentname}({component, page}) {\n" +
        "\n" +
        "    const content = getContainerItemContent(component, page);\n" +
        "    const properties = component.getParameters()\n" +
        "    const pagedocument = page.getDocument().getData();\n" +
        "\n" +
        "    return (\n" +
        "        <div>\n" +
        "            <h3>component.getName()</h3>\n" +
        "            <pre>content: {JSON.stringify(content, null, 2)}</pre>\n" +
        "            <pre>properties: {JSON.stringify(properties, null, 2)}</pre>\n" +
        "            <pre>page document: {JSON.stringify(pagedocument, null, 2)}</pre>\n" +
        "        </div>\n" +
        "    );\n" +
        "}",
    "vue": "",
    "angular": ""
}