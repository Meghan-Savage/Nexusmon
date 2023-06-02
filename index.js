const canvas = document.querySelector("canvas");

const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = [];

for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, 70 + i));
}

class Boundry {
  static width = 48;
  static height = 48;
  constructor({ position }) {
    this.position = position;
    this.width = 48;
    this.height = 48;
  }
  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
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

const image = new Image();
image.src = "./img/Nexusmon map.png";

const playerImage = new Image();
playerImage.src = "./img/playerDown.png";

class Sprite {
  constructor({ position, velocity, image, frames = { max: 1 } }) {
    this.position = position;
    this.image = image;
    this.frames = frames;
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
  }

  draw() {
    ctx.drawImage(
      this.image,
      0,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,

      this.image.width / this.frames.max,
      this.image.height
    );
  }
}

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerImage,
  frames: {
    max: 4,
  },
});

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
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

const moveables = [background, ...boundries];

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  );
}

function animate() {
  window.requestAnimationFrame(animate);
  background.draw();
  boundries.forEach((boundry) => {
    boundry.draw();
  });

  player.draw();
  let moving = true;

  if (keys.w.pressed && lastKey === "w") {
    for (let i = 0; i < boundries.length; i++) {
      const boundry = boundries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundry,
            position: {
              x: boundry.position.x,
              y: boundry.position.y + 3,
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
        moveable.position.y += 3;
      });
  } else if (keys.a.pressed && lastKey === "a") {
    for (let i = 0; i < boundries.length; i++) {
      const boundry = boundries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundry,
            position: {
              x: boundry.position.x + 3,
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
        moveable.position.x += 3;
      });
  } else if (keys.s.pressed && lastKey === "s") {
    for (let i = 0; i < boundries.length; i++) {
      const boundry = boundries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundry,
            position: {
              x: boundry.position.x,
              y: boundry.position.y - 3,
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
        moveable.position.y -= 3;
      });
  } else if (keys.d.pressed && lastKey === "d") {
    for (let i = 0; i < boundries.length; i++) {
      const boundry = boundries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundry,
            position: {
              x: boundry.position.x - 3,
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
        moveable.position.x -= 3;
      });
  }
}

animate();
let lastKey = "";
window.addEventListener("keydown", (event) => {
  switch (event.key) {
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

window.addEventListener("keyup", (event) => {
  switch (event.key) {
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
