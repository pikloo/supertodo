import Button from "../components/Button";
import AuthStore from "../helpers/authStore";

const Home = (() => {

  const shell = document.querySelector('#app');
  shell.innerHTML = `
    <div id="home">
      <div id="home__container" class="box">
        <div id="home__container__title">
          <h1 class="text-3xl">Toudou</h1>
          <h2 class="text-2xl">Connexion</h2>
        </div>
        <form id="home__container__form-login">
          <fieldset>
            <input type="text" name="email" placeholder="email">
            <input type="password" name="password" placeholder="********">
          </fieldset>
          ${Button({type: "submit", text: "Se connecter"})}
        </form>
      </div>
    </div>
  `;

  const form = document.querySelector('#home__container__form-login');
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