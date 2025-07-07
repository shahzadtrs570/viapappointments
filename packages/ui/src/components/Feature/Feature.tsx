import { cn } from "@package/utils"
import { CheckCircle2, XCircle } from "lucide-react"

import { Typography } from "../Typography/Typography"

type FeatureProps = {
  name: string
  included: boolean
}

export function Feature({ name, included }: FeatureProps) {
  return (
    <section className="flex items-center gap-2">
      {included ? (
        <CheckCircle2 className="text-success" size={20} />
      ) : (
        <XCircle className="text-muted-foreground opacity-75" size={20} />
      )}
      <Typography
        className={cn({ "text-muted-foreground opacity-75": !included })}
      >
        {name}
      </Typography>
    </section>
  )
}
