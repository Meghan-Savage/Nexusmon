const canvas = document.querySelector("canvas");

const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, 70 + i));
}
const battleZonesMap = [];
for (let i = 0; i < battleZonesData.length; i += 70) {
  battleZonesMap.push(battleZonesData.slice(i, 70 + i));
}
const charactersMap = [];
for (let i = 0; i < charactersMapData.length; i += 70) {
  charactersMap.push(charactersMapData.slice(i, 70 + i));
}

const boundries = [];
const offset = {
  x: -305,
  y: -760,
};

//for each can be replaced with map()

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      boundries.push(
        new Boundry({
          position: {
            x: j * Boundry.width + offset.x,
            y: i * Boundry.height + offset.y,
          },
        })
      );
  });
});
const battleZones = [];
battleZonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      battleZones.push(
        new Boundry({
          position: {
            x: j * Boundry.width + offset.x,
            y: i * Boundry.height + offset.y,
          },
        })
      );
  });
});

const characters = [];
const villagerImg = new Image();
villagerImg.src = "./img/villager/Idle.png";

const kidImg = new Image();
kidImg.src = "./img/kid/Idle.png";

charactersMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1026) {
      characters.push(
        new Character({
          position: {
            x: j * Boundry.width + offset.x,
            y: i * Boundry.height + offset.y,
          },
          image: villagerImg,
          frames: {
            max: 4,
            hold: 60,
          },
          scale: 3,
          animate: false,
          dialogue: [
            "Back in my time, dreams were shattered, hopes were crushed, and everyone wore a smile to hide the despair within. Good times.",
            "Beware the old well beyond the village outskirts. Legends speak of a mystical creature dwelling within its depths.",
            "Ah, to be young again! Treasure your days, for they pass like the fleeting wind.",
          ],
        })
      );
    } else if (symbol === 1031) {
      characters.push(
        new Character({
          position: {
            x: j * Boundry.width + offset.x,
            y: i * Boundry.height + offset.y,
          },
          image: kidImg,
          frames: {
            max: 4,
            hold: 260,
          },
          scale: 3,
          animate: true,
          dialogue: [
            "...",
            "Hey mister, have you seen my Mischiefur?.",
            "I think he's hiding in the bushes.",
            "Can you help me find him?",
          ],
        })
      );
    }
    if (symbol !== 0) {
      boundries.push(
        new Boundry({
          position: {
            x: j * Boundry.width + offset.x,
            y: i * Boundry.height + offset.y,
          },
        })
      );
    }
  });
});

const image = new Image();
image.src = "./img/Nexusmon map1.png";

const foregroundImage = new Image();
foregroundImage.src = "./img/forgroundObjects.png";

const playerDownImage = new Image();
playerDownImage.src = "./img/playerDown.png";

const playerUpImage = new Image();
playerUpImage.src = "./img/playerUp.png";

const playerLeftImage = new Image();
playerLeftImage.src = "./img/playerLeft.png";

const playerRightImage = new Image();
playerRightImage.src = "./img/playerRight.png";

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerDownImage,
  frames: {
    max: 4,
    hold: 20,
  },
  sprites: {
    up: playerUpImage,
    left: playerLeftImage,
    right: playerRightImage,
    down: playerDownImage,
  },
});

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
});
const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundImage,
});

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

const moveables = [
  background,
  ...boundries,
  foreground,
  ...battleZones,
  ...characters,
];
const renderables = [
  background,
  ...boundries,
  ...battleZones,
  ...characters,
  player,
  foreground,
];

const battle = {
  initiated: false,
};

