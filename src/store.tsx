import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { Ticket } from './types'

type Action =
  | { type: 'CREATE'; ticket: Ticket }
  | { type: 'UPDATE'; ticket: Ticket }
  | { type: 'DELETE'; id: string }

interface StoreContext {
  tickets: Ticket[]
  dispatch: React.Dispatch<Action>
}

const STORAGE_KEY = 'arphie_tickets'

const Ctx = createContext<StoreContext | null>(null)

function reducer(state: Ticket[], action: Action): Ticket[] {
  switch (action.type) {
    case 'CREATE':
      return [action.ticket, ...state]
    case 'UPDATE':
      return state.map(t => t.id === action.ticket.id ? action.ticket : t)
    case 'DELETE':
      return state.filter(t => t.id !== action.id)
  }
}

function load(): Ticket[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Ticket[]) : []
  } catch {
    return []
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [tickets, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets))
  }, [tickets])

  return <Ctx.Provider value={{ tickets, dispatch }}>{children}</Ctx.Provider>
}

export function useStore() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
