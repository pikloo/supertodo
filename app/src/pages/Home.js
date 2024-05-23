import AuthStore from "../helpers/authStore";

const Home = (() => {

  const shell = document.querySelector('#app');
  shell.innerHTML = `
    <div class="home h-screen flex flex-col justify-center items-center">
      <div class="w-fit py-10 px-20 rounded bg-gray-300/30 backdrop-blur-sm flex flex-col gap-y-10">
        <div class="title-container flex flex-col items-center">
          <h1 class="text-3xl">Toudou</h1>
          <h2 class="text-2xl">Connexion</h2>
        </div>
        <form id="login" class="flex flex-col gap-y-4 items-center">
          <fieldset class="flex flex-col gap-y-2">
            <input type="text" name="email" placeholder="email">
            <input type="password" name="password" placeholder="********">
          </fieldset>
          <button type="submit">Se connecter</button>
        </form>
      </div>
    </div>
  `;

  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Utiliser la classe Security store pour faire appel à l'API
    AuthStore.login(e.target.elements.email.value, e.target.elements.password.value);

  });

  // each component from this example has this API returned
  return {
    node: shell.firstElementChild, // node is used by the render function of App to place the element on the page
    markup: shell.innerHTML, // markup is used by other components to compose the HTML into a bigger component
  };
});



export default Home;