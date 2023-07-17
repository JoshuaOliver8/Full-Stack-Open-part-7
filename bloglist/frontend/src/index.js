import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import { NotificationContextProvider } from './NotificationContext'
import {
    BrowserRouter as Router,
} from 'react-router-dom'

import App from './App'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>
        <Router>
            <NotificationContextProvider>
                <App />
            </NotificationContextProvider>
        </Router>
    </QueryClientProvider>
)
