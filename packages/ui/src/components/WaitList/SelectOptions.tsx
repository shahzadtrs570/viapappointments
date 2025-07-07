import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@package/ui/select"

interface SelectOptionsProps {
  options?: { label: string; value: string }[]
}

export function SelectOptions({ options = [] }: SelectOptionsProps) {
  if (!options.length) {
    options = [
      {
        label: "Standard Plan - Perfect for individuals",
        value: "standard",
      },
      {
        label: "Enterprise Plan - For larger teams",
        value: "enterprise",
      },
      {
        label: "Beta Access - Help shape the product",
        value: "beta",
      },
    ]
  }

  return (
    <SelectContent>
      {options.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </SelectContent>
  )
}

export function SourceSelectOptions() {
  return (
    <SelectContent>
      <SelectItem value="search">Search Engine</SelectItem>
      <SelectItem value="social">Social Media</SelectItem>
      <SelectItem value="friend">Friend/Colleague</SelectItem>
      <SelectItem value="blog">Blog/Article</SelectItem>
      <SelectItem value="other">Other</SelectItem>
    </SelectContent>
  )
}

interface SourceSelectProps {
  value: string
  onValueChange: (value: string) => void
  disabled?: boolean
}

export function SourceSelect({
  value,
  onValueChange,
  disabled,
}: SourceSelectProps) {
  return (
    <Select disabled={disabled} value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select source" />
      </SelectTrigger>
      <SourceSelectOptions />
    </Select>
  )
}
