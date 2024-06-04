export const getUserThemeSettings =  (localStorageTheme, systemSettingDark) => {
    if (localStorageTheme !== null) {
      return localStorageTheme;
    }
    if (systemSettingDark.matches) {
      return "dark";
    }
    return "light";
}

export const updateThemeButton = ({themeButton, isDark, icon}) =>{
    const newTheme = isDark ? "light" : "dark";
    const label =
      newTheme === "light" ? "Passer au thème light" : "Passer au thème sombre";
      themeButton.dataset.themeToggle = themeButton.dataset.themeToggle === "light" ? "dark" : "light";
      themeButton.ariaChecked = isDark ? "true" : "false"
    let themeButtonCursor = document.querySelector("#app-actions__theme__cursor");
    themeButtonCursor.animate(
      [
        { alignSelf: `${newTheme === "light" ? "flex-start" : "flex-end"}` },
        { alignSelf: `${newTheme === "light" ? "flex-end" : "flex-start"}` },
      ],
      {
        duration: 300,
        iterations: 1,
        fill: "forwards",
        easing: "ease-in-out",
        delay: 50
      }
    ).onfinish = () => {
      themeButtonCursor.innerHTML = icon;
      themeButton.setAttribute("aria-label", label);
    };

}