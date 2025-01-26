// Импортируем стили
import "../scss/main.scss";
import "../scss/main.scss";
import "./modules/navigation";

// Для Hot Module Replacement
if (module.hot) {
    module.hot.accept();
}

// Настраиваем HMR для стилей
if (module.hot) {
    module.hot.accept("../scss/main.scss", function () {
        console.log("Styles updated");
    });
}
