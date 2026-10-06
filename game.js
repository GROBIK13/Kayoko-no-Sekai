// ==========================================
// СУДЗУКО КАЁКО — TOKYO 3D
// Полная версия game.js
// ==========================================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfe2ec);
scene.fog = new THREE.Fog(0xbfe2ec, 70, 210);

const camera = new THREE.PerspectiveCamera(
  55,
  innerWidth / innerHeight,
  0.1,
  500
);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

const clock = new THREE.Clock();

const keys = {};
const obstacles = [];
const spots = [];

let moving = false;
let walkTime = 0;

// ==========================================
// СОХРАНЕНИЕ
// ==========================================

const saved = JSON.parse(
  localStorage.getItem("kayokoTokyo3D") || "null"
);

const state = saved || {
  score: 0,
  cats: 0,
  photos: 0,
  coins: 0
};

// ==========================================
// СВЕТ
// ==========================================

const ambient = new THREE.HemisphereLight(
  0xeafaff,
  0x6f8e73,
  2.4
);

scene.add(ambient);

const sun = new THREE.DirectionalLight(
  0xffffff,
  2.4
);

sun.position.set(35, 70, 25);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);

scene.add(sun);

// ==========================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ==========================================

function addBox(
  w,
  h,
  d,
  color,
  x,
  y,
  z,
  obstacle = false
) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.88
    })
  );

  mesh.position.set(x, y, z);

  mesh.castShadow = true;
  mesh.receiveShadow = true;

  scene.add(mesh);

  if (obstacle) {
    obstacles.push({
      x,
      z,
      w: w + 1.2,
      d: d + 1.2
    });
  }

  return mesh;
}

// ==========================================
// НАДПИСИ
// ==========================================

function addLabel(text, x, y, z) {
  const canvas = document.createElement("canvas");

  canvas.width = 640;
  canvas.height = 140;

  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "rgba(255,255,255,.92)";

  ctx.beginPath();
  ctx.roundRect(
    8,
    8,
    624,
    124,
    28
  );

  ctx.fill();

  ctx.fillStyle = "#31566d";

  ctx.font = "bold 38px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(
    text,
    320,
    70
  );

  const texture = new THREE.CanvasTexture(canvas);

  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      transparent: true
    })
  );

  sprite.position.set(
    x,
    y,
    z
  );

  sprite.scale.set(
    12,
    2.65,
    1
  );

  scene.add(sprite);
}

// ==========================================
// ЗДАНИЯ
// ==========================================

function building(
  name,
  x,
  z,
  w,
  d,
  color
) {
  addBox(
    w,
    7,
    d,
    color,
    x,
    3.5,
    z,
    true
  );

  addBox(
    w + 0.3,
    0.45,
    d + 0.3,
    0x8ca5ad,
    x,
    7.25,
    z
  );

  addLabel(
    name,
    x,
    9,
    z
  );
}

// ==========================================
// ЗЕМЛЯ
// ==========================================

addBox(
  260,
  0.1,
  260,
  0xb8d5ac,
  0,
  0,
  0
);

// ==========================================
// ДОРОГИ
// ==========================================

addBox(
  260,
  0.12,
  18,
  0x68747b,
  0,
  0.06,
  0
);

addBox(
  18,
  0.12,
  260,
  0x68747b,
  0,
  0.065,
  0
);

addBox(
  18,
  0.12,
  120,
  0x68747b,
  0,
  0.065,
  -70
);

addBox(
  120,
  0.12,
  18,
  0x68747b,
  0,
  0.065,
  58
);

// ==========================================
// ТРОТУАРЫ
// ==========================================

for (const z of [-12, 12]) {
  addBox(
    260,
    0.16,
    5,
    0xd8d0c3,
    0,
    0.13,
    z
  );
}

for (const x of [-12, 12]) {
  addBox(
    5,
    0.16,
    260,
    0xd8d0c3,
    x,
    0.13,
    0
  );
}

// ==========================================
// ЗДАНИЯ ГОРОДА
// ==========================================

building(
  "🏫 Академия Мидзухана",
  -45,
  -38,
  34,
  25,
  0xd9e5ef
);

building(
  "☕ Кафе",
  -43,
  34,
  23,
  18,
  0xe8c8b9
);

