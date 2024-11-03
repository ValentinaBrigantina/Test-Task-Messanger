import { AuthContext } from '@/routes/__root'
import { useContext } from 'react'

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
      throw new Error()
    }
    return context
  }