

const monsters = {
  Emby: {
    position: {
      x: 280,
      y: 325,
    },
    image: {
      src: "./img/embySprite.png",
    },
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
    image: {
      src: "./img/draggieSprite.png",
    },
    frames: {
      max: 4,
      hold: 50,
    },
    animate: true,
    isEnemy: true,
    name: "Draggie",
    attacks: [attacks.Tackle, attacks.Fireball],
  },
  Tenty: {
    position: {
      x: 800,
      y: 100,
    },
    image: {
      src: "./img/tentySprite.png",
    },
    frames: {
      max: 4,
      hold: 50,
    },
    animate: true,
    isEnemy: true,
    name: "Tenty",
    attacks: [attacks.Tackle, attacks.Fireball],
  },
};
