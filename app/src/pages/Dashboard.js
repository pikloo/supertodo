import Button from "../components/Button";
import AuthStore from "../helpers/authStore";
import { subscribe } from "../store";

const Dashboard = (() => {
  
  AuthStore.me();
  const shell = document.querySelector('#app');
  // notice the data-navigo attribute in the anchor tag.  this is used by navigo to bind event handlers to the element
  // innerHTML formulaire de connexion
  shell.innerHTML = `
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
          <div id="dashboard__content__projects__empty">
            <p>Vous n'avez pas encore de projet</p>
            ${Button({type: 'button', text:'Créer un nouveau projet 📋'})}
          </div>
          <ul id="dashboard__content__projects__container">
            <li class="dashboard__content__projects__container__item">
              <h3>Titre du projet</h3>
              <p>Modifié le XX/XX/XXXX</p>
            </li>
            <li class="dashboard__content__projects__container__item">
              <h3>Titre du projet</h3>
              <p>Modifié le XX/XX/XXXX</p>
            </li>
            <li class="dashboard__content__projects__container__item">
              <h3>Titre du projet</h3>
              <p>Modifié le XX/XX/XXXX</p>
            </li>
            <li class="dashboard__content__projects__container__item">
              <h3>Titre du projet</h3>
              <p>Modifié le XX/XX/XXXX</p>
            </li>
            <li class="dashboard__content__projects__container__item">
              <h3>Titre du projet</h3>
              <p>Modifié le XX/XX/XXXX</p>
            </li>
          </ul>
        <main>
      </div>
          </div>
  `;

  subscribe(function(newState) {
    document.querySelector('#dashboard__header__text').textContent +=  `${newState.userDatas.firstname} ${newState.userDatas.lastname} 👋🏿 !` ;
    const memberRowElement = document.querySelector('#dashboard__content__user__stats [data-stats-member]');
    const celElement = document.createElement('td');
    celElement.innerHTML = newState.userDatas.member_since;
    memberRowElement.appendChild(celElement);
  });

  
  
  // each component from this example has this API returned
  return {
    node: shell.firstElementChild, // node is used by the render function of App to place the element on the page
    markup: shell.innerHTML, // markup is used by other components to compose the HTML into a bigger component
  };
});



export default Dashboard;