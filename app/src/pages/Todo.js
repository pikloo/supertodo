import Button from "../components/Button";
import FlashMessage from "../components/FlashMessage";
import todoStore from "../helpers/todoStore";
import { setState, state } from "../store";

const Todo = () => {

  //Récupérer le dernier morceau de l'url et appeler la todo avec l'id récupéré
  const url = new URL(window.location.href);



  const id = url.pathname.split('/')[1];
  let todoId = null;
  // if (id) {
  //   todo = todoStore.getTodo(id);
  // }

  const shell = document.querySelector('#app');
  shell.innerHTML = `
    <div id="todo" data-new-todo>
      <button class="return" onclick="history.back()"><i class="fa-solid fa-arrow-left"></i></button>
      <header id="todo__header" class="box">
        <div id="todo__header__meta">
          <h1 id="todo__header__meta__title">Nouveau projet</h1>
          <p id="todo__header__meta__description">Description du projet</p>
        </div>
        ${Button({ type: "button", text: "Enregistrer", color: "green", data: "todo-submit" })}
      </header>
      <main id="todo__container">
      <aside id="todo__container__sidebar" class="box">
        <p>Aucun collaborateur pour l'instant</p>
      </aside>
      <main id="todo__container__tasks">
        <div id="todo__container__tasks__todo" data-tasks-status="todo" class="box">
            <h2>A faire</h2>
            <input type="text" name="newTaskTodo" placeholder="Mettre en place un certificat SSL..." />
        </div>
        <div id="todo__container__tasks__in-progress" data-tasks-status="progress" class="box">
            <h2>En cours</h2>
            <input type="text" name="newTaskInProgress" placeholder="Tester la connexion..." />
        </div>
        <div id="todo__container__tasks__done" data-tasks-status="done" class="box">
            <h2>Terminées</h2>
            <input type="text" name="newTaskDone" placeholder="Créer la base de données..." />
        </div>
      </main>
      
      </main>
      
    </div>
    `;

  const todo = document.querySelector('#todo');

  //Enregistrement du projet
  const submitButton = document.querySelector('button[data-todo-submit]');
  submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    todoStore.createTodo();
  })

  if (state.message.text) {
    todo.insertAdjacentHTML('afterbegin', FlashMessage({ message: state.message.text, type: state.message.type }));
  }

  const messageElement = document.querySelector('.flash-message');
  if (messageElement) {
    messageElement.animate([
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(-200%)' }
    ],
      {
        duration: 1000,
        delay: 2000,
        fill: "both",
      },
    );
  }

  //Transformer le titre et la description au clic en input
  const title = document.querySelector('#todo__header__meta__title');
  const description = document.querySelector('#todo__header__meta__description');
  inputHandlerLogic([title, description])

  function inputHandlerLogic(elements) {
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

            todo.removeAttribute("data-new-todo");
          }
          element.textContent = input.value.length > 0 ? input.value : element.textContent;
          //Ajouter les informations dans le state todo
          input.value.length > 0 && setTodoInformations({
            field: input.id,
            value: input.value
          })

        });
      });
    });

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
          let list = container.querySelector('.todo__container__tasks__list')
          if (!list) {
            list = document.createElement('ul');
            list.setAttribute('class', `todo__container__tasks__list`);
          }

          const task = document.createElement('li');
          task.setAttribute('class', `todo__container__tasks__list__item`);
          task.addEventListener('mouseover', () => {
            const actions = task.querySelector('.todo__container__tasks__list__item__actions')
            actions.style.opacity = 1;
          })

          task.addEventListener('mouseleave', () => {
            const actions = task.querySelector('.todo__container__tasks__list__item__actions')
            actions.style.opacity = 0;
          })

          //Création de la tâche
          task.innerHTML = `
              <p>${input.value}</p>
              <div class="todo__container__tasks__list__item__actions">
                <button data-action="update"><i class="fa-solid fa-pencil"></i></button>
                <button data-action="delete"><i class="fa-solid fa-trash-can"></i></button>
              </div>
            `;

          //Récupérer le status de la liste de tâche
          const status = container.getAttribute('data-tasks-status');
          //Ajout de la tâche dans le state
          setTasks({
            field: status,
            value: input.value
          })

          list.prepend(task);
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


    function setTodoInformations({ field, value }) {
      setState({
        ...state, currentTodo: {
          [field]: value,
          ...state.currentTodo
        }
      })
    }

    function setTasks({ field, value }) {
      setState({
        ...state, currentTodo: {
          ...state.currentTodo,
          tasks: {
            ...state.currentTodo.tasks,
            [field]: [
              ...state.currentTodo.tasks[field],
              value
            ]
          }
        }
      })
    }


  }


  // each component from this example has this API returned
  return {
    node: shell.firstElementChild, // node is used by the render function of App to place the element on the page
    markup: shell.innerHTML, // markup is used by other components to compose the HTML into a bigger component
  };
}

export default Todo;