function animate() {
  const animationId = window.requestAnimationFrame(animate);

  renderables.forEach((renderable) => {
    renderable.draw();
  });

  let moving = true;
  player.animate = false;

  if (battle.initiated) return;

  //activate a battle

  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i];
      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          battleZone.position.x + battleZone.width
        ) -
          Math.max(player.position.x, battleZone.position.x)) *
        (Math.min(
          player.position.y + player.height,
          battleZone.position.y + battleZone.height
        ) -
          Math.max(player.position.y, battleZone.position.y));

      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: battleZone,
        }) &&
        overlappingArea > (player.width * player.height) / 2 &&
        Math.random() < 0.01
      ) {
        //stop current animation loop
        window.cancelAnimationFrame(animationId);

        audio.Map.stop();
        audio.initBattle.play();
        audio.battle.play();

        battle.initiated = true;
        gsap.to("#overlappingDiv", {
          opacity: 1,
          repeat: 3,
          yoyo: true,
          duration: 0.4,
          onComplete() {
            gsap.to("#overlappingDiv", {
              opacity: 1,
              duration: 0.4,
              onComplete() {
                //activate new animation loop
                initBattle();
                animateBattle();
                gsap.to("#overlappingDiv", {
                  opacity: 0,
                  duration: 0.4,
                });
              },
            });
          },
        });
        break;
      }
    }
  }

  if (keys.w.pressed && lastKey === "w") {
    player.animate = true;
    player.image = player.sprites.up;

    //monitor for collision
    checkForCharacterCollision({
      characters,
      player,
      characterOffset: {
        x: 0,
        y: 3,
      },
    });

    for (let i = 0; i < boundries.length; i++) {
      const boundry = boundries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundry,
            position: {
              x: boundry.position.x,
              y: boundry.position.y + 2,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving)
      moveables.forEach((moveable) => {
        moveable.position.y += 2;
      });
  } else if (keys.a.pressed && lastKey === "a") {
    player.animate = true;
    player.image = player.sprites.left;

    checkForCharacterCollision({
      characters,
      player,
      characterOffset: {
        x: 3,
        y: 0,
      },
    });

    for (let i = 0; i < boundries.length; i++) {
      const boundry = boundries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundry,
            position: {
              x: boundry.position.x + 2,
              y: boundry.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving)
      moveables.forEach((moveable) => {
        moveable.position.x += 2;
      });
  } else if (keys.s.pressed && lastKey === "s") {
    player.animate = true;
    player.image = player.sprites.down;
    checkForCharacterCollision({
      characters,
      player,
      characterOffset: {
        x: 0,
        y: -3,
      },
    });

    for (let i = 0; i < boundries.length; i++) {
      const boundry = boundries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundry,
            position: {
              x: boundry.position.x,
              y: boundry.position.y - 2,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving)
      moveables.forEach((moveable) => {
        moveable.position.y -= 2;
      });
  } else if (keys.d.pressed && lastKey === "d") {
    player.animate = true;
    player.image = player.sprites.right;
    checkForCharacterCollision({
      characters,
      player,
      characterOffset: {
        x: -3,
        y: 0,
      },
    });

    for (let i = 0; i < boundries.length; i++) {
      const boundry = boundries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundry,
            position: {
              x: boundry.position.x - 2,
              y: boundry.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving)
      moveables.forEach((moveable) => {
        moveable.position.x -= 2;
      });
  }
}

//animate();

let lastKey = "";
window.addEventListener("keydown", (e) => {
  if (player.isInteracting) {
    switch (e.key) {
      case " ":
        player.interactionAsset.dialogueIndex++;

        const { dialogueIndex, dialogue } = player.interactionAsset;
        if (dialogueIndex <= dialogue.length - 1) {
          document.querySelector("#characterDialogueBox").innerHTML =
            player.interactionAsset.dialogue[dialogueIndex];
          return;
        }

        // finish conversation
        player.isInteracting = false;
        player.interactionAsset.dialogueIndex = 0;
        document.querySelector("#characterDialogueBox").style.display = "none";

        break;
    }
    return;
  }

  switch (e.key) {
    case " ":
      if (!player.interactionAsset) return;

      // beginning the conversation
      const firstMessage = player.interactionAsset.dialogue[0];
      document.querySelector("#characterDialogueBox").innerHTML = firstMessage;
      document.querySelector("#characterDialogueBox").style.display = "flex";
      player.isInteracting = true;
      break;
    case "w":
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;

    case "s":
      keys.s.pressed = true;
      lastKey = "s";
      break;

    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});

let clicked = false;
addEventListener("click", () => {
  if (!clicked) {
    audio.Map.play();
    clicked = true;
  }
});
