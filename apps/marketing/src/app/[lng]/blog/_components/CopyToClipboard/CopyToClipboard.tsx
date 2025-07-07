"use client"

import { useToast } from "@package/ui/toast"
import { Link } from "lucide-react"

type CopyToClipboardProps = {
  link: string
}

export function CopyToClipboard({ link }: CopyToClipboardProps) {
  const { toast } = useToast()

  async function copyToClipboard() {
    await navigator.clipboard.writeText(link)
    toast({
      description: "Copied to clipboard!",
      variant: "success",
      title: "Success",
    })
  }

  return (
    <Link
      className="size-6 cursor-pointer transition-transform duration-300 hover:scale-110"
      onClick={copyToClipboard}
    />
  )
}
