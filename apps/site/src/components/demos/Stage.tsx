import type { ReactNode } from 'react'

export function Stage({ children }: { children: ReactNode }) {
  return <div className="specimen-demo">{children}</div>
}
