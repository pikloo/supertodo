import App from './App';
import Home from './pages/Home';
import Router from './helpers/router.js' ;
import './style.css';

const app = App();

const router = new Router({
  type: "history",
  routes: {
      "/": Home,
      "/about": "about",
      "/products": "products"
  }
}).listen().on("route", async e => {
  app.render(e.detail.route)
});