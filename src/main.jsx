import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'sweetalert2/dist/sweetalert2.min.css'
import './index.css'
import { HelmetProvider } from 'react-helmet-async'

import AuthProvider from './context/AuthProvider.jsx'
import { RouterProvider } from 'react-router'
import router from './routes/router.jsx'
import queryClient from './config/queryClient.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>,
)
