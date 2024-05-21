import AuthStore from "../helpers/authStore";

const Dashboard = (() => {
  
  const shell = document.querySelector('#app');
  // notice the data-navigo attribute in the anchor tag.  this is used by navigo to bind event handlers to the element
  // inneHTML formulaire de connexion
  shell.innerHTML = `
    <div>
      <h2 class="text-xl">Tableau de bord</h2>

      <a href="tasty" data-navigo>Tasty</a>
    </div>
  `;

  
  
  // each component from this example has this API returned
  return {
    node: shell.firstElementChild, // node is used by the render function of App to place the element on the page
    markup: shell.innerHTML, // markup is used by other components to compose the HTML into a bigger component
  };
});



export default Dashboard;