building(
  "👗 Магазин одежды",
  43,
  -34,
  27,
  21,
  0xd9c4e2
);

building(
  "🚉 Станция",
  44,
  35,
  32,
  21,
  0xc9d5d0
);

building(
  "🏠 Жилой квартал",
  -77,
  10,
  20,
  28,
  0xd8d0c7
);

building(
  "🏪 Конбини",
  -77,
  -34,
  18,
  18,
  0xe2d1a5
);

building(
  "🎧 Музыкальный магазин",
  76,
  -2,
  22,
  24,
  0xc5d5e8
);

building(
  "📚 Книжный",
  76,
  38,
  21,
  19,
  0xe0c8c0
);

// ==========================================
// ПАРК
// ==========================================

addBox(
  47,
  0.18,
  40,
  0x99c98e,
  -25,
  0.15,
  74
);

addLabel(
  "🌸 Сакура-парк",
  -25,
  4.5,
  74
);

for (let i = 0; i < 22; i++) {
  const x = -46 + Math.random() * 42;
  const z = 56 + Math.random() * 36;

  // Ствол
  addBox(
    1.1,
    3,
    1.1,
    0x75523c,
    x,
    1.5,
    z
  );

  // Крона
  const crown = new THREE.Mesh(
    new THREE.SphereGeometry(
      2.5,
      12,
      10
    ),
    new THREE.MeshStandardMaterial({
      color: 0xf2b6cb
    })
  );

  crown.position.set(
    x,
    5,
    z
  );

  crown.castShadow = true;

  scene.add(crown);
}

// ==========================================
// КАНАЛ
// ==========================================

const river = new THREE.Mesh(
  new THREE.PlaneGeometry(
    260,
    17
  ),
  new THREE.MeshStandardMaterial({
    color: 0x6fbdd0,
    transparent: true,
    opacity: 0.92
  })
);

river.rotation.x = -Math.PI / 2;

river.position.set(
  0,
  0.04,
  102
);

scene.add(river);

addLabel(
  "🌊 Канал",
  -68,
  2,
  102
);

// ==========================================
// ФОНАРИ
// ==========================================

for (let i = -110; i <= 110; i += 22) {
  for (const z of [-10, 10]) {

    addBox(
      0.25,
      4.8,
      0.25,
      0x48525a,
      i,
      2.4,
      z
    );

    const lamp = new THREE.Mesh(
      new THREE.SphereGeometry(
        0.55,
        10,
        8
      ),
      new THREE.MeshStandardMaterial({
        color: 0xffe9a8,
        emissive: 0x5a4300,
        emissiveIntensity: 0.7
      })
    );

    lamp.position.set(
      i,
      5,
      z
    );

    scene.add(lamp);
  }
}

// ==========================================
// ИНТЕРАКТИВНЫЕ МЕСТА
// ==========================================

function spot(type, x, z) {
  const group = new THREE.Group();

  const mat =
    type === "cat"
      ? 0xf1bf86
      : 0xffd873;

  const marker = new THREE.Mesh(
    new THREE.SphereGeometry(
      1.1,
      16,
      12
    ),
    new THREE.MeshStandardMaterial({
      color: mat,
      emissive: mat,
      emissiveIntensity: 0.12
    })
  );

  marker.position.y = 1.1;

  group.add(marker);

  group.position.set(
    x,
    0,
    z
  );

  scene.add(group);

  spots.push({
    type,
    x,
    z,
    group
  });
}

// Котёнок
spot(
  "cat",
  -8,
  32
);

// Фототочка
spot(
  "photo",
  31,
  -8
);

// ==========================================
// КАЁКО
// ==========================================

const kayoko = new THREE.Group();

// Тело
const body = new THREE.Mesh(
  new THREE.CapsuleGeometry(
    0.68,
    1.45,
    5,
    10
  ),
  new THREE.MeshStandardMaterial({
    color: 0x31566d
  })
);

body.position.y = 1.35;
body.castShadow = true;

kayoko.add(body);

// Голова
const head = new THREE.Mesh(
  new THREE.SphereGeometry(
    0.78,
    18,
    14
  ),
  new THREE.MeshStandardMaterial({
    color: 0xffe4d5
  })
);

head.position.y = 2.65;
head.castShadow = true;

kayoko.add(head);

