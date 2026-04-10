import { createBrowserRouter } from 'react-router';
import { lazy, Suspense } from 'react';
import { Home } from './pages/Home';
import { PostDetail } from './pages/PostDetail';

const GraphPage = lazy(() => import('./pages/GraphPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Home,
  },
  {
    path: '/post/:slug',
    Component: PostDetail,
  },
  {
    path: '/graph',
    element: (
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen bg-zinc-950 text-zinc-400">
            Loading…
          </div>
        }
      >
        <GraphPage />
      </Suspense>
    ),
  },
]);
