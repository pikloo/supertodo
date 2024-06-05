import Home from './pages/Home';
import Router from './helpers/router.js' ;
import Dashboard from './pages/Dashboard.js';
import Todo from './pages/Todo.js';
import Register from './pages/Register.js';

export const router = new Router({
    type: "history",
    routes: {
        "/": Home,
        "/dashboard": Dashboard,
        "/project": Todo,
        "/newproject": Todo,
        "/register": Register,
    }
  })