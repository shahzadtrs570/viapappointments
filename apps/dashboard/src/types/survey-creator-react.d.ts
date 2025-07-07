/* eslint-disable-next-line */
declare module "survey-creator-react" {
  import { ReactElement } from "react"

  export class SurveyCreator {
    constructor(options?: any)
    text: string
    themeJson: any
    onComplete: any
  }

  export interface SurveyCreatorComponentProps {
    creator: SurveyCreator
  }

  export function SurveyCreatorComponent(
    props: SurveyCreatorComponentProps
  ): ReactElement
}

declare module "survey-core" {
  export class Model {
    constructor(json: any)
    onComplete: {
      add: (callback: (sender: any) => void) => void
    }
    data: any
  }
}

declare module "survey-react-ui" {
  import { ReactElement } from "react"
  import { Model } from "survey-core"

  export interface SurveyProps {
    model: Model
  }

  export function Survey(props: SurveyProps): ReactElement
}
