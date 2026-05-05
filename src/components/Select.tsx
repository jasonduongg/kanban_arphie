import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface Option<T extends string> {
  value: T
  label: string
}

interface Props<T extends string> {
  value: T
  options: Option<T>[]
  onChange: (value: T) => void
  placeholder?: string
  className?: string
}

export default function Select<T extends string>({ value, options, onChange, placeholder, className = '' }: Props<T>) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selected = options.find(o => o.value === value)
  const label = selected?.label ?? placeholder ?? 'Select…'

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          open ? 'border-indigo-400 bg-white' : 'border-gray-200 bg-white hover:border-gray-300'
        } ${selected ? 'text-gray-900' : 'text-gray-400'}`}
      >
        <span className="truncate">{label}</span>
        <ChevronDown size={14} className={`shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 max-h-60 w-full min-w-max overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-sm">
          {placeholder && (
            <button
              type="button"
              onClick={() => { onChange('' as T); setOpen(false) }}
              className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-400 hover:bg-gray-50"
            >
              {placeholder}
            </button>
          )}
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false) }}
              className={`flex items-center justify-between w-full px-3 py-2 text-sm transition-colors hover:bg-indigo-50 hover:text-indigo-700 ${
                opt.value === value ? 'text-indigo-600 font-medium' : 'text-gray-700'
              }`}
            >
              {opt.label}
              {opt.value === value && <Check size={13} className="text-indigo-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
