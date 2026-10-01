/* =========================================
   ПРОГУЛКА КАЁКО
   ========================================= */


/* ---------- ДАННЫЕ ИГРЫ ---------- */

let playerName = "";
let score = 0;
let kittens = 0;
let photos = 0;

let playerX = 42;

let currentOutfit = "school";

let gameStarted = false;

let currentScreen = "nameScreen";


/* ---------- ЭЛЕМЕНТЫ ---------- */

const nameScreen = document.getElementById("nameScreen");
const gameScreen = document.getElementById("gameScreen");
const kittenScene = document.getElementById("kittenScene");
const photoScene = document.getElementById("photoScene");
const cafeScene = document.getElementById("cafeScene");
const resultScreen = document.getElementById("resultScreen");
const shopScreen = document.getElementById("shopScreen");
const rankingScreen = document.getElementById("rankingScreen");

const nameInput = document.getElementById("nameInput");
const nameError = document.getElementById("nameError");

const playerNameElement = document.getElementById("playerName");

const scoreElement = document.getElementById("score");
const gameScoreElement = document.getElementById("gameScore");
const shopScoreElement = document.getElementById("shopScore");

const kittenCountElement = document.getElementById("kittenCount");
const photoCountElement = document.getElementById("photoCount");

const resultKittens = document.getElementById("resultKittens");
const resultPhotos = document.getElementById("resultPhotos");
const resultScore = document.getElementById("resultScore");

const newRecord = document.getElementById("newRecord");

const kayoko = document.getElementById("kayoko");
const outfitEffect = document.getElementById("outfitEffect");

const gameMessage = document.getElementById("gameMessage");

const kitten = document.getElementById("kitten");
const photoPlace = document.getElementById("photoPlace");
const cafe = document.getElementById("cafe");


/* ---------- ЗАПРЕЩЁННЫЕ ИМЕНА ---------- */

/*
   Здесь можно добавлять свои слова.
*/

const forbiddenNames = [
    "admin",
    "administrator",
    "moderator",
    "moderator",
    "админ",
    "администратор",
    "модератор",
    "system",
    "система",
    "root",
    "null",
    "undefined"
];


function isNameAllowed(name) {

    const cleanName = name
        .toLowerCase()
        .trim();

    if (cleanName.length < 3) {
        return false;
    }

    if (forbiddenNames.includes(cleanName)) {
        return false;
    }

    return true;
}


/* ---------- ПЕРЕКЛЮЧЕНИЕ ЭКРАНОВ ---------- */

function showScreen(screen) {

    const screens = document.querySelectorAll(".screen");

    screens.forEach(function(item) {
        item.classList.remove("active");
    });

    screen.classList.add("active");

    currentScreen = screen.id;
}


/* ---------- НАЧАЛО ---------- */

document.getElementById("startButton").addEventListener("click", startGame);

nameInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        startGame();
    }

});


function startGame() {

    const enteredName = nameInput.value.trim();

    if (!isNameAllowed(enteredName)) {

        nameError.textContent =
            "Это имя нельзя использовать. Выбери другое имя.";

        return;
    }

    nameError.textContent = "";

    playerName = enteredName;

    localStorage.setItem(
        "kayokoPlayerName",
        playerName
    );

    resetGameStats();

    playerNameElement.textContent = playerName;

    document.getElementById("playerTag").textContent =
        "Каёко";

    gameStarted = true;

    showScreen(gameScreen);

    updateUI();

    gameMessage.textContent =
        "Прогулка началась! Найди котёнка 🐈";
}


/* ---------- ЗАГРУЗКА ИМЕНИ ---------- */

const savedName = localStorage.getItem(
    "kayokoPlayerName"
);

if (savedName) {

    nameInput.value = savedName;

}


/* ---------- СБРОС ПРОГУЛКИ ---------- */

function resetGameStats() {

    score = 0;
    kittens = 0;
    photos = 0;

    playerX = 42;

    kayoko.style.left = playerX + "%";

    currentOutfit = localStorage.getItem(
        "kayokoCurrentOutfit"
    ) || "school";

    applyOutfit();

}


/* ---------- ОБНОВЛЕНИЕ UI ---------- */

function updateUI() {

    scoreElement.textContent = score;

    gameScoreElement.textContent = score;

    kittenCountElement.textContent = kittens;

    photoCountElement.textContent = photos;

    shopScoreElement.textContent =
        getTotalCoins();

}


/* ---------- ОЧКИ ---------- */

function addScore(amount) {

    score += amount;

    updateUI();

}


/*
   Все заработанные очки сохраняются.
*/

function getTotalCoins() {

    const savedCoins =
        Number(localStorage.getItem("kayokoCoins")) || 0;

    return savedCoins + score;

}


/* ---------- ДВИЖЕНИЕ ---------- */

