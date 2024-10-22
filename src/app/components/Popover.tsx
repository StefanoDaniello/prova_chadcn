"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useContextApp } from "@/store/useAppContext";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover as ShadPopover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect } from "react";

const time = [
  {
    value: "Anno",
    label: "Anno",
  },
  {
    value: "Mese",
    label: "Mese",
  },
  {
    value: "Settimana",
    label: "Settimana",
  },
];

interface PopoverProps {
  action: string;
}

export function Popover({ action }: PopoverProps) {
  const [open, setOpen] = React.useState(false);
  const { valueSelect, setValueSelect, campi, campoValue, setCampoValue } =
    useContextApp();

  useEffect(() => {
    setValueSelect(time[0].value);
    setCampoValue("Tutti");
  }, []);

  return (
    <ShadPopover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {action === "tempo" ? (
            <>
              {valueSelect
                ? time.find((time) => time.value === valueSelect)?.label
                : valueSelect}
            </>
          ) : (
            <>
              {campoValue} {/* Mostra "Tutti" di default */}
            </>
          )}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <>
              {action === "tempo" ? (
                <CommandGroup>
                  {time.map((item) => (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      onSelect={(currentValue) => {
                        setValueSelect(
                          currentValue === valueSelect ? "" : currentValue
                        );
                        setOpen(false);
                      }}
                    >
                      {item.label}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          valueSelect === item.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : (
                <CommandGroup>
                  <CommandItem
                    key="tutti" // chiave unica per l'opzione "Tutti"
                    value="Tutti"
                    onSelect={() => {
                      setCampoValue(campoValue === "Tutti" ? "" : "Tutti");
                      setOpen(false);
                    }}
                  >
                    Tutti
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        campoValue === "Tutti" ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                  {campi.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.Name}
                      onSelect={(currentValue) => {
                        setCampoValue(
                          currentValue === campoValue ? "" : currentValue
                        );
                        setOpen(false);
                      }}
                    >
                      {item.Name}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          campoValue === item.Name ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </>
          </CommandList>
        </Command>
      </PopoverContent>
    </ShadPopover>
  );
}
