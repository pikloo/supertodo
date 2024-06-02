import { setTasks, setTodoInformations } from "../actions";
import { setState, state } from "../store";

export function todoInformationsHandlerLogic() {
  const todoContainer = document.querySelector('#todo');
  const title = document.querySelector('#todo__header__meta__title');
  const description = document.querySelector('#todo__header__meta__description');
  const elements = [title, description];
  elements.forEach(element => {
    element.addEventListener('click', () => {
      const input = document.createElement('input');
      input.setAttribute('type', 'text');
      input.setAttribute('name', element.id.split('__')[3]);
      input.setAttribute('value', element.textContent);
      input.setAttribute('id', element.id.split('__')[3]);
      element.replaceWith(input);
      input.focus();
      input.value = '';
      input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          input.blur();
        }
      });
      //Au blur rendre à l'élément son état précédent
      input.addEventListener('blur', () => {
        input.replaceWith(element);
        if (input.id === "title" && input.value.length > 0 && input.value !== element.textContent) {

          todoContainer.removeAttribute("data-new-todo");
        }
        element.textContent = input.value.length > 0 ? input.value : element.textContent;
        //Ajouter les informations dans le state todo

        if (input.value.length > 0) {
          setTodoInformations({
            field: input.id,
            value: input.value
          })
        }
      });
    });
  });
}







export function tasksHandlerLogic() {
  //Ajouter la tâche au clic en créant un list sous l'input
  const inputs = document.querySelectorAll('#todo__container__tasks input')
  inputs.forEach(input => {

    input.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        input.blur();
      }
    });
    input.addEventListener('blur', () => {
      if (input.value.length > 0) {
        //Créer la liste de tâche si elle n'existe pas
        const container = input.parentElement;
        const list = container.querySelector('.todo__container__tasks__list')

        // Si l'url est new project
        const url = new URL(window.location.href);
        const isNewTodo = url.href.split('/')[3] == 'newproject';
        isNewTodo && taskCreator({
          title: input.value
        }, list)

        //Récupérer le status de la liste de tâche
        const status = container.getAttribute('data-tasks-status');
        //Ajout de la tâche dans le state
        setTasks({
          field: status,
          value: input.value
        })


        container.appendChild(list);


        input.value = '';
        input.setAttribute('placeholder', 'Nouvelle tâche...')

        //Modifier une tâche au clic sur le bouton update
        const updateButtons = document.querySelectorAll('[data-action="update"]');
        updateButtons.forEach(button => {
          button.addEventListener('click', () => {
            const task = button.parentElement.parentElement;
            const input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.setAttribute('value', task.querySelector('p').textContent);
            // input.setAttribute('id', task.id);
            task.replaceWith(input);
            input.focus();
            input.addEventListener('keyup', (e) => {
              if (e.key === 'Enter') {
                input.blur();
              }
            });
            //Au blur rendre à l'élément son état précédent
            input.addEventListener('blur', () => {
              input.replaceWith(task);
              task.querySelector('p').textContent = input.value.length > 0 ? input.value : task.querySelector('p').textContent;
            });
          });
        })

        //Supprimer une tâche au clic sur le bouton delete
        const deleteButtons = document.querySelectorAll('[data-action="delete"]');
        deleteButtons.forEach(button => {
          button.addEventListener('click', () => {
            const task = button.parentElement.parentElement;
            task.remove();
          })
        })
      }
    })
  })

  //Vider le state de currentTodo au clic sur le bouton retour
  const backButton = document.querySelector('.return');
  backButton.addEventListener('click', (e) => {
    e.preventDefault();
    setState({...state, currentTodo: {
      ...state.currentTodo,
       title: '',
       description: '',
       id: null,
       tasks: {
         done: [],
         todo: [],
         progress: [],
       }
    } });
  })
}


export function taskCreator(task, listItem) {
  const taskElement = document.createElement('li');
  task.id && taskElement.setAttribute('data-task-id', task.id);
  taskElement.setAttribute('class', `todo__container__tasks__list__item`);
  taskElement.addEventListener('mouseover', () => {
    const actions = taskElement.querySelector('.todo__container__tasks__list__item__actions')
    actions.style.opacity = 1;
  })

  taskElement.addEventListener('mouseleave', () => {
    const actions = taskElement.querySelector('.todo__container__tasks__list__item__actions')
    actions.style.opacity = 0;
  })

  taskElement.innerHTML = `
      <p>${task.title}</p>
      <div class="todo__container__tasks__list__item__actions">
          <button data-action="update"><i class="fa-solid fa-pencil"></i></button>
          <button data-action="delete"><i class="fa-solid fa-trash-can"></i></button>
      </div>
      `;

  listItem.prepend(taskElement)
}