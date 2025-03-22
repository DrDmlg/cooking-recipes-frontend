

document.addEventListener("DOMContentLoaded", async function () {
    const container = document.getElementById("cardsContainer");

    // Получение всех рецептов из базы данных
    await (async () => {
        try {
            let response = await getJSONData('http://localhost:8080/cooking/recipes');
            console.log(response);

            // // Очистка контейнера перед добавлением новых карточек
            // container.innerHTML = "";

            createCard(response);
        } catch (error) {
            console.error("Ошибка не на вашей стороне. Подробности:", error);
        }
    })();
});

// Глобальная функция для создания карточек
function createCard(recipes) {
    const container = document.getElementById("cardsContainer");
    container.innerHTML = ""; // Очищаем контейнер перед добавлением новых блюд

    recipes.forEach((recipe, index) => {
        const card = document.createElement("div");
        card.classList.add("dishes-box");

        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <div class="dishes-image-container">
                <img src="../picture/${recipe.imagePath}" alt="${recipe.title}">
            </div>
            <button class="delete-btn" data-id="${recipe.id}"><b>X</b></button>
            <h2>${recipe.title}</h2>
            <p>${recipe.description}</p>
            <span>${recipe.content}</span>
        `;

        container.appendChild(card);

        const deleteButton = card.querySelector(".delete-btn");
        deleteButton.addEventListener("click", async (event) => {
            console.log("Button delete is clicked");

            const recipeId = event.target.dataset.id;

            try {
                let isDeleted = await deleteRecipe('http://localhost:8080/cooking/recipe/', recipeId);
                if (isDeleted) {
                    card.remove();
                }
            } catch (error) {
                console.error("Ошибка при удалении:", error);
            }
        });
    });
}

async function getRecipesByCategory(category) {
    // endpoint (Конечная точка)
    const response = await getJSONData(`http://localhost:8080/cooking/recipe/category/${category}`);
    console.log(response);

    createCard(response)
}

async function getJSONData(url) {

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Выявлена ошибка при выполнении сетевого запроса :(");
    }
    return await response.json();
}

/** Удаление рецепта из БД**/
async function deleteRecipe(url, recipeId) {
    const response = await fetch(url + recipeId, {
        method: "DELETE"
    });

    console.log(response);

    if (!response.ok) {
        throw new Error("Выявлена ошибка при выполнении сетевого запроса :(");
    } else {
        alert("Dish was deleted successfully");
        return true;
    }
}