function moveKayoko(direction) {

    if (!gameStarted) {
        return;
    }

    if (currentScreen !== "gameScreen") {
        return;
    }

    if (direction === "left") {
        playerX -= 4;
    }

    if (direction === "right") {
        playerX += 4;
    }

    if (playerX < 5) {
        playerX = 5;
    }

    if (playerX > 82) {
        playerX = 82;
    }

    kayoko.style.left = playerX + "%";

    checkNearbyObjects();
}


document
    .getElementById("leftButton")
    .addEventListener("click", function() {
        moveKayoko("left");
    });


document
    .getElementById("rightButton")
    .addEventListener("click", function() {
        moveKayoko("right");
    });


/* ---------- КЛАВИАТУРА ---------- */

document.addEventListener("keydown", function(event) {

    if (currentScreen !== "gameScreen") {
        return;
    }

    if (event.key === "ArrowLeft") {
        moveKayoko("left");
    }

    if (event.key === "ArrowRight") {
        moveKayoko("right");
    }

});


/* ---------- ПРОВЕРКА ОБЪЕКТОВ ---------- */

function checkNearbyObjects() {

    /*
       У нас простая система расстояния по горизонтали.
    */

    const kittenPosition = 67;
    const photoPosition = 15;
    const cafePosition = 76;


    if (Math.abs(playerX - kittenPosition) < 7) {

        gameMessage.textContent =
            "🐈 Ты рядом с котёнком! Нажми на него.";

    }
    else if (Math.abs(playerX - photoPosition) < 7) {

        gameMessage.textContent =
            "📸 Здесь можно сделать красивое фото.";

    }
    else if (Math.abs(playerX - cafePosition) < 7) {

        gameMessage.textContent =
            "☕ Рядом находится кафе.";

    }
    else {

        gameMessage.textContent =
            "Продолжай прогулку по Токио! 💙";

    }

}


/* ---------- КОТЁНОК ---------- */

kitten.addEventListener("click", function() {

    if (currentScreen !== "gameScreen") {
        return;
    }

    kittens++;

    showKittenScene();

});


function showKittenScene() {

    showScreen(kittenScene);

    const randomNumber =
        Math.floor(Math.random() * 3);

    if (randomNumber === 0) {

        document.getElementById("kittenSceneTitle")
            .textContent =
            "Какой милый котёнок! 🥹";

        document.getElementById("kittenSceneText")
            .textContent =
            "Каёко присела рядом и осторожно погладила котёнка.";

    }

    if (randomNumber === 1) {

        document.getElementById("kittenSceneTitle")
            .textContent =
            "Ой, ты сам подошёл! 🐈";

        document.getElementById("kittenSceneText")
            .textContent =
            "Котёнок подошёл к Каёко, и она с улыбкой погладила его.";

    }

    if (randomNumber === 2) {

        document.getElementById("kittenSceneTitle")
            .textContent =
            "Тихий момент 💙";

        document.getElementById("kittenSceneText")
            .textContent =
            "Каёко немного посидела рядом с котёнком, прежде чем продолжить прогулку.";

    }

}


document
    .getElementById("finishKittenScene")
    .addEventListener("click", function() {

        addScore(20);

        showScreen(gameScreen);

        gameMessage.textContent =
            "🐈 +20 ⭐ Котёнок был очень милым!";

        updateUI();

    });


/* ---------- ФОТО ---------- */

photoPlace.addEventListener("click", function() {

    if (currentScreen !== "gameScreen") {
        return;
    }

    photos++;

    showScreen(photoScene);

});


document
    .getElementById("finishPhotoScene")
    .addEventListener("click", function() {

        addScore(30);

        showScreen(gameScreen);

        gameMessage.textContent =
            "📸 +30 ⭐ Фотография сохранена!";

        updateUI();

    });


/* ---------- КАФЕ ---------- */

cafe.addEventListener("click", function() {

    if (currentScreen !== "gameScreen") {
        return;
    }

    showScreen(cafeScene);

    document.getElementById("cafeMessage").textContent =
        "";

});


document
    .getElementById("musicButton")
    .addEventListener("click", function() {

        addScore(10);

        document.getElementById("cafeMessage").textContent =
            "🎧 Каёко надела наушники и немного послушала музыку. +10 ⭐";

    });


document
    .getElementById("restButton")
    .addEventListener("click", function() {

        addScore(15);

        document.getElementById("cafeMessage").textContent =
            "☕ Каёко отдохнула у окна. +15 ⭐";

    });


document
    .getElementById("leaveCafe")
    .addEventListener("click", function() {

        showScreen(gameScreen);

        gameMessage.textContent =
            "🚶 Каёко снова вышла на улицу.";

    });


/* ---------- КНОПКА ДЕЙСТВИЯ ---------- */

