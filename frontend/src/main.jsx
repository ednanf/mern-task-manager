import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import App from './App.jsx';
import Auth from './pages/Auth/Auth';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import NotFound from './pages/NotFound/NotFound.jsx';

import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: 'auth',
        element: <Auth />,
      },
      {
        path: 'auth/register',
        element: <Register />,
      },
      {
        path: 'auth/login',
        element: <Login />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
