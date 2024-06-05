import AppAction from "../components/AppActions";
import AuthStore from "../helpers/authStore"
import userStore from "../helpers/userStore";
import { router } from "../router";

const Dashboard = (() => {

  AuthStore.me();
  const userId = localStorage.getItem("user_id");
  
  userId ? userStore.allTodos(userId) : router.setRoute(`/`);
  const shell = document.querySelector('#app');
  shell.innerHTML = `
    ${AppAction()}
    <div id="dashboard">
      <h1 class="page-title">Tableau de bord</h1>
      <header>
        <p id="dashboard__header__text">Salut </p>
      </header>
      <div id="dashboard__content">
        <aside id="dashboard__content__user" class="box">
          <h2>Mes informations</h2>
          <table id="dashboard__content__user__stats">
            <tr data-stats-member>
              <td>Membre depuis le: </td>
            </tr>
            <tr data-stats-nb-projects>
              <td>Nombre de projets: </td>
            </tr>
            <tr data-stats-nb-current-tasks>
              <td>Nombre de tâche en cours: </td>
            </tr>
          </table>
          <a href="update-profil" data-navigo>Modifier mes informations</a>
        </aside>
        <main id="dashboard__content__projects" class="box">
          <h2>Mes projets</h2>
        </main>
      </div>
          </div>
  `;

  return {
    node: shell.firstElementChild, 
    markup: shell.innerHTML, 
  };
});



export default Dashboard;