import Button from "../components/Button"
import { router } from "../router"
import { setState, state, subscribe } from "../store"
import todoStore from "./todoStore"

const USERS_API_ROOT = '/users'

class UserStore {
  constructor() {
    this.listener = () => { }
    this.todos = state.todos
    this.nb
  }

  listen(listener) {
    this.listener = listener
  }

  unlisten() {
    this.listener = () => { }
  }

  async allTodos(id) {
    const response = await fetchJson(new URL(`${USERS_API_ROOT}/${id.toString()}/todos`, `${process.env.DOMAIN_URL}:${process.env.API_PORT}`))
    if (!response.ok) throw new Error('Failed to fetch all todos')
    const body = await response.json()
    this.listener()

    subscribe(function (newState) {
      if (newState.todos !== this.todos) {
        const todos = newState.todos;

        // TODO: je n'arrive pas à récupérer le X-total-Count de l'entête de réponse
        const projectsNbRowElement = document.querySelector('#dashboard__content__user__stats [data-stats-nb-projects]');
        const celElement = document.createElement('td');
        celElement.innerHTML = `${todos.length}`;
        projectsNbRowElement.appendChild(celElement);



        const projectSection = document.querySelector('#dashboard__content__projects')
        if (todos.length > 0) {
          const projectsList = document.createElement('ul');
          projectsList.setAttribute('id', 'dashboard__content__projects__container');

          todos.forEach(todo => {
            const projectElement = document.createElement('li');
            projectElement.classList.add('dashboard__content__projects__container__item');
            projectElement.innerHTML = `
          <div class="dashboard__content__projects__container__item__card">
            <a href="project/${todo.id}" data-project-id="${todo.id}" data-navigo>
            <h3>${todo.title}</h3>
            <p>${todo.createdAt}</p>
            </a>
            <div class="dashboard__content__projects__container__item__card__actions">
                <button data-action="delete"><i class="fa-solid fa-trash-can"></i></button>
              </div>
          </div>
        `;
            projectsList.appendChild(projectElement);

            
            projectElement.addEventListener('mouseover', () => {
              const actions = projectElement.querySelector('.dashboard__content__projects__container__item__card__actions')
              actions.style.opacity = 1;
            })

            projectElement.addEventListener('mouseleave', () => {
              const actions = projectElement.querySelector('.dashboard__content__projects__container__item__card__actions')
              actions.style.opacity = 0;
            })



          });
          projectSection.innerHTML += `
          ${Button({ type: 'link', text: 'Nouveau projet ➕', centeredPosition: true, href: 'newproject', data: 'new-project' })}
        `;
          projectSection.appendChild(projectsList);
        } else {
          const projectEmptyDiv = document.createElement('div');
          projectEmptyDiv.setAttribute('id', 'dashboard__content__projects__empty');
          projectEmptyDiv.innerHTML = `
          <p>Vous n'avez pas encore de projet</p>
          ${Button({ type: 'link', text: 'Créer un nouveau projet 📋', href: 'newproject', data: 'new-project' })}
        `;

          projectSection.appendChild(projectEmptyDiv);
        }
        this.todos = newState.todos

        const newProjectLinks = document.querySelectorAll('a[data-new-project]');
        newProjectLinks.forEach(link => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentProject');
          });
        });


        const links = document.querySelectorAll('a[data-project-id]')
        links.forEach(link => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.setItem('currentProject', link.getAttribute('data-project-id'));
          });
        });

        //Supprimer une todo au clic sur le bouton delete
        const deleteButtons = document.querySelectorAll('[data-action="delete"]');
        deleteButtons.forEach(button => {
          button.addEventListener('click', () => {
            const buttonContent = button.innerHTML;
            //remplacer l'îcone poubelle par le cercle d'exclamation pendant 3 secondes puis remettre la poubelle
            button.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i>
            <div class="tooltip">Cliquez pour confirmer</div>
            `
            button.setAttribute('data-delete-confirm', null)
            button.classList.add('group')
            setTimeout(() => {
              button.innerHTML = buttonContent
              button.removeAttribute('data-delete-confirm')
            }, 5000);

            // !KO
            // Promise.resolve().then(() => {button.addEventListener('click', () => {
            //   const todoElement = button.parentElement.parentElement
            //   const todoId = todoElement.getAttribute('data-project-id')
            //   todoElement.parentElement.remove();
            //   todoStore.deleteTodo(todoId)
            //   }
            // )});

            if (button.hasAttribute('data-delete-confirm')) {
              button.addEventListener('click', () => {
                const todoElement = button.parentElement.previousElementSibling
                const todoId = todoElement.getAttribute('data-project-id')
                console.log(todoElement.parentElement)
                todoStore.deleteTodo(todoId)
                todoElement.parentElement.remove();
                
              })}
          })
        })

      }
    })
    setUserTodos(body)



    return body
  }

}



async function fetchJson(url, options) {
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    ...options
  })
  return response
}

function setUserTodos(todos) {
  setState({ ...state, todos });
}

function rootUrl() {
  return new URL(USERS_API_ROOT, `${process.env.DOMAIN_URL}:${process.env.API_PORT}`)
}

function itemUrl(id) {
  if (!id) throw new Error(`bad id: ${id}`)
  return new URL(id.toString(), rootUrl() + '/')
}


const userStore = new UserStore()

export default userStore