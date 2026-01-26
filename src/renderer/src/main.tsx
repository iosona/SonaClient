import App from './App'
import process from 'process'
import { createRoot } from 'react-dom/client'
import { SnackbarProvider } from 'notistack'
import { StorageProvider } from './providers/StorageProvider'
import { SocketProvider } from './providers/SocketProvider'
import { CustomThemeProvider } from './providers/ThemeProvider'
import { Buffer } from 'buffer'

window.Buffer = Buffer
window.process = process;

createRoot(document.getElementById('root')!)
  .render(
    <SnackbarProvider>
      <StorageProvider>
        <SocketProvider>
          <CustomThemeProvider>
            <App />
          </CustomThemeProvider>
        </SocketProvider>
      </StorageProvider>
    </SnackbarProvider>
  )