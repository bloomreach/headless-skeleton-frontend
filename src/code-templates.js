export const codeTemplates = {
    "reactJsx": {
        "BrPage": `import {{componentname}} from "./components/{componentname}";
...
<BrPage ...  mapping={{..., {componentname}}}>
...
</BrPage>`,
        "brPageHighLight": "1,3",
        "componentHighLight": "5,6,7,12,13,14",
        "language": "jsx",
        "component": `/* save as /components/{componentname}.jsx */
import {getContainerItemContent} from "@bloomreach/spa-sdk";

export function {componentname}({component, page}) {

    const content = getContainerItemContent(component, page);
    const properties = component.getParameters()
    const pagedocument = page.getDocument().getData();

    return (
        <div>
            <h3>{component.getName()}</h3>
            <pre>content: {JSON.stringify(content, null, 2)}</pre>
            <pre>properties: {JSON.stringify(properties, null, 2)}</pre>
            <pre>page document: {JSON.stringify(pagedocument, null, 2)}</pre>
        </div>
    );
}`
    },
    "vueJs": {
        "BrPage": `<template>
...
    <br-page ... :mapping="mapping">
      ...
    </br-page>
...
<template>
<script>
import {componentname} from "./components/{componentname}";
..
export default {
  ...
  data: () => {
    return {
      configuration: {
        ...
      },
      mapping: {..., {componentname}},
    };
  }
}
</script>`
        ,
        language: "html",
        componentHighLight: "4,5,6,16,19,22",
        brPageHighLight: "3,9,18",
        component:
            `<!-- save as /components/{componentname}.vue -->
<template>
  <div>
    <h3>{{ component.getName() }}</h3>
    <pre>content: {{ JSON.stringify(content, null, 2) }}</pre>
    <pre>properties: {{ JSON.stringify(properties, null, 2) }}</pre>
    <pre>page document: {{ JSON.stringify(pagedocument, null, 2) }}</pre>
  </div>
</template>

<script>
import {getContainerItemContent} from "@bloomreach/spa-sdk";

export default {
  computed: {
    pagedocument() {
      return this.page.getDocument().getData();
    },
    content() {
      return getContainerItemContent(this.component, this.page);
    },
    properties() {
      return this.component.getParameters();
    }
  },
  props: ['component', 'page']
}
</script>`
    },
    "angular": {
        "BrPage": `import {Component} from '@angular/core';
import {componentname} from "./components/{componentname}/{componentname}.component";
...
@Component({
  ...
  template: \`
    <br-page [configuration]="configuration" [mapping]="mapping">
  </br-page>\`,
})
export class AppComponent {
  configuration = {...}
  mapping = {..., {componentname}
  }
}`
        ,
        language: "tsx",
        componentHighLight: "4,5,6,16,19,22",
        brPageHighLight: "2,7,8,12",
        component:
            `<!-- ng generate component {componentname} -->
import {Component, Input} from '@angular/core';
import {Component as BrComponent, ContainerItem, Document, getContainerItemContent, Page} from "@bloomreach/spa-sdk";

@Component({
  selector: 'app-{componentname}',
  template: \`
    <div>
      <h3>{{component.getName()}}</h3>
      <pre>content: {{JSON.stringify(content, null, 2)}}</pre>
      <pre>properties: {{JSON.stringify(properties, null, 2)}}</pre>
      <pre>page document: {{JSON.stringify(pagedocument, null, 2)}}</pre>
    </div>\`,
})
export class {componentname}Component {

  @Input() component!: BrComponent;
  @Input() page!: Page;

  get JSON() { return JSON;}

  get properties() {
    return this.component.getParameters<any>();
  }

  get pagedocument() {
    return this.page.getDocument<Document>()?.getData<any>();
  }

  get content() {
    return getContainerItemContent<any>(this.component as ContainerItem, this.page);
  }

}`
    },

}