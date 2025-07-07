/* eslint-disable import/no-default-export */
import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="size-12 animate-spin text-primary" />
        <h3 className="text-xl font-medium">Loading...</h3>
      </div>
    </div>
  )
}
