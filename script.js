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
  link: function (arg) {
    window.location = arg;
  },
};
const PAGEOPS = {
  setup: function () {
    DOC.get("#go").addEventListener("click", this.moveNext);
    setTimeout(() => {
      DOC.get(".hero").classList.add("pulsing");
      DOC.get(".hero").classList.remove("bgZoom");
      DOC.getALL("header ul li")[0].addEventListener("click", PAGEOPS.home);
      DOC.getALL("header ul li")[1].addEventListener("click", PAGEOPS.roster);
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
  roster: function () {
    console.log("roster");
    DOC.get("#carouselBody").classList.add("fadeOut");
    DOC.get("#carouselBody").classList.remove("fadeIn");
    DOC.get(".hero").classList.add("toRosterNav");
    DOC.get(".hero").classList.remove("moveNavDown");
    DOC.get(".hero").classList.remove("toHomeNav");
    DOC.get("#gridRow").classList.add("fadeIn");
    DOC.get("#gridRow").classList.remove("d-none");
    setTimeout(() => {
      DOC.get("#carouselBody").classList.remove("fadeOut");
      DOC.get("#carouselBody").classList.add("d-none");
      DOC.get("#gridRow").classList.remove("fadeIn");
    }, 1000);
  },
  home: function () {
    DOC.get("#carouselBody").classList.add("fadeIn");
    DOC.get("#carouselBody").classList.remove("d-none");
    DOC.get("#carouselBody").classList.remove("fadeOut");
    DOC.get(".hero").classList.add("toHomeNav");
    DOC.get(".hero").classList.remove("toRosterNav");
    DOC.get("#gridRow").classList.add("fadeOut");
    setTimeout(() => {
      DOC.get("#carouselBody").classList.remove("fadeIn");
      DOC.get("#gridRow").classList.remove("fadeOut");
      DOC.get("#gridRow").classList.add("d-none");
    }, 1000);
  },
};
const CAROUSEL = {
  text: [],
  e: DOC.get("#carouselBody .text"),
  index: undefined,
  setText: function () {
    fetch("quotes.txt")
      .then((response) => response.text())
      .then((data) => {
        data.split("@").forEach((e) => this.text.push(e.split(":")));
        this.text.splice(0, 1);
        const div = DOC.create("div", `cDIV`, "carousel-div");
        let mH = DOC.create("p", "r", "carousel-heading");
        let lH = DOC.create("p", "l", "carousel-heading");
        mH.textContent = this.text[0][0];
        lH.textContent = this.text[0][1];
        div.append(mH);
        div.append(lH);
        this.e.append(div);
        setInterval(
          () => {
            let num = Math.floor(Math.random() * this.text.length);
            while (num == this.index)
              num = Math.floor(Math.random() * this.text.length);
            this.index = num;
            [mH, lH].forEach((e) => e.classList.add("fadeOut"));
            this.index = num;
            setTimeout(() => {
              [mH, lH].forEach((e, i) => {
                e.classList.remove("fadeOut");
                e.textContent = this.text[num][i];
                e.classList.add("fadeIn");
                setTimeout(
                  () => {
                    e.classList.remove("fadeIn");
                  },
                  1000,
                  e
                );
              });
            }, 1000);
          },
          4000,
          mH,
          lH
        );
      })
      .catch((error) => console.error(error));
  },
  setup: function () {
    this.setText();
  },
};
PAGEOPS.setup();
