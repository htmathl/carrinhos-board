"use client"

import { useState } from "react"
import { Input } from "./ui/input"

export function StlInput({type, id, label, onChange = () => {}, value}: {type: string, id: string, label: string, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void, value?: string}) {
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

  const labelClass = `absolute left-3 transition-all duration-200 ${
    isFocused || value ? "-top-2.5 text-xs bg-zinc-900 px-1" : "top-2.5 text-base"
  }`

  return (
    <div className="relative mt-4">
      <Input
        type={type}
        id={id}
        className="pt-4 pb-4 px-3 h-11 text-white"
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={onChange}
        value={value}
      />
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
    </div>
  )
}

