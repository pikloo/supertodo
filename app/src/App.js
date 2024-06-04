import { getUserThemeSettings, updateThemeButton } from "./helpers/themeHandler";

export default function App() {
  const appEl = document.getElementById('app');

  const theme = localStorage.getItem("theme");
  const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");

  let currentTheme = getUserThemeSettings(theme, systemSettingDark);
  document.querySelector("html").setAttribute("class", currentTheme);

  return {
    render(component) {
      // iterate through the children of the root node and delete them all
      while (appEl.firstChild) {
        appEl.removeChild(appEl.firstChild);
      }
      // then, add the new node as a child to the root node
      appEl.appendChild(component().node);
      // navigo's method to add handlers to dynamically generated anchor elements
      // Router.updatePageLinks();

      if (component.name !== 'Home') {
        //Chargement de la bonne îcone dès qu'on est sur une page
        let themeButton = document.querySelector("button#app-actions__theme");
        updateThemeButton({
          themeButton,
          isDark: currentTheme === "dark",
          icon: currentTheme === "dark" ? `<i class="fa-solid fa-moon"></i>` : `<i class="fa-solid fa-sun"></i>`
        })
        
        themeButton.addEventListener("click", (e) => {
          let button = e.currentTarget;
          button.ariaChecked= button.dataset.themeToggle === "dark" ? "true" : "false"
          const newTheme = currentTheme === "dark" ? "light" : "dark";
          localStorage.setItem("theme", newTheme);
          updateThemeButton({
            themeButton: button,
            isDark: newTheme === "dark",
            icon: newTheme === "dark" ? `<i class="fa-solid fa-moon"></i>` : `<i class="fa-solid fa-sun"></i>`,
          });
          document.querySelector("html").setAttribute("class", newTheme);
          currentTheme = newTheme;
        });


      }
    }
  }
}