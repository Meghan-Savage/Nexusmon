const audio = {
  Map: new Howl({
    src: "./audio/riverTown.wav",
    html5: true,
    volume: 0.1,
    loop: true,
  }),
  initBattle: new Howl({
    src: "./audio/initBattle.wav",
    volume: 0.1,
  }),
  battle: new Howl({
    src: "./audio/turca.ogg",
    volume: 0.1,
  }),
  tackleHit: new Howl({
    src: "./audio/tackleHit.wav",
    volume: 0.1,
  }),
  fireballHit: new Howl({
    src: "./audio/fireballHit.wav",
    volume: 0.1,
  }),
  initFireball: new Howl({
    src: "./audio/initFireball.wav",
    volume: 0.1,
  }),
  victory: new Howl({
    src: "./audio/victory.wav",
    volume: 0.1,
  }),
};
