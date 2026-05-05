import { useState, useRef, useEffect } from 'react'
import { Check, ChevronDown } from 'lucide-react'

interface Props {
  value: string
  options: string[]
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  allowFreeText?: boolean
}

export default function Combobox({ value, options, onChange, placeholder = 'Select…', className = '', allowFreeText = true }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(value)
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setQuery(value) }, [value])

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        if (allowFreeText) onChange(query)
        else setQuery(value)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [query, value, allowFreeText, onChange])

  const filtered = options.filter(o => o.toLowerCase().includes(query.toLowerCase()))
  const showCreate = allowFreeText && query.trim() && !options.some(o => o.toLowerCase() === query.toLowerCase())

  function select(val: string) {
    onChange(val)
    setQuery(val)
    setOpen(false)
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur() }
    if (e.key === 'Enter' && query.trim()) { select(query.trim()) }
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className={`flex items-center border rounded-md bg-white transition-colors ${open ? 'border-indigo-400' : 'border-gray-200 hover:border-gray-300'}`}>
        <input
          ref={inputRef}
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          className="min-w-0 flex-1 rounded-md bg-transparent px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
        />
        <ChevronDown
          size={14}
          className={`mr-2 shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          onClick={() => { setOpen(o => !o); inputRef.current?.focus() }}
        />
      </div>

      {open && (filtered.length > 0 || showCreate) && (
        <div className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-sm">
          {filtered.map(opt => (
            <button
              key={opt}
              type="button"
              onMouseDown={e => e.preventDefault()}
              onClick={() => select(opt)}
              className={`flex items-center justify-between w-full px-3 py-2 text-sm transition-colors hover:bg-indigo-50 hover:text-indigo-700 ${
                opt === value ? 'text-indigo-600 font-medium' : 'text-gray-700'
              }`}
            >
              {opt}
              {opt === value && <Check size={13} className="text-indigo-500" />}
            </button>
          ))}
          {showCreate && (
            <button
              type="button"
              onMouseDown={e => e.preventDefault()}
              onClick={() => select(query.trim())}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              <span className="text-indigo-400">+</span> Add &ldquo;{query.trim()}&rdquo;
            </button>
          )}
        </div>
      )}
    </div>
  )
}
