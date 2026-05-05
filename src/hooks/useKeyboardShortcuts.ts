import { useEffect } from 'react'

interface Shortcuts {
  onNewTicket: () => void
  onFocusSearch: () => void
  onKanbanView: () => void
  onListView: () => void
  onEsc: () => void
}

export function useKeyboardShortcuts(shortcuts: Shortcuts) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName
      const isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'

      if (e.key === 'Escape') {
        ;(e.target as HTMLElement).blur()
        shortcuts.onEsc()
        return
      }

      if (isTyping) return

      switch (e.key) {
        case 'n': case 'N': e.preventDefault(); shortcuts.onNewTicket();   break
        case 'f': case 'F': e.preventDefault(); shortcuts.onFocusSearch(); break
        case 'k': case 'K': e.preventDefault(); shortcuts.onKanbanView();  break
        case 'l': case 'L': e.preventDefault(); shortcuts.onListView();    break
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [shortcuts])
}
