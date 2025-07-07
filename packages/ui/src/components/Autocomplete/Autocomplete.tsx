"use client"

import { cn } from "@package/utils"
import { Check, ChevronsUpDown } from "lucide-react"

import { useAutocomplete } from "./useAutocomplete"
import { Button } from "../Button/Button"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "../Command/Command"
import { Popover, PopoverContent, PopoverTrigger } from "../Popover/Popover"
import { Spinner } from "../Spinner/Spinner"

export type Option = {
  label: string
  value: string
  description?: string
}

type ComboboxProps = {
  options: Option[]
  searchPlaceholder: string
  inputPlaceholder: string
  selectedOption: Option
  setSelectedOption: React.Dispatch<React.SetStateAction<Option>>
  emptyCommandMessage: string
  onInputChange?: (searchQuery: string) => void
  isLoading?: boolean
}

export function Autocomplete({
  options,
  searchPlaceholder,
  inputPlaceholder,
  selectedOption,
  setSelectedOption,
  emptyCommandMessage,
  onInputChange,
  isLoading,
}: ComboboxProps) {
  const { open, setOpen, findCorrespondingOption, handleSelect } =
    useAutocomplete({ options, selectedOption, setSelectedOption })

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className="w-full max-w-[256px] justify-between xs:max-w-[443px] md:max-w-[527px]"
          disabled={isLoading}
          role="combobox"
          variant="input"
        >
          {selectedOption.label ? findCorrespondingOption() : inputPlaceholder}

          {isLoading ? (
            <Spinner className="mr-0 size-4" />
          ) : (
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[256px] p-0 xs:w-[443px] md:w-[527px]">
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            onValueChange={(searchString: string) => {
              if (onInputChange) {
                onInputChange(searchString)
              }
            }}
          />
          <CommandList>
            <CommandEmpty>{emptyCommandMessage}</CommandEmpty>
            {options.length > 0 &&
              options.map((option) => (
                <CommandItem
                  key={option.value}
                  disabled={isLoading}
                  value={option.label}
                  onSelect={handleSelect}
                >
                  <div className="mr-2">
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedOption.value.toLowerCase() ===
                          option.value.toLowerCase()
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span>{option.label}</span>
                    {option.description && (
                      <span className="text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
