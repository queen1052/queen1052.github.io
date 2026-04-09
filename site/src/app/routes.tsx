import { createBrowserRouter } from 'react-router';
import { Home } from './pages/Home';
import { PostDetail } from './pages/PostDetail';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Home,
  },
  {
    path: '/post/:slug',
    Component: PostDetail,
  },
]);
