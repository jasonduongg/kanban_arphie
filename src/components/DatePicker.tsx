import { useState, useRef, useEffect } from 'react'
import { DayPicker } from 'react-day-picker'
import { format } from 'date-fns'
import { parseLocalDate } from '../utils/helpers'
import { Calendar, X } from 'lucide-react'
import 'react-day-picker/style.css'

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function DatePicker({ value, onChange, placeholder = 'Pick a date', className = '' }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = value ? parseLocalDate(value) : undefined

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function handleSelect(day: Date | undefined) {
    onChange(day ? format(day, 'yyyy-MM-dd') : '')
    setOpen(false)
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          open ? 'border-indigo-400 bg-white' : 'border-gray-200 bg-white hover:border-gray-300'
        } ${selected ? 'text-gray-900' : 'text-gray-400'}`}
      >
        <span className="flex items-center gap-2 whitespace-nowrap">
          <Calendar size={14} className="text-gray-400 shrink-0" />
          {selected ? format(selected, 'MMM d, yyyy') : placeholder}
        </span>
        {selected && (
          <X
            size={13}
            className="text-gray-400 hover:text-gray-600 shrink-0"
            onClick={e => { e.stopPropagation(); onChange('') }}
          />
        )}
      </button>

      {open && (
        <div className="absolute z-50 mt-1 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            classNames={{
              root: 'text-sm w-[264px]',
              months: 'flex flex-col',
              month: 'w-full',
              month_caption: 'flex items-center justify-between mb-2 px-1',
              caption_label: 'text-sm font-semibold text-gray-800',
              nav: 'flex items-center gap-1',
              button_previous: 'cursor-pointer rounded p-2 text-gray-500 transition-colors hover:bg-gray-100 [&>svg]:h-5 [&>svg]:w-5',
              button_next: 'cursor-pointer rounded p-2 text-gray-500 transition-colors hover:bg-gray-100 [&>svg]:h-5 [&>svg]:w-5',
              month_grid: 'w-full border-collapse',
              weekdays: 'flex mb-1',
              weekday: 'w-9 h-8 text-center text-xs text-gray-400 font-medium flex items-center justify-center',
              week: 'flex',
              day: 'w-9 h-9 p-0',
              day_button: 'w-9 h-9 rounded-lg flex items-center justify-center text-sm hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer text-gray-700',
              selected: '[&>button]:bg-indigo-600 [&>button]:text-white [&>button]:hover:bg-indigo-700',
              today: '[&>button]:font-bold [&>button]:text-indigo-600',
              outside: '[&>button]:text-gray-300',
              disabled: '[&>button]:text-gray-300 [&>button]:cursor-not-allowed',
            }}
          />
        </div>
      )}
    </div>
  )
}
