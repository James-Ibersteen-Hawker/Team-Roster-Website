"use strict";
class Player {
  fname;
  lname;
  age;
  ally;
  job;
  img;
  bonus;
  constructor(fname, lname, age, ally, job, img, bonus) {
    (this.fname = fname),
      (this.lname = lname),
      (this.age = age),
      (this.ally = ally),
      (this.job = job),
      (this.img = img),
      (this.bonus = bonus);
  }
  render(loc, num) {
    const card = DOC.create(
      "div",
      `CARD${num}`,
      `${this.ally[0]}`,
      "col-12",
      "col-sm-6",
      "col-md-4"
    );
    const content = DOC.create("div");
    content.textContent = `${this.fname}, ${this.lname}, Age: ${this.age}, Ally: ${this.ally}`;
    card.setAttribute("data-name", `c${this.fname}&${this.lname}`);
    card.append(content);
    loc.append(card);
  }
}
const Team = {
  players: [],
  setup: function () {
    fetch("team.txt")
      .then((result) => result.text())
      .then((data) => {
        data.split(";").forEach((e) => {
          this.players.push(new Player(...e.split("@")));
        });
        this.players.forEach((p, i) => p.render(DOC.get("#gridRow"), i));
      }) //renders and assigns
      .catch((error) => {
        throw new Error(error);
      });
  },
};
const DOC = {
  e: document,
  body: document.body,
  get: function (arg) {
    return this.e.querySelector(arg);
  },
  getALL: function (arg) {
    return Array.from(this.e.querySelectorAll(arg));
  },
  create: function (tag, id = "", ...classes) {
    let e = this.e.createElement(tag);
    e.id = id;
    if (classes.length > 0) e.classList.add(...classes);
    return e;
  },
};
const PAGEOPS = {
  setup: function () {
    DOC.get("#go").addEventListener("click", this.moveNext);
    setTimeout(() => {
      DOC.get(".hero").classList.add("pulsing");
      DOC.get(".hero").classList.remove("bgZoom");
    }, 2000);
  },
  moveNext: function () {
    DOC.get(".hero-button").classList.remove("gradfade");
    DOC.get(".hero-button").classList.add("fadeOut");
    setTimeout(() => {
      DOC.get(".hero").classList.remove("pulsing");
      DOC.get(".hero").classList.add("moveNavDown");
      [DOC.get("header"), DOC.get("footer"), DOC.get("#carouselBody")].forEach(
        (e) => e.classList.remove("d-none")
      );
      [DOC.get("header"), DOC.get("footer")].forEach((e) =>
        e.classList.add("fadeInNAV")
      );
      DOC.get("#carouselBody").classList.add("fadeIn");
      CAROUSEL.setup();
    }, 800);
  },
};
const CAROUSEL = {
  text: [],
  e: DOC.get("#carouselBody .text"),
  setText: function () {
    fetch("quotes.txt")
      .then((response) => response.text())
      .then((data) => {
        data.split("@").forEach((e) => {
          this.text.push(e.split(":"));
        });
        this.e.textContent = this.text;
      })
      .catch((error) => console.error(error));
  },
  setup: function () {
    this.setText();
  },
};
PAGEOPS.setup();
