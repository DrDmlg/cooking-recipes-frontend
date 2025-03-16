document.querySelector("form").addEventListener("submit", async function (event) {
    event.preventDefault();

    let formData = new FormData();
    let fileInput = document.querySelector("#recipe-image");

    if (fileInput.files.length === 0) {
        alert("Please select an image.");
        return;
    }

    formData.append("file", fileInput.files[0]);

    try {

        let savedImagePath = await uploadImage();

        await buildJson(savedImagePath);

    } catch (error) {
        console.error("Ошибка при загрузке файла или отправке JSON:", error);
    }

    async function uploadImage() {
        // Отправляем файл
        let uploadResponse = await fetch("http://localhost:8080/attachment/image", {
            method: "POST",
            body: formData
        });

        if (!uploadResponse.ok) {
            alert("Error of upload image.");
            return;
        }

        let filePath = await uploadResponse.text(); // Получаем путь к файлу от сервера
        console.log("File upload success:", filePath);

        return filePath;
    }

    async function buildJson(savedImagePath) {
        // Теперь собираем JSON, используя реальный путь
        let jsonData = {
            title: document.querySelector("[name=title]").value,
            description: document.querySelector("[name=description]").value,
            content: document.querySelector("[name=content]").value,
            imagePath: savedImagePath // Используем реальный путь к файлу
        };

        // Отправляем JSON
        let response = await fetch("http://localhost:8080/cooking/recipe", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(jsonData),
        });

        if (response.status) {
            alert("Recipe added successfully.");
        } else {
            alert("Error adding recipe.");
        }
    }
});