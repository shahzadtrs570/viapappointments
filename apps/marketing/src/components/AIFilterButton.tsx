import { SlidersHorizontal, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const AIFilterButton = () => {
  return (
    <Button
      size="lg"
      className="fixed bottom-8 right-8 z-50 h-16 w-16 rounded-full bg-primary shadow-glass glow-primary animate-glow-pulse"
    >
      <div className="relative">
        <SlidersHorizontal className="h-6 w-6" />
        <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-accent" />
      </div>
    </Button>
  )
}

export default AIFilterButton