// Волосы
const hair = new THREE.Mesh(
  new THREE.SphereGeometry(
    0.86,
    18,
    14
  ),
  new THREE.MeshStandardMaterial({
    color: 0xf2f4f7
  })
);

hair.scale.set(
  1.04,
  0.74,
  1.04
);

hair.position.set(
  0,
  2.92,
  -0.06
);

hair.castShadow = true;

kayoko.add(hair);

// ==========================================
// СИНИЙ БАНТ КАЁКО
// ==========================================

const bowL = addBox(
  0.48,
  0.16,
  0.12,
  0x355da8,
  -0.32,
  2.22,
  -0.72
);

const bowR = addBox(
  0.48,
  0.16,
  0.12,
  0x355da8,
  0.32,
  2.22,
  -0.72
);

kayoko.add(bowL);
kayoko.add(bowR);

// ==========================================
// ЧЁРНАЯ ЗАКОЛКА-КРЕСТИК
// ==========================================

const clipVertical = new THREE.Mesh(
  new THREE.BoxGeometry(
    0.08,
    0.38,
    0.08
  ),
  new THREE.MeshStandardMaterial({
    color: 0x171717
  })
);

clipVertical.position.set(
  0.62,
  3.12,
  -0.38
);

clipVertical.rotation.z = -0.25;

kayoko.add(clipVertical);

const clipHorizontal = new THREE.Mesh(
  new THREE.BoxGeometry(
    0.28,
    0.08,
    0.08
  ),
  new THREE.MeshStandardMaterial({
    color: 0x171717
  })
);

clipHorizontal.position.set(
  0.62,
  3.12,
  -0.38
);

clipHorizontal.rotation.z = -0.25;

kayoko.add(clipHorizontal);

// ==========================================
// ПОЛОЖЕНИЕ КАЁКО
// ==========================================

kayoko.position.set(
  0,
  0,
  25
);

scene.add(kayoko);

// ==========================================
// ПРОВЕРКА СТОЛКНОВЕНИЙ
// ==========================================

function blocked(nx, nz) {
  return obstacles.some(o =>
    Math.abs(nx - o.x) < o.w / 2 &&
    Math.abs(nz - o.z) < o.d / 2
  );
}

// ==========================================
// HUD
// ==========================================

function updateHUD() {
  document.getElementById("score").textContent =
    state.score;

  document.getElementById("cats").textContent =
    state.cats;

  document.getElementById("photos").textContent =
    state.photos;

  document.getElementById("coins").textContent =
    state.coins;
}

// ==========================================
// СОХРАНЕНИЕ
// ==========================================

function save() {
  localStorage.setItem(
    "kayokoTokyo3D",
    JSON.stringify(state)
  );

  updateHUD();
}

// ==========================================
// СООБЩЕНИЕ
// ==========================================

function say(text) {
  const el = document.getElementById(
    "message"
  );

  el.textContent = text;

  el.classList.add("show");

  clearTimeout(say.timer);

  say.timer = setTimeout(() => {
    el.classList.remove("show");
  }, 2200);
}

// ==========================================
// ВЗАИМОДЕЙСТВИЕ
// ==========================================

function interact() {
  for (const s of spots) {

    const distance = Math.hypot(
      kayoko.position.x - s.x,
      kayoko.position.z - s.z
    );

    if (distance < 4) {

      // --------------------------
      // КОТЁНОК
      // --------------------------

      if (s.type === "cat") {

        say(
          "🐈 Нажми E — погладить котёнка"
        );

        if (keys.KeyE) {

          keys.KeyE = false;

          state.cats++;
          state.score += 100;
          state.coins += 100;

          save();

          say(
            "💙 Каёко погладила котёнка!"
          );
        }

      }

      // --------------------------
      // ФОТО
      // --------------------------

      else {

        say(
          "📸 Нажми E — сделать фотографию"
        );

        if (keys.KeyE) {

          keys.KeyE = false;

          state.photos++;
          state.score += 60;
          state.coins += 40;

          save();

          say(
            "📸 Фотография Токио сохранена!"
          );
        }
      }
    }
  }
}

// ==========================================
// ДВИЖЕНИЕ
// ==========================================

