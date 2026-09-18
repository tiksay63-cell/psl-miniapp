const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();


const photoInput =
    document.getElementById("photoInput");

const preview =
    document.getElementById("preview");

const analyzeButton =
    document.getElementById("analyzeButton");

const premiumButton =
    document.getElementById("premiumButton");

const resultCard =
    document.getElementById("resultCard");

const result =
    document.getElementById("result");


/*
============================================================
ПРЕДПРОСМОТР ФОТО
============================================================
*/

photoInput.addEventListener(
    "change",
    function () {

        const file =
            photoInput.files[0];

        if (!file) {
            return;
        }

        const reader =
            new FileReader();

        reader.onload =
            function (event) {

                preview.src =
                    event.target.result;

                preview.style.display =
                    "block";
            };

        reader.readAsDataURL(file);
    }
);


/*
============================================================
ЗАГРУЗКА ФОТО НА СЕРВЕР
============================================================
*/

analyzeButton.addEventListener(
    "click",
    async function () {

        const file =
            photoInput.files[0];

        if (!file) {

            tg.showAlert(
                "Сначала выберите фотографию."
            );

            return;
        }


        analyzeButton.disabled =
            true;

        analyzeButton.textContent =
            "⏳ Загружаю...";


        try {

            const formData =
                new FormData();

            formData.append(
                "file",
                file
            );


            const response =
                await fetch(
                    "/api/upload",
                    {
                        method: "POST",

                        headers: {
                            "X-Telegram-Init-Data":
                                tg.initData
                        },

                        body: formData
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Ошибка загрузки"
                );
            }


            resultCard.classList.remove(
                "hidden"
            );


            result.innerHTML = `
                <p>
                    ✅ Фотография успешно загружена.
                </p>

                <p>
                    Сервер получил изображение
                    и сохранил его.
                </p>
            `;


            tg.HapticFeedback.notificationOccurred(
                "success"
            );


        } catch (error) {

            console.error(
                error
            );

            tg.showAlert(
                "❌ Ошибка: " +
                error.message
            );

        } finally {

            analyzeButton.disabled =
                false;

            analyzeButton.textContent =
                "🔎 Анализировать";
        }
    }
);


/*
============================================================
PREMIUM
============================================================
*/

premiumButton.addEventListener(
    "click",
    function () {

        tg.showAlert(
            "Оплата через Telegram Stars будет подключена следующим этапом."
        );
    }
);