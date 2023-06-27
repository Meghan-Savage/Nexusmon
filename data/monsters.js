const embyImage = new Image();
embyImage.src = "./img/embySprite.png";

const draggieImage = new Image();
draggieImage.src = "./img/draggieSprite.png";

const monsters = {
  Emby: {
    position: {
      x: 280,
      y: 325,
    },
    image: embyImage,
    frames: {
      max: 4,
      hold: 30,
    },
    animate: true,
    name: "Emby",
    attacks: [attacks.Tackle, attacks.Fireball],
  },

  Draggie: {
    position: {
      x: 800,
      y: 100,
    },
    image: draggieImage,
    frames: {
      max: 4,
      hold: 50,
    },
    animate: true,
    isEnemy: true,
    name: "Draggie",
    attacks: [attacks.Tackle],
  },
};
