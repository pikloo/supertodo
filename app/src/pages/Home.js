import userStore from "../helpers/userStore";

const Home = (() => {
  
  const shell = document.querySelector('#app');
  // notice the data-navigo attribute in the anchor tag.  this is used by navigo to bind event handlers to the element
  // inneHTML formulaire de connexion
  shell.innerHTML = `
    <div>
      <h2 class="text-xl">Connexion</h2>
      <form id="login">
      <input type="text" name="email" placeholder="email">
      <input type="password" name="password" placeholder="********">
      <button type="submit">Login</button>
      </form>
      <a href="tasty" data-navigo>Tasty</a>
    </div>
  `;

  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // console.log(e.target.elements.email.value);
    // console.log(e.target.elements.password.value);
    // Utiliser la classe user store pour faire appel à l'API
    userStore.login(e.target.elements.email.value, e.target.elements.password.value);
  });
  
  // each component from this example has this API returned
  return {
    node: shell.firstElementChild, // node is used by the render function of App to place the element on the page
    markup: shell.innerHTML, // markup is used by other components to compose the HTML into a bigger component
  };
});



export default Home;