import App from './App';
import './style.css';
import { router } from './router.js';

const app = App();
router.listen().on("route", async e => {
  app.render(e.detail.route)
});

