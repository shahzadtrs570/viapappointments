import { cn } from "@package/utils"

import { Checkbox } from "@package/ui/checkbox"
import { Input } from "@package/ui/input"
import { Select, SelectTrigger, SelectValue } from "@package/ui/select"
import { Textarea } from "@package/ui/textarea"

import { SelectOptions } from "./SelectOptions"
import { type WaitlistField } from "./types"

interface WaitlistFormFieldProps {
  field: WaitlistField
  formData: Record<string, string | boolean | number>
  errors: Record<string, string[]>
  isLoading: boolean
  onFieldChange: (name: string, value: string | boolean | number) => void
  onFieldBlur: (name: string) => void
}

export function WaitlistFormField({
  field,
  formData,
  errors,
  isLoading,
  onFieldChange,
  onFieldBlur,
}: WaitlistFormFieldProps) {
  const hasError = errors[field.name].length > 0
  const commonProps = {
    id: field.name,
    disabled: isLoading,
    className: cn("w-full transition-colors", {
      "border-destructive": hasError,
      "focus-visible:ring-destructive": hasError,
    }),
    onBlur: () => onFieldBlur(field.name),
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const value =
        field.type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : e.target.value
      onFieldChange(field.name, value)
    },
  }

  switch (field.type) {
    case "hidden":
      return (
        <input
          name={field.name}
          type="hidden"
          value={String(formData[field.name] ?? field.defaultValue)}
        />
      )
    case "select":
      return (
        <Select
          {...commonProps}
          value={String(formData[field.name])}
          onValueChange={(value) => onFieldChange(field.name, value)}
        >
          <SelectTrigger
            className={cn({
              "border-destructive": hasError,
              "focus-visible:ring-destructive": hasError,
            })}
          >
            <SelectValue placeholder={field.placeholder}>
              {
                field.options?.find((opt) => opt.value === formData[field.name])
                  ?.label
              }
            </SelectValue>
          </SelectTrigger>
          <SelectOptions options={field.options} />
        </Select>
      )
    case "checkbox":
      return (
        <div className="flex items-center space-x-3">
          <Checkbox
            checked={Boolean(formData[field.name])}
            disabled={isLoading}
            id={field.name}
            value={String(formData[field.name])}
            className={cn("mt-0.5", {
              "border-destructive": hasError,
              "focus-visible:ring-destructive": hasError,
            })}
            onCheckedChange={(checked) =>
              onFieldChange(field.name, checked as boolean)
            }
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor={field.name}
              className={cn("text-sm cursor-pointer", {
                "text-destructive": hasError,
                "text-muted-foreground": !hasError,
              })}
            >
              {field.label}
            </label>
          </div>
        </div>
      )
    case "textarea":
      return (
        <Textarea
          {...commonProps}
          placeholder={field.placeholder}
          value={String(formData[field.name])}
        />
      )
    default:
      return (
        <Input
          {...commonProps}
          placeholder={field.placeholder}
          type={field.type}
          value={String(formData[field.name])}
        />
      )
  }
}
