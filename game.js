// ==========================================
// СУДЗУКО КАЁКО — TOKYO 3D
// Исправленная версия
// ==========================================

(function () {

  "use strict";

  // ------------------------------------------
  // ЭЛЕМЕНТЫ
  // ------------------------------------------

  const loading = document.getElementById("loading");
  const message = document.getElementById("message");

  function showError(text) {
    if (!loading) return;

    loading.classList.remove("hidden");

    loading.innerHTML =
      "❌ " + text +
      "<br><small>Обнови страницу и попробуй ещё раз.</small>";
  }

  // ------------------------------------------
  // ПРОВЕРКА THREE.JS
  // ------------------------------------------

  if (window.threeLoadError || typeof THREE === "undefined") {

    showError(
      "Не удалось загрузить Three.js"
    );

    return;
  }

  console.log("KAYOKO GAME JS ЗАПУЩЕН");

  // ------------------------------------------
  // ОШИБКИ
  // ------------------------------------------

  window.addEventListener("error", function (event) {

    console.error(event.error || event.message);

    if (
      loading &&
      !loading.classList.contains("hidden")
    ) {

      showError(
        event.message || "неизвестная ошибка"
      );
    }

  });

  // ------------------------------------------
  // СЦЕНА
  // ------------------------------------------

  const scene = new THREE.Scene();

  scene.background =
    new THREE.Color(0xbfe2ec);

  // ------------------------------------------
  // КАМЕРА
  // ------------------------------------------

  const camera =
    new THREE.PerspectiveCamera(
      55,
      window.innerWidth /
      window.innerHeight,
      0.1,
      500
    );

  camera.position.set(
    0,
    7,
    12
  );

  // ------------------------------------------
  // РЕНДЕР
  // ------------------------------------------

  let renderer;

  try {

    renderer =
      new THREE.WebGLRenderer({
        antialias: true
      });

  } catch (error) {

    console.error(error);

    showError(
      "Браузер не смог запустить 3D-графику"
    );

    return;
  }

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );

  renderer.setPixelRatio(
    Math.min(
      window.devicePixelRatio || 1,
      2
    )
  );

  renderer.shadowMap.enabled = true;

  renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;

  document.body.appendChild(
    renderer.domElement
  );

  // ------------------------------------------
  // СВЕТ
  // ------------------------------------------

  const ambientLight =
    new THREE.AmbientLight(
      0xffffff,
      1.8
    );

  scene.add(ambientLight);

  const sun =
    new THREE.DirectionalLight(
      0xffffff,
      2.2
    );

  sun.position.set(
    40,
    70,
    25
  );

  sun.castShadow = true;

  sun.shadow.mapSize.width = 1024;
  sun.shadow.mapSize.height = 1024;

  scene.add(sun);

  // ------------------------------------------
  // ГРУППА ГОРОДА
  // ------------------------------------------

  const city =
    new THREE.Group();

  scene.add(city);

  // ------------------------------------------
  // СОСТОЯНИЕ ИГРЫ
  // ------------------------------------------

  const SAVE_KEY =
    "kayokoTokyo3D";

  let save = {
    score: 0,
    cats: 0,
    photos: 0,
    coins: 0
  };

  try {

    const old =
      localStorage.getItem(
        SAVE_KEY
      );

    if (old) {

      const parsed =
        JSON.parse(old);

      save = {
        ...save,
        ...parsed
      };
    }

  } catch (error) {

    console.warn(
      "Не удалось загрузить сохранение",
      error
    );

  }

  function saveGame() {

    try {

      localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(save)
      );

    } catch (error) {

      console.warn(
        "Не удалось сохранить игру",
        error
      );

    }

  }

  // ------------------------------------------
  // ФУНКЦИЯ КУБА
  // ------------------------------------------

  function addBox(
    x,
    y,
    z,
    w,
    h,
    d,
    color,
    parent = city
  ) {

    const geometry =
      new THREE.BoxGeometry(
        w,
        h,
        d
      );

    const material =
      new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.85
      });

    const mesh =
      new THREE.Mesh(
        geometry,
        material
      );

    mesh.position.set(
      x,
      y + h / 2,
      z
    );

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    parent.add(mesh);

    return mesh;
  }

  // ------------------------------------------
  // ЗЕМЛЯ
  // ------------------------------------------

  const groundGeometry =
    new THREE.PlaneGeometry(
      180,
      180
    );

  const groundMaterial =
    new THREE.MeshStandardMaterial({
      color: 0xd8eadb
    });

  const ground =
    new THREE.Mesh(
      groundGeometry,
      groundMaterial
    );

  ground.rotation.x =
    -Math.PI / 2;

  ground.receiveShadow = true;

  scene.add(ground);

  // ------------------------------------------
  // ДОРОГИ
  // ------------------------------------------

  function road(
    x,
    z,
    w,
    d
  ) {

    const geometry =
      new THREE.PlaneGeometry(
        w,
        d
      );

    const material =
      new THREE.MeshStandardMaterial({
        color: 0x6f7880
      });

    const mesh =
      new THREE.Mesh(
        geometry,
        material
      );

    mesh.rotation.x =
      -Math.PI / 2;

    mesh.position.set(
      x,
      0.02,
      z
    );

    mesh.receiveShadow = true;

    scene.add(mesh);

  }

  road(
    0,
    0,
    18,
    180
  );

  road(
    0,
    0,
    180,
    18
  );

  road(
    -45,
    0,
    10,
    180
  );

  road(
    45,
    0,
    10,
    180
  );

  // ------------------------------------------
  // ТРОТУАРЫ
  // ------------------------------------------

  function sidewalk(
    x,
    z,
    w,
    d
  ) {

    const geometry =
      new THREE.PlaneGeometry(
        w,
        d
      );

    const material =
      new THREE.MeshStandardMaterial({
        color: 0xcbd6d9
      });

    const mesh =
      new THREE.Mesh(
        geometry,
        material
      );

    mesh.rotation.x =
      -Math.PI / 2;

    mesh.position.set(
      x,
      0.025,
      z
    );

    scene.add(mesh);

  }

  sidewalk(
    -14,
    0,
    7,
    180
  );

  sidewalk(
    14,
    0,
    7,
    180
  );

  sidewalk(
    0,
    -14,
    180,
    7
  );

  sidewalk(
    0,
    14,
    180,
    7
  );

  // ------------------------------------------
  // ЗДАНИЕ
  // ------------------------------------------

  function building(
    x,
    z,
    w,
    h,
    d,
    color,
    name
  ) {

    const group =
      new THREE.Group();

    group.position.set(
      x,
      0,
      z
    );

    city.add(group);

    addBox(
      0,
      0,
      0,
      w,
      h,
      d,
      color,
      group
    );

    if (name) {

      addLabel(
        name,
        0,
        h + 1,
        0,
        group
      );

    }

    return {
      x,
      z,
      w,
      h,
      d,
      group
    };

  }

  // ------------------------------------------
  // НАДПИСЬ
  // ------------------------------------------

  function addLabel(
    text,
    x,
    y,
    z,
    parent = city
  ) {

    const canvas =
      document.createElement(
        "canvas"
      );

    canvas.width = 512;
    canvas.height = 128;

    const ctx =
      canvas.getContext("2d");

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.fillStyle =
      "rgba(255,255,255,0.95)";

    if (
      ctx.roundRect
    ) {

      ctx.beginPath();

      ctx.roundRect(
        10,
        10,
        492,
        108,
        20
      );

      ctx.fill();

    } else {

      ctx.fillRect(
        10,
        10,
        492,
        108
      );

    }

    ctx.fillStyle =
      "#31566d";

    ctx.font =
      "bold 38px Arial";

    ctx.textAlign =
      "center";

    ctx.textBaseline =
      "middle";

    ctx.fillText(
      text,
      256,
      64
    );

    const texture =
      new THREE.CanvasTexture(
        canvas
      );

    const material =
      new THREE.SpriteMaterial({
        map: texture,
        transparent: true
      });

    const sprite =
      new THREE.Sprite(
        material
      );

    sprite.position.set(
      x,
      y,
      z
    );

    sprite.scale.set(
      8,
      2,
      1
    );

    parent.add(sprite);

  }

  // ------------------------------------------
  // ЗДАНИЯ
  // ------------------------------------------

  building(
    -38,
    -35,
    25,
    10,
    18,
    0xddeeff,
    "Академия Мидзухана"
  );

  building(
    34,
    -34,
    18,
    7,
    15,
    0xffd9e5,
    "Кафе"
  );

  building(
    36,
    34,
    20,
    8,
    18,
    0xf5e4c7,
    "Магазин одежды"
  );

  building(
    -38,
    34,
    20,
    11,
    16,
    0xd7e6f5,
    "Станция"
  );

  building(
    -60,
    5,
    18,
    9,
    18,
    0xe4d7f5,
    "Жилой квартал"
  );

  building(
    60,
    5,
    18,
    9,
    18,
    0xf4dfca,
    "Конбини"
  );

  building(
    -35,
    58,
    18,
    8,
    15,
    0xd9f0e5,
    "Музыкальный магазин"
  );

  building(
    35,
    58,
    18,
    8,
    15,
    0xf0e3f4,
    "Книжный"
  );

  // ------------------------------------------
  // САКУРА
  // ------------------------------------------

  function createTree(
    x,
    z
  ) {

    const tree =
      new THREE.Group();

    tree.position.set(
      x,
      0,
      z
    );

    const trunk =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.35,
          0.45,
          3,
          8
        ),
        new THREE.MeshStandardMaterial({
          color: 0x76513b
        })
      );

    trunk.position.y =
      1.5;

    trunk.castShadow = true;

    tree.add(trunk);

    const crown =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          2.3,
          16,
          12
        ),
        new THREE.MeshStandardMaterial({
          color: 0xffb7d1
        })
      );

    crown.position.y =
      4;

    crown.castShadow = true;

    tree.add(crown);

    city.add(tree);

  }

  const sakuraPositions = [
    [-25, -25],
    [-20, -25],
    [-15, -25],
    [20, -25],
    [25, -25],
    [30, -25],

    [-25, 25],
    [-20, 25],
    [-15, 25],
    [20, 25],
    [25, 25],
    [30, 25],

    [-25, 45],
    [-20, 45],
    [20, 45],
    [25, 45],

    [-55, -20],
    [-55, -15],
    [55, -20],
    [55, -15],

    [-5, 35],
    [5, 35]
  ];

  sakuraPositions.forEach(
    pos => createTree(
      pos[0],
      pos[1]
    )
  );

  // ------------------------------------------
  // КАНАЛ
  // ------------------------------------------

  const canalGeometry =
    new THREE.PlaneGeometry(
      10,
      100
    );

  const canalMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x71bfd1,
      roughness: 0.2,
      metalness: 0.1
    });

  const canal =
    new THREE.Mesh(
      canalGeometry,
      canalMaterial
    );

  canal.rotation.x =
    -Math.PI / 2;

  canal.position.set(
    25,
    0.04,
    0
  );

  scene.add(canal);

  // ------------------------------------------
  // ФОНАРИ
  // ------------------------------------------

  function streetLamp(
    x,
    z
  ) {

    const group =
      new THREE.Group();

    group.position.set(
      x,
      0,
      z
    );

    const pole =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.12,
          0.15,
          4,
          8
        ),
        new THREE.MeshStandardMaterial({
          color: 0x343d43
        })
      );

    pole.position.y =
      2;

    pole.castShadow = true;

    group.add(pole);

    const lamp =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.35,
          12,
          12
        ),
        new THREE.MeshStandardMaterial({
          color: 0xfff0bd,
          emissive: 0xffd76a,
          emissiveIntensity: 0.5
        })
      );

    lamp.position.y =
      4.2;

    group.add(lamp);

    city.add(group);

  }

  for (
    let z = -70;
    z <= 70;
    z += 20
  ) {

    streetLamp(
      -11,
      z
    );

    streetLamp(
      11,
      z
    );

  }

  // ------------------------------------------
  // КАЁКО
  // ------------------------------------------

  const kayoko =
    new THREE.Group();

  kayoko.position.set(
    0,
    0,
    5
  );

  scene.add(kayoko);

  // тело

  const body =
    new THREE.Mesh(
      new THREE.CapsuleGeometry(
        0.7,
        1.6,
        8,
        16
      ),
      new THREE.MeshStandardMaterial({
        color: 0xf4f5f8
      })
    );

  body.position.y =
    1.5;

  body.castShadow = true;

  kayoko.add(body);

  // голова

  const head =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.72,
        24,
        16
      ),
      new THREE.MeshStandardMaterial({
        color: 0xffe2d1
      })
    );

  head.position.y =
    3.0;

  head.castShadow = true;

  kayoko.add(head);

  // белые волосы

  const hair =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.78,
        24,
        16
      ),
      new THREE.MeshStandardMaterial({
        color: 0xffffff
      })
    );

  hair.scale.set(
    1.05,
    1.05,
    0.9
  );

  hair.position.set(
    0,
    3.18,
    -0.08
  );

  hair.castShadow = true;

  kayoko.add(hair);

  // глаза

  function eye(x) {

    const eye =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.10,
          12,
          12
        ),
        new THREE.MeshStandardMaterial({
          color: 0x4c91c9
        })
      );

    eye.position.set(
      x,
      3.05,
      -0.68
    );

    kayoko.add(eye);

  }

  eye(-0.24);
  eye(0.24);

  // синий бант

  const bowMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x397fc4
    });

  const bowLeft =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.35,
        16,
        12
      ),
      bowMaterial
    );

  bowLeft.scale.set(
    1.2,
    0.7,
    0.35
  );

  bowLeft.position.set(
    -0.32,
    2.95,
    -0.67
  );

  kayoko.add(bowLeft);

  const bowRight =
    bowLeft.clone();

  bowRight.position.x =
    0.32;

  kayoko.add(bowRight);

  const bowCenter =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.16,
        12,
        12
      ),
      bowMaterial
    );

  bowCenter.position.set(
    0,
    2.95,
    -0.68
  );

  kayoko.add(bowCenter);

  // чёрная заколка-крестик

  const clipMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x151515
    });

  const clip1 =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        0.08,
        0.35,
        0.08
      ),
      clipMaterial
    );

  const clip2 =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        0.35,
        0.08,
        0.08
      ),
      clipMaterial
    );

  clip1.position.set(
    0.63,
    3.45,
    -0.42
  );

  clip2.position.set(
    0.63,
    3.45,
    -0.42
  );

  kayoko.add(
    clip1,
    clip2
  );

  // ------------------------------------------
  // ИНТЕРАКТИВНЫЕ ОБЪЕКТЫ
  // ------------------------------------------

  const interactables = [];

  // КОШКА

  const cat =
    new THREE.Group();

  cat.position.set(
    -8,
    0,
    32
  );

  scene.add(cat);

  const catBody =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.55,
        16,
        12
      ),
      new THREE.MeshStandardMaterial({
        color: 0x777777
      })
    );

  catBody.scale.set(
    1.3,
    0.8,
    1
  );

  catBody.position.y =
    0.6;

  cat.add(catBody);

  const catHead =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.45,
        16,
        12
      ),
      new THREE.MeshStandardMaterial({
        color: 0x888888
      })
    );

  catHead.position.set(
    0,
    1.05,
    -0.35
  );

  cat.add(catHead);

  const earGeometry =
    new THREE.ConeGeometry(
      0.18,
      0.45,
      4
    );

  const earMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x888888
    });

  const ear1 =
    new THREE.Mesh(
      earGeometry,
      earMaterial
    );

  ear1.position.set(
    -0.25,
    1.45,
    -0.35
  );

  cat.add(ear1);

  const ear2 =
    ear1.clone();

  ear2.position.x =
    0.25;

  cat.add(ear2);

  interactables.push({
    object: cat,
    type: "cat"
  });

  // ФОТО

  const photo =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        1.4,
        1.8,
        0.12
      ),
      new THREE.MeshStandardMaterial({
        color: 0xffffff
      })
    );

  photo.position.set(
    31,
    1.2,
    -8
  );

  scene.add(photo);

  interactables.push({
    object: photo,
    type: "photo"
  });

  // ------------------------------------------
  // КОЛЛИЗИИ
  // ------------------------------------------

  const obstacles = [];

  const buildingData = [
    [-38, -35, 25, 18],
    [34, -34, 18, 15],
    [36, 34, 20, 18],
    [-38, 34, 20, 16],
    [-60, 5, 18, 18],
    [60, 5, 18, 18],
    [-35, 58, 18, 15],
    [35, 58, 18, 15]
  ];

  buildingData.forEach(
    item => {

      obstacles.push({
        x: item[0],
        z: item[1],
        w: item[2],
        d: item[3]
      });

    }
  );

  function collides(
    x,
    z
  ) {

    const radius = 0.9;

    for (
      const o of obstacles
    ) {

      if (
        x >
          o.x - o.w / 2 - radius &&
        x <
          o.x + o.w / 2 + radius &&
        z >
          o.z - o.d / 2 - radius &&
        z <
          o.z + o.d / 2 + radius
      ) {

        return true;

      }

    }

    return false;

  }

  // ------------------------------------------
  // УПРАВЛЕНИЕ
  // ------------------------------------------

  const keys = {};

  window.addEventListener(
    "keydown",
    function (event) {

      keys[event.key.toLowerCase()] =
        true;

      if (
        event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight"
      ) {

        event.preventDefault();

      }

    },
    { passive: false }
  );

  window.addEventListener(
    "keyup",
    function (event) {

      keys[event.key.toLowerCase()] =
        false;

    }
  );

  // ------------------------------------------
  // МОБИЛЬНЫЕ КНОПКИ
  // ------------------------------------------

  const mobileButtons =
    document.querySelectorAll(
      "#mobileControls button"
    );

  mobileButtons.forEach(
    button => {

      const key =
        button.dataset.key;

      button.addEventListener(
        "pointerdown",
        function (event) {

          event.preventDefault();

          keys[
            key.toLowerCase()
          ] = true;

        }
      );

      button.addEventListener(
        "pointerup",
        function (event) {

          event.preventDefault();

          keys[
            key.toLowerCase()
          ] = false;

        }
      );

      button.addEventListener(
        "pointercancel",
        function () {

          keys[
            key.toLowerCase()
          ] = false;

        }
      );

      button.addEventListener(
        "pointerleave",
        function () {

          keys[
            key.toLowerCase()
          ] = false;

        }
      );

    }
  );

  // ------------------------------------------
  // ДВИЖЕНИЕ
  // ------------------------------------------

  const clock =
    new THREE.Clock();

  const speed = 8;

  function move(dt) {

    let dx = 0;
    let dz = 0;

    if (
      keys["w"] ||
      keys["arrowup"]
    ) {

      dz -= 1;

    }

    if (
      keys["s"] ||
      keys["arrowdown"]
    ) {

      dz += 1;

    }

    if (
      keys["a"] ||
      keys["arrowleft"]
    ) {

      dx -= 1;

    }

    if (
      keys["d"] ||
      keys["arrowright"]
    ) {

      dx += 1;

    }

    if (
      dx === 0 &&
      dz === 0
    ) {

      return;

    }

    const length =
      Math.sqrt(
        dx * dx +
        dz * dz
      );

    dx /= length;
    dz /= length;

    const nextX =
      kayoko.position.x +
      dx * speed * dt;

    const nextZ =
      kayoko.position.z +
      dz * speed * dt;

    if (
      !collides(
        nextX,
        kayoko.position.z
      )
    ) {

      kayoko.position.x =
        nextX;

    }

    if (
      !collides(
        kayoko.position.x,
        nextZ
      )
    ) {

      kayoko.position.z =
        nextZ;

    }

    // поворачиваем Каёко

    kayoko.rotation.y =
      Math.atan2(
        dx,
        dz
      );

  }

  // ------------------------------------------
  // ВЗАИМОДЕЙСТВИЕ
  // ------------------------------------------

  let messageTimer = null;

  function showMessage(text) {

    if (!message) return;

    message.textContent =
      text;

    message.classList.add(
      "show"
    );

    clearTimeout(
      messageTimer
    );

    messageTimer =
      setTimeout(
        function () {

          message.classList.remove(
            "show"
          );

        },
        2200
      );

  }

  function distance(
    a,
    b
  ) {

    const dx =
      a.x - b.x;

    const dz =
      a.z - b.z;

    return Math.sqrt(
      dx * dx +
      dz * dz
    );

  }

  function interact() {

    if (
      !keys["e"]
    ) {

      return;

    }

    keys["e"] = false;

    for (
      const item of interactables
    ) {

      const pos =
        item.object.position;

      if (
        distance(
          kayoko.position,
          pos
        ) < 4
      ) {

        if (
          item.type === "cat"
        ) {

          save.cats += 1;
          save.score += 100;
          save.coins += 5;

          showMessage(
            "🐈 Каёко погладила кошку! +100 ⭐"
          );

          saveGame();

        }

        if (
          item.type === "photo"
        ) {

          save.photos += 1;
          save.score += 150;
          save.coins += 10;

          showMessage(
            "📸 Каёко сделала фотографию! +150 ⭐"
          );

          saveGame();

        }

        updateHUD();

        break;

      }

    }

  }

  // ------------------------------------------
  // КАМЕРА
  // ------------------------------------------

  function updateCamera() {

    const target =
      new THREE.Vector3(
        kayoko.position.x,
        3,
        kayoko.position.z
      );

    const desired =
      new THREE.Vector3(
        kayoko.position.x,
        7,
        kayoko.position.z + 10
      );

    camera.position.lerp(
      desired,
      0.08
    );

    camera.lookAt(
      target
    );

  }

  // ------------------------------------------
  // HUD
  // ------------------------------------------

  function updateHUD() {

    const score =
      document.getElementById(
        "score"
      );

    const cats =
      document.getElementById(
        "cats"
      );

    const photos =
      document.getElementById(
        "photos"
      );

    const coins =
      document.getElementById(
        "coins"
      );

    if (score)
      score.textContent =
        save.score;

    if (cats)
      cats.textContent =
        save.cats;

    if (photos)
      photos.textContent =
        save.photos;

    if (coins)
      coins.textContent =
        save.coins;

  }

  // ------------------------------------------
  // НОВАЯ ПРОГУЛКА
  // ------------------------------------------

  const newWalk =
    document.getElementById(
      "newWalk"
    );

  if (newWalk) {

    newWalk.addEventListener(
      "click",
      function () {

        save = {
          score: 0,
          cats: 0,
          photos: 0,
          coins: 0
        };

        saveGame();
        updateHUD();

        kayoko.position.set(
          0,
          0,
          5
        );

        showMessage(
          "🌸 Новая прогулка началась!"
        );

      }
    );

  }

  // ------------------------------------------
  // RESIZE
  // ------------------------------------------

  window.addEventListener(
    "resize",
    function () {

      camera.aspect =
        window.innerWidth /
        window.innerHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(
        window.innerWidth,
        window.innerHeight
      );

    }
  );

  // ------------------------------------------
  // HUD
  // ------------------------------------------

  updateHUD();

  // ------------------------------------------
  // ЗАГРУЗКА ЗАВЕРШЕНА
  // ------------------------------------------

  setTimeout(
    function () {

      if (loading) {

        loading.classList.add(
          "hidden"
        );

      }

    },
    700
  );

  // ------------------------------------------
  // ИГРОВОЙ ЦИКЛ
  // ------------------------------------------

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

  animate();

})();
