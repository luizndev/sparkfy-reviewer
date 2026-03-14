"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"

import { cn } from "~/lib/utils"
import { Button } from "~components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "~components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "~components/ui/popover"

interface ComboboxProps {
  items?: readonly any[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function Combobox({
  items = [],
  value: defaultValue,
  onChange,
  placeholder = "Select a item..."
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(defaultValue)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between">
          {value ? items.find((item) => item === value) : placeholder}
          <ChevronsUpDown className="min-w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full max-w-64 p-0">
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-y-auto">
              {items.map((item) => (
                <CommandItem
                  key={item}
                  value={item}
                  onSelect={(currentValue) => {
                    const selectedValue =
                      currentValue === value ? "" : currentValue
                    setValue(selectedValue)
                    onChange(selectedValue)
                    setOpen(false)
                  }}>
                  {item}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === item ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