function move(dt) {

  let x = 0;
  let z = 0;

  if (
    keys.ArrowUp ||
    keys.KeyW
  ) {
    z -= 1;
  }

  if (
    keys.ArrowDown ||
    keys.KeyS
  ) {
    z += 1;
  }

  if (
    keys.ArrowLeft ||
    keys.KeyA
  ) {
    x -= 1;
  }

  if (
    keys.ArrowRight ||
    keys.KeyD
  ) {
    x += 1;
  }

  const length = Math.hypot(
    x,
    z
  );

  moving = length > 0;

  if (!moving) {

    body.position.y = 1.35;

    return;
  }

  x /= length;
  z /= length;

  // Скорость Каёко
  const speed = 9 * dt;

  const nx =
    kayoko.position.x +
    x * speed;

  const nz =
    kayoko.position.z +
    z * speed;

  if (!blocked(nx, nz)) {

    kayoko.position.x = nx;
    kayoko.position.z = nz;
  }

  // Поворот персонажа
  kayoko.rotation.y =
    Math.atan2(x, z);

  // Анимация ходьбы
  walkTime += dt * 10;

  body.position.y =
    1.35 +
    Math.abs(
      Math.sin(walkTime)
    ) * 0.08;
}

// ==========================================
// КАМЕРА
// ==========================================

function updateCamera() {

  const target = new THREE.Vector3(
    kayoko.position.x,
    2.3,
    kayoko.position.z
  );

  const desired = new THREE.Vector3(
    kayoko.position.x,
    8,
    kayoko.position.z + 12
  );

  camera.position.lerp(
    desired,
    0.08
  );

  camera.lookAt(target);
}

// ==========================================
// КЛАВИАТУРА
// ==========================================

window.addEventListener(
  "keydown",
  event => {

    keys[event.code] = true;

    if (
      event.code === "ArrowUp" ||
      event.code === "ArrowDown" ||
      event.code === "ArrowLeft" ||
      event.code === "ArrowRight" ||
      event.code === "Space"
    ) {
      event.preventDefault();
    }

    if (event.code === "KeyE") {
      interact();
    }
  }
);

window.addEventListener(
  "keyup",
  event => {
    keys[event.code] = false;
  }
);

// ==========================================
// МОБИЛЬНОЕ УПРАВЛЕНИЕ
// ==========================================

document
  .querySelectorAll(
    "#mobileControls button"
  )
  .forEach(button => {

    const key =
      button.dataset.key;

    button.addEventListener(
      "pointerdown",
      event => {

        event.preventDefault();

        keys[key] = true;
      }
    );

    button.addEventListener(
      "pointerup",
      event => {

        event.preventDefault();

        keys[key] = false;
      }
    );

    button.addEventListener(
      "pointercancel",
      event => {

        event.preventDefault();

        keys[key] = false;
      }
    );

    button.addEventListener(
      "pointerleave",
      event => {

        event.preventDefault();

        keys[key] = false;
      }
    );
  });

// ==========================================
// НОВАЯ ПРОГУЛКА
// ==========================================

const newWalkButton =
  document.getElementById(
    "newWalk"
  );

if (newWalkButton) {

  newWalkButton.addEventListener(
    "click",
    () => {

      state.score = 0;
      state.cats = 0;
      state.photos = 0;
      state.coins = 0;

      kayoko.position.set(
        0,
        0,
        25
      );

      kayoko.rotation.y = 0;

      save();

      say(
        "🌸 Новая прогулка началась!"
      );
    }
  );
}

// ==========================================
// ИЗМЕНЕНИЕ РАЗМЕРА ОКНА
// ==========================================

window.addEventListener(
  "resize",
  () => {

    camera.aspect =
      innerWidth / innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      innerWidth,
      innerHeight
    );
  }
);

// ==========================================
// HUD
// ==========================================

updateHUD();

// ==========================================
// ЗАГРУЗКА
// ==========================================

setTimeout(() => {

  const loading =
    document.getElementById(
      "loading"
    );

  if (loading) {
    loading.classList.add(
      "hidden"
    );
  }

}, 700);

// ==========================================
// ИГРОВОЙ ЦИКЛ
// ==========================================

function animate() {

  requestAnimationFrame(
    animate
  );

  const dt =
    Math.min(
      clock.getDelta(),
      0.05
    );

  move(dt);

  interact();

  updateCamera();

  renderer.render(
    scene,
    camera
  );
}

// ==========================================
// ЗАПУСК
// ==========================================

animate();
