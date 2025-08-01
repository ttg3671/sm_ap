import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from './contexts/ThemeContext';

import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';

const LoadingComponent = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1810 50%, #1a1a1a 100%)',
    color: 'white',
    fontSize: '24px'
  }}>
    Loading...
  </div>
);

// Get the root container
const container = document.getElementById('root');

// Check if root already exists, if not create one
let root;
if (!container._reactRoot) {
  root = createRoot(container);
  container._reactRoot = root;
} else {
  root = container._reactRoot;
}

// Render the app
root.render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<LoadingComponent />} persistor={persistor}>
        <ThemeProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
)