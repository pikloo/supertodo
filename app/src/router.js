import Home from './pages/Home';
import Router from './helpers/router.js' ;
import Dashboard from './pages/Dashboard.js';

export const router = new Router({
    type: "history",
    routes: {
        "/": Home,
        "/dashboard": Dashboard,
        "/products": "products"
    }
  })