document.addEventListener("DOMContentLoaded", () => {
    // Находим элементы
    const burger = document.querySelector(".burger");
    const nav = document.querySelector(".nav");

    // Проверяем наличие элементов и добавляем обработчик
    if (burger && nav) {
        burger.onclick = (e) => {
            e.preventDefault();
            burger.classList.toggle("burger--active");
            nav.classList.toggle("nav--active");
        };

        // Закрываем меню при клике вне его
        document.addEventListener("click", (e) => {
            if (!nav.contains(e.target) && !burger.contains(e.target)) {
                burger.classList.remove("burger--active");
                nav.classList.remove("nav--active");
            }
        });

        // Предотвращаем закрытие при клике внутри меню
        nav.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    }
});
