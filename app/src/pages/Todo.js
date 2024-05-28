import { setNewTasks, setNewTodoInformations, setTasks, setTodoInformations } from "../actions";
import Button from "../components/Button";
import FlashMessage from "../components/FlashMessage";
import { inputHandlerLogic } from "../helpers/inputHandler";
import todoStore from "../helpers/todoStore";
import { setState, state, subscribe } from "../store";

const Todo = () => {

  //Récupérer le dernier morceau de l'url et appeler la todo avec l'id récupéré
  const url = new URL(window.location.href);

  const todoId = localStorage.getItem('currentProject');
  // todoId && todoStore.getTodo(todoId);
  if (todoId) {
    todoStore.getTodo(todoId)// const todo = new todoStore({});
    
  }



  const shell = document.querySelector('#app');
  shell.innerHTML = `
    <div id="todo" data-new-todo>
      <button class="return" onclick="history.back()"><i class="fa-solid fa-arrow-left"></i></button>
      <header id="todo__header" class="box">
        <div id="todo__header__meta">
          <h1 id="todo__header__meta__title">Nouveau projet</h1>
          <p id="todo__header__meta__description">Description du projet</p>
        </div>
        ${Button(
        {
          type: "button",
          text: "Enregistrer",
          color: "green",
          data: "todo-submit",
          dataValue: "new"
        })}
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



  const todoContainer = document.querySelector('#todo');


  //Enregistrement du projet
  const submitButton = document.querySelector('button[data-todo-submit]');
  
  submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    submitButton.getAttribute('data-todo-submit') === 'new' ? todoStore.createTodo() : todoStore.updateTodo();
  })

  if (state.message.text) {
    todoContainer.insertAdjacentHTML('afterbegin', FlashMessage({ message: state.message.text, type: state.message.type }));
  }

  const messageElement = document.querySelector('.flash-message');
  if (messageElement) {
    //A la fin de l'animation supprimer le state
    const anim = messageElement.animate([
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(-200%)' }
    ],
      {
        duration: 1000,
        delay: 2000,
        fill: "both",
      },
    )
    anim.onfinish = () => {
      setState({ ...state, message: { text: null, type: null } })
      messageElement.remove();
    }

  }

  //Transformer le titre et la description au clic en input
  const title = document.querySelector('#todo__header__meta__title');
  const description = document.querySelector('#todo__header__meta__description');
  const isNewTodo = url.href.split('/')[3] ==! 'project' ;
  inputHandlerLogic([title, description])

  


  // each component from this example has this API returned
  return {
    node: shell.firstElementChild, // node is used by the render function of App to place the element on the page
    markup: shell.innerHTML, // markup is used by other components to compose the HTML into a bigger component
  };
}

export default Todo;