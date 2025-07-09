import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import AuthProvider from './context/AuthProvider.jsx'
import { RouterProvider } from 'react-router'
import router from './routes/router.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
