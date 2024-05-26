import todoStore from "../helpers/todoStore";

const Todo = () => {

  //Récupérer le dernier morceau de l'url et appeler la todo avec l'id récupéré
  const url = new URL(window.location.href);

  const id = url.pathname.split('/')[1];
  let todo = null;
  if (id) {
    todo = todoStore.getTodo(id);
  }

  const shell = document.querySelector('#app');
  shell.innerHTML = `
    <div id="todo" data-new-todo>
      <header id="todo__header" class="box">
        <h1 id="todo__header__title">Nouveau projet</h1>
        <p id="todo__header__description">Description du projet</p>
      </header>
      <main id="todo__container">
      <aside id="todo__container__sidebar" class="box">
        <p>Aucun collaborateur pour l'instant</p>
      </aside>
      <main id="todo__container__tasks">
        <div id="todo__container__tasks__todo" class="box">
            <h2>A faire</h2>
            <input type="text" name="newTaskTodo" placeholder="Mettre en place un certificat SSL..." />
        </div>
        <div id="todo__container__tasks__in-progress" class="box">
            <h2>En cours</h2>
            <input type="text" name="newTaskInProgress" placeholder="Tester la connexion..." />
        </div>
        <div id="todo__container__tasks__done" class="box">
            <h2>Terminées</h2>
            <input type="text" name="newTaskDone" placeholder="Créer la base de données..." />
        </div>
      </main>
      
      </main>
      
    </div>
    `;

  //Transformer le titre et la description au clic en input
  const title = document.querySelector('#todo__header__title');
  const description = document.querySelector('#todo__header__description');
  inputHandlerLogic([title, description])

  function inputHandlerLogic(elements) {
    elements.forEach(element => {
      element.addEventListener('click', () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('name', element.id.split('__')[2]);
        input.setAttribute('value', element.textContent);
        input.setAttribute('id', element.id);
        element.replaceWith(input);
        input.focus();
        //Au blur rendre à l'élément son état précédent
        input.addEventListener('blur', () => {
          input.replaceWith(element);
          if (input.id.split('__')[2] === "title" && input.value.length > 0 && input.value !== element.textContent) {
            const todo = document.querySelector('#todo');
            todo.removeAttribute("data-new-todo");
          }
          element.textContent = input.value.length > 0 ? input.value : element.textContent;
        });
      });
    });

    //Ajouter la tâche au clic en créeant un list sous l'input
    const inputs = document.querySelectorAll('#todo__container__tasks input')
    inputs.forEach(input => {
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

           task.innerHTML = `
              <p>${input.value}</p>
              <div class="todo__container__tasks__list__item__actions">
              </div>
            `;
          list.prepend(task);
          container.appendChild(list);
          input.value = '';
          input.setAttribute('placeholder', 'Nouvelle tâche...')
        }
      })
    })

  }


  // each component from this example has this API returned
  return {
    node: shell.firstElementChild, // node is used by the render function of App to place the element on the page
    markup: shell.innerHTML, // markup is used by other components to compose the HTML into a bigger component
  };
}

export default Todo;