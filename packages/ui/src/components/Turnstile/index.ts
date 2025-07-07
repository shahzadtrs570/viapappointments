import { InlineTurnstile } from "./InlineTurnstile"
/* eslint-disable import/no-default-export */ import { Turnstile } from "./Turnstile"
import { TurnstileDialog } from "./TurnstileDialog"

export { Turnstile } from "./Turnstile"
export { TurnstileDialog } from "./TurnstileDialog"
export { TurnstileManager } from "./TurnstileManager"
export { InlineTurnstile } from "./InlineTurnstile"

// Also export as default object for convenient imports
const TurnstileComponents = {
  Turnstile,
  TurnstileDialog,
  InlineTurnstile,
}

export default TurnstileComponents
