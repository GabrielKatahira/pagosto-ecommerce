import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppRoutes from './routes'

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <AppRoutes />
  </StrictMode>,
)
