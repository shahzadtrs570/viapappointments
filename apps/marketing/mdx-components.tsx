import { Accordion, Accordions } from "fumadocs-ui/components/accordion"
import { Callout } from "fumadocs-ui/components/callout"
import { Card, Cards } from "fumadocs-ui/components/card"
import { File, Files, Folder } from "fumadocs-ui/components/files"
import { Step, Steps } from "fumadocs-ui/components/steps"
import { Tab, Tabs } from "fumadocs-ui/components/tabs"
import { TypeTable } from "fumadocs-ui/components/type-table"
import defaultComponents from "fumadocs-ui/mdx"

import type { MDXComponents } from "mdx/types"

const fumaComponents = {
  Callout,
  Accordion,
  Accordions,
  Card,
  Cards,
  Steps,
  Step,
  Tabs,
  Tab,
  TypeTable,
  File,
  Files,
  Folder,
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...defaultComponents,
    ...components,
    ...fumaComponents,
  }
}