document
    .getElementById("actionButton")
    .addEventListener("click", function() {

        if (currentScreen !== "gameScreen") {
            return;
        }

        checkNearbyObjects();

        if (Math.abs(playerX - 67) < 7) {

            kitten.click();

        }
        else if (Math.abs(playerX - 15) < 7) {

            photoPlace.click();

        }
        else if (Math.abs(playerX - 76) < 7) {

            cafe.click();

        }
        else {

            gameMessage.textContent =
                "Здесь пока нечего делать. Попробуй пройти дальше.";

        }

    });


/* ---------- ЗАВЕРШЕНИЕ ПРОГУЛКИ ---------- */


/*
   Можно закончить прогулку двойным нажатием на Каёко.
*/

kayoko.addEventListener("dblclick", finishGame);


function finishGame() {

    if (currentScreen !== "gameScreen") {
        return;
    }

    saveCoins();

    saveRanking();

    resultKittens.textContent = kittens;

    resultPhotos.textContent = photos;

    resultScore.textContent = score;

    checkRecord();

    showScreen(resultScreen);

}


/* ---------- СОХРАНЕНИЕ ОЧКОВ ---------- */

function saveCoins() {

    const oldCoins =
        Number(localStorage.getItem("kayokoCoins")) || 0;

    localStorage.setItem(
        "kayokoCoins",
        oldCoins + score
    );

}


/* ---------- РЕКОРД ---------- */

function checkRecord() {

    const oldRecord =
        Number(localStorage.getItem("kayokoRecord")) || 0;

    if (score > oldRecord) {

        localStorage.setItem(
            "kayokoRecord",
            score
        );

        newRecord.style.display = "block";

    }
    else {

        newRecord.style.display = "none";

    }

}


/* ---------- РЕЙТИНГ ---------- */

function getRanking() {

    try {

        return JSON.parse(
            localStorage.getItem("kayokoRanking")
        ) || [];

    }
    catch {

        return [];

    }

}


function saveRanking() {

    const ranking = getRanking();

    ranking.push({
        name: playerName,
        score: score,
        kittens: kittens
    });

    ranking.sort(function(a, b) {

        return b.score - a.score;

    });

    /*
       Оставляем только 20 лучших результатов.
    */

    const top20 = ranking.slice(0, 20);

    localStorage.setItem(
        "kayokoRanking",
        JSON.stringify(top20)
    );

}


/* ---------- ПОКАЗ РЕЙТИНГА ---------- */

function showRanking() {

    const ranking = getRanking();

    const rankingList =
        document.getElementById("rankingList");

    rankingList.innerHTML = "";

    if (ranking.length === 0) {

        rankingList.innerHTML =
            "<p>Пока нет результатов.</p>";

        return;

    }


    ranking.forEach(function(player, index) {

        const row =
            document.createElement("div");

        row.className = "ranking-row";


        if (
            player.name.toLowerCase() ===
            playerName.toLowerCase()
        ) {

            row.classList.add("current");

        }


        row.innerHTML = `
            <div class="ranking-place">
                ${index + 1}
            </div>

            <div>
                ${escapeHTML(player.name)}
            </div>

            <div>
                ⭐ ${player.score}
            </div>
        `;


        rankingList.appendChild(row);

    });

}


/* ---------- ЗАЩИТА ИМЕНИ ---------- */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* ---------- КНОПКИ РЕЗУЛЬТАТОВ ---------- */

document
    .getElementById("shopButton")
    .addEventListener("click", function() {

        renderShop();

        showScreen(shopScreen);

    });


document
    .getElementById("rankingButton")
    .addEventListener("click", function() {

        showRanking();

        showScreen(rankingScreen);

    });


document
    .getElementById("againButton")
    .addEventListener("click", function() {

        resetGameStats();

        gameStarted = true;

        showScreen(gameScreen);

        updateUI();

        gameMessage.textContent =
            "Новая прогулка началась! 💙";

    });


/* ---------- НАЗАД ИЗ МАГАЗИНА ---------- */

document
    .getElementById("shopBackButton")
    .addEventListener("click", function() {

        showScreen(resultScreen);

        updateUI();

    });


/* ---------- НАЗАД ИЗ РЕЙТИНГА ---------- */

document
    .getElementById("rankingBackButton")
    .addEventListener("click", function() {

        showScreen(resultScreen);

    });


/* =========================================
   МАГАЗИН
   ========================================= */

