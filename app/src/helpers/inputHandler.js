import { deleteTasks, setTasks, setTodoInformations, updateTasks, updateTasksStatus } from "../actions";
import Todo, { increment } from "../pages/Todo";

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
      input.setSelectionRange(input.value.length, input.value.length)
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

        //Récupérer le status de la liste de tâche
        const status = container.getAttribute('data-tasks-status');

        // Si l'url est new project
        const url = new URL(window.location.href);
        const isNewTodo = url.href.split('/')[3] == 'newproject';
        isNewTodo && taskCreator({
          title: input.value
        }, list, status)


        //Ajout de la tâche dans le state
        setTasks({
          field: status,
          value: input.value
        })

        container.appendChild(list);

        input.value = '';
        input.setAttribute('placeholder', 'Nouvelle tâche...')

        taskActionHandler();

      }
    })
  })



}


export function taskActionHandler(container = null) {
  //Modifier une tâche au clic sur le bouton update
  const updateButtons = document.querySelectorAll('[data-action="update"]');

  updateButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const task = button.parentElement.parentElement;
      const input = document.createElement('input');
      input.setAttribute('type', 'text');
      input.setAttribute('value', task.querySelector('p').textContent);
      // input.setAttribute('id', task.id);
      task.replaceWith(input);
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length)
      input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          input.blur();
        }
      });
      //Au blur rendre à l'élément son état précédent
      input.addEventListener('blur', () => {
        input.replaceWith(task);
        console.log(input.value)
        task.querySelector('p').textContent = input.value.length > 0 ? input.value : task.querySelector('p').textContent;
        // Modifier la tâche dans le state
        if (container) {
          const status = container.getAttribute('data-tasks-status');
          // const status = input.parentElement.parentElement.getAttribute('data-tasks-status')
          updateTasks({
            field: status,
            value: input.value,
            id: task.getAttribute('data-task-id')
          })
        }

      });
    });
  })

  //Supprimer une tâche au clic sur le bouton delete
  const deleteButtons = document.querySelectorAll('[data-action="delete"]');
  deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const task = button.parentElement.parentElement;
      task.remove();
      //Supprimer la tâche dans le state
      if (container) {
        const status = container.getAttribute('data-tasks-status');
        // const status = input.parentElement.parentElement.getAttribute('data-tasks-status')
        deleteTasks({
          field: status,
          id: task.getAttribute('data-task-id')
        })
      }

    })
  })
}


export function taskCreator(task, listItem, status) {
  if (task) {
    const taskElement = document.createElement('li');

    taskElement.setAttribute('class', `todo__container__tasks__list__item`);
    if (task.id) { taskElement.setAttribute('data-task-id', task.id) }
    else {
      const newTasks = document.querySelectorAll('[data-new-task-id]')
      taskElement.setAttribute('data-new-task-id', newTasks.length + 1);
    }
    taskElement.setAttribute('draggable', true);
    // const status =  taskElement.parentElement.parentElement.getAttribute('data-task-status');
    taskDragHandler(taskElement, status);
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

}

export function taskDragHandler(task, oldStatus) {
  task.addEventListener('dragstart', (e) => {
    const data = task.hasAttribute('data-task-id') ? { id: task.getAttribute('data-task-id') } : {
      id: task.getAttribute('data-new-task-id'),
      isNewTask: true
    }
    e.dataTransfer.setData('data', JSON.stringify(data))


  })

  const todoContainer = document.querySelector('#todo__container__tasks__todo')
  dropZoneLogic(todoContainer)
  const doingContainer = document.querySelector('#todo__container__tasks__in-progress')
  dropZoneLogic(doingContainer)
  const doneContainer = document.querySelector('#todo__container__tasks__done')
  dropZoneLogic(doneContainer)

  function dropZoneLogic(container) {
    container.addEventListener('drop', (e) => {
      e.preventDefault();
      const data = JSON.parse(e.dataTransfer.getData('data'));
      const task = !Object.hasOwn(data, 'isNewTask') ? document.querySelector(`[data-task-id="${data.id}"]`) : document.querySelector(`[data-new-task-id="${data.id}"]`)

      updateTasksStatus({
        oldStatus,
        newStatus: container.getAttribute('data-tasks-status'),
        task: {
          id: task.getAttribute('data-task-id') ? task.getAttribute('data-task-id') : null,
          value: task.querySelector('p').textContent,
        }
      })

      if (Object.hasOwn(data, 'isNewTask')) {
        task.remove();
        container.querySelector('.todo__container__tasks__list').prepend(task);
      }

    })

    container.addEventListener('dragover', (e) => {
      e.preventDefault();
    })

  }


}