const outfits = [

    {
        id: "school",
        name: "Школьная форма",
        icon: "🎒",
        price: 0,
        description: "Обычный школьный образ Каёко."
    },

    {
        id: "cafe",
        name: "Кафе",
        icon: "☕",
        price: 100,
        description: "Уютный повседневный наряд."
    },

    {
        id: "spring",
        name: "Весенний",
        icon: "🌸",
        price: 250,
        description: "Лёгкий наряд для прогулок."
    },

    {
        id: "rain",
        name: "Дождливый день",
        icon: "🌧️",
        price: 350,
        description: "Для прогулок под дождём."
    },

    {
        id: "music",
        name: "Музыкальный",
        icon: "🎧",
        price: 500,
        description: "Идеальный образ для прогулки с музыкой."
    },

    {
        id: "night",
        name: "Токио ночью",
        icon: "🌃",
        price: 700,
        description: "Вечерний наряд для ночного Токио."
    },

    {
        id: "cat",
        name: "Кошачий",
        icon: "🐈",
        price: 900,
        description: "Милый наряд кошечки."
    },

    {
        id: "star",
        name: "Звёздная Каёко",
        icon: "🌌",
        price: 1500,
        description: "Особый наряд с атмосферой ночного неба."
    },

    {
        id: "maid",
        name: "Горничная Каёко",
        icon: "👗",
        price: 2000,
        description: "Особый наряд горничной."
    }

];


function getOwnedOutfits() {

    try {

        return JSON.parse(
            localStorage.getItem("kayokoOwnedOutfits")
        ) || ["school"];

    }
    catch {

        return ["school"];

    }

}


function saveOwnedOutfits(outfitsArray) {

    localStorage.setItem(
        "kayokoOwnedOutfits",
        JSON.stringify(outfitsArray)
    );

}


function renderShop() {

    const list =
        document.getElementById("outfitList");

    list.innerHTML = "";

    const owned = getOwnedOutfits();

    const totalCoins = getTotalCoins();

    shopScoreElement.textContent =
        totalCoins;


    outfits.forEach(function(outfit) {

        const card =
            document.createElement("div");

        card.className = "outfit-card";


        const isOwned =
            owned.includes(outfit.id);


        const isCurrent =
            currentOutfit === outfit.id;


        let buttonText = "Купить";


        if (isCurrent) {

            buttonText = "Надето";

        }
        else if (isOwned) {

            buttonText = "Надеть";

        }


        card.innerHTML = `

            <div class="outfit-icon">
                ${outfit.icon}
            </div>

            <h3>
                ${outfit.name}
            </h3>

            <p>
                ${outfit.description}
            </p>

            <div class="outfit-price">
                ⭐ ${outfit.price}
            </div>

            <button
                data-outfit="${outfit.id}"
                ${isCurrent ? "disabled" : ""}
            >
                ${buttonText}
            </button>

        `;


        list.appendChild(card);

    });


    const buttons =
        list.querySelectorAll("button");


    buttons.forEach(function(button) {

        button.addEventListener("click", function() {

            const outfitId =
                button.dataset.outfit;

            buyOrWearOutfit(outfitId);

        });

    });

}


function buyOrWearOutfit(outfitId) {

    const outfit =
        outfits.find(function(item) {

            return item.id === outfitId;

        });


    if (!outfit) {
        return;
    }


    let owned =
        getOwnedOutfits();


    /*
       Если уже куплен — просто надеваем.
    */

    if (owned.includes(outfitId)) {

        currentOutfit = outfitId;

        localStorage.setItem(
            "kayokoCurrentOutfit",
            currentOutfit
        );

        applyOutfit();

        renderShop();

        return;

    }


    /*
       Проверяем деньги.
    */

    const totalCoins =
        getTotalCoins();


    if (totalCoins < outfit.price) {

        alert(
            "Не хватает очков! ⭐\n\n" +
            "Нужно: " +
            outfit.price +
            "\nУ тебя: " +
            totalCoins
        );

        return;

    }


    /*
       Покупка.
    */

    const remaining =
        totalCoins - outfit.price;


    localStorage.setItem(
        "kayokoCoins",
        remaining
    );


    owned.push(outfitId);

    saveOwnedOutfits(owned);


    currentOutfit = outfitId;

    localStorage.setItem(
        "kayokoCurrentOutfit",
        currentOutfit
    );


    applyOutfit();

    renderShop();


    gameMessage.textContent =
        "👕 Куплен новый наряд: " +
        outfit.name;

}


/* ---------- ПРИМЕНЕНИЕ НАРЯДА ---------- */

function applyOutfit() {

    kayoko.classList.remove(
        "outfit-cat",
        "outfit-star",
        "outfit-maid"
    );


    if (currentOutfit === "cat") {

        kayoko.classList.add(
            "outfit-cat"
        );

    }


    if (currentOutfit === "star") {

        kayoko.classList.add(
            "outfit-star"
        );

    }


    if (currentOutfit === "maid") {

        kayoko.classList.add(
            "outfit-maid"
        );

    }

}


/* =========================================
   АВТОСОХРАНЕНИЕ
   ========================================= */

window.addEventListener("beforeunload", function() {

    localStorage.setItem(
        "kayokoCurrentOutfit",
        currentOutfit
    );

});
