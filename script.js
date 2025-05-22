"use strict";
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
    if (classes.length > 0) e.classList.add(...classes);
    e.id = id;
    return e;
  },
  link: function (arg) {
    window.location = arg;
  },
};
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
      "col-md-4",
      "col-lg-3"
    );
    const content = DOC.create("div");
    const img = DOC.create("img");
    img.src = this.img;
    const imgOverlay = DOC.create("span", "", "imgOverlay");
    imgOverlay.textContent = "Click the logo to find out more";
    const txt = DOC.create("div", "", "itemText");
    const h2 = DOC.create("h2");
    h2.textContent = `${this.fname} ${(() => {
      if (this.lname == "N/A") return "";
      else return this.lname;
    })()}`;
    const row = DOC.create("div", "", "infoRow");
    const subRow = DOC.create("div", "", "infoRowSub");
    let [col6, col62] = Array.from({ length: 2 }, () =>
      DOC.create("div", "", "infodiv")
    );
    col6.textContent = `Age: ${this.age}`;
    col62.textContent = `${this.job}`;
    const allegiance = DOC.create("div", "", "allegiance");
    allegiance.addEventListener("click", this.bonusShow.bind(this));
    subRow.add(col6, col62);
    row.add(subRow, allegiance);
    txt.add(h2, row);
    content.add(img, imgOverlay, txt);
    card.setAttribute("data-name", `c${this.fname}&${this.lname}`);
    card.setAttribute("data-job", this.job);
    card.add(content);
    loc.add(card);
    let observer = new ResizeObserver((entries) => {
      entries[0].target.setAttribute(
        "style",
        `height: ${entries[0].target.offsetWidth}px !important;`
      );
    });
    observer.observe(card);
  }
  bonusShow() {
    DOC.get(".vader").classes("+vaderAnim", "-vaderBackAnim");
    let bg = ["vader1", "vader2", "vader3"];
    DOC.get(".vader").setAttribute(
      "style",
      `background: url(vader/${
        bg[Math.floor(Math.random() * bg.length)]
      }.png), rgba(255,255,255,.7); background-position: left bottom; background-size: contain; background-repeat: no-repeat;backdrop-filter: blur(5px);`
    );
    DOC.get("#vaderTextBox").innerHTML = this.bonus;
  }
}
const Team = {
  players: [],
  E: [],
  R: [],
  M: [],
  set: false,
  grid: DOC.get("#gridRow"),
  control: DOC.get(".gridControl"),
  setup: function () {
    fetch("team.txt")
      .then((result) => result.text())
      .then((data) => {
        data.split(";").forEach((e) => {
          this.players.push(new Player(...e.split("@")));
        });
        this.grid.innerHTML = "";
        this.grid.add(this.control);
        this.players.forEach((p, i) => p.render(this.grid, i));
        this.players.forEach((p) => this[p.ally[0]].push(p));
        this.set = true;
      })
      .catch((error) => {
        throw new Error(error);
      });
  },
  tab: function (letter) {
    this.grid.innerHTML = "";
    this.grid.add(this.control);
    if (!["R", "E", "M"].includes(letter.toUpperCase()))
      this.players.forEach((e) => e.render(Team.grid));
    else this[letter.toUpperCase()].forEach((e) => e.render(this.grid));
  },
};
const PAGEOPS = {
  setup: function () {
    HTMLElement.prototype.classes = function (...classes) {
      classes.forEach((c) => {
        if (c[0] == "+") this.classList.add(c.substring(1));
        else if (c[0] == "-") this.classList.remove(c.substring(1));
      });
    };
    HTMLElement.prototype.add = function (...elems) {
      elems.forEach((e) => this.append(e));
    };
    DOC.get("#go").addEventListener("click", this.moveNext);
    DOC.get(".x").addEventListener("click", this.closeVader);
    setTimeout(() => {
      DOC.get(".hero").classes("+pulsing", "-bgZoom");
      DOC.getALL("header ul li")[0].addEventListener("click", PAGEOPS.home);
      DOC.getALL("header ul li")[1].addEventListener("click", PAGEOPS.roster);
      DOC.get("#carouselRosterBtn").addEventListener("click", PAGEOPS.roster);
      TABS.setup();
      SEARCH.setup();
    }, 2000);
  },
  moveNext: function () {
    DOC.get(".hero-button").classes("-gradfade", "+fadeOut");
    setTimeout(() => DOC.get(".hero-button").classes("+d-none"), 1000);
    setTimeout(() => {
      DOC.get(".hero").classes("-pulsing", "+moveNavDown");
      [DOC.get("header"), DOC.get("footer"), CAROUSEL.body].forEach((e) =>
        e.classes("-d-none")
      );
      [DOC.get("header"), DOC.get("footer")].forEach((e) =>
        e.classes("+fadeInNAV")
      );
      CAROUSEL.body.classes("+fadeIn");
      CAROUSEL.setText();
    }, 800);
  },
  roster: function () {
    CAROUSEL.body.classes("+fadeOut", "-fadeIn");
    DOC.get(".hero").classes("+toRosterNav", "-moveNavDown", "-toHomeNav");
    TABS.reset();
    setTimeout(() => CAROUSEL.body.classes("-fadeOut", "+d-none"), 1000);
    setTimeout(() => {
      Team.grid.classes("+fadeIn", "-d-none");
      if (!Team.set) Team.setup();
      setTimeout(() => Team.grid.classes("-fadeIn"), 1000);
    }, 2500);
  },
  home: function () {
    CAROUSEL.body.classes("+fadeIn", "-d-none", "-fadeOut");
    DOC.get(".hero").classes("+toHomeNav", "-toRosterNav");
    Team.grid.classes("+fadeOut");
    setTimeout(() => {
      CAROUSEL.body.classes("-fadeIn");
      Team.grid.classes("-fadeOut", "+d-none");
    }, 1000);
  },
  closeVader: () => DOC.get(".vader").classes("+vaderBackAnim", "-vaderAnim"),
};
const CAROUSEL = {
  text: [],
  e: DOC.get("#carouselBody .text"),
  body: DOC.get("#carouselBody"),
  index: 0,
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
        div.add(mH, lH);
        this.e.add(div);
        setInterval(
          () => {
            let num = Math.floor(Math.random() * this.text.length);
            while (num == this.index)
              num = Math.floor(Math.random() * this.text.length);
            this.index = num;
            [mH, lH].forEach((e) => e.classes("+fadeOut"));
            setTimeout(() => {
              [mH, lH].forEach((e, i) => {
                e.classes("-fadeOut", "+fadeIn");
                e.textContent = this.text[num][i];
                setTimeout(() => e.classes("-fadeIn"), 1000, e);
              });
            }, 1000);
          },
          4000,
          mH,
          lH
        );
      })
      .catch((error) => {
        throw new Error(error);
      });
  },
};
const TABS = {
  tabs: DOC.getALL(".tab"),
  current: 4,
  swap: function (tabnum) {
    let c = this.current;
    if (tabnum < c && c - tabnum != 2) {
      this.tabs[c - 1].classList.add("tabBack");
      this.tabs[c - 2].classList.add("tabBack2", "active");
      this.tabs[c - 1].classList.remove("active");
      this.tabs.forEach((e) => e.classList.add("off"));
      setTimeout(() => {
        this.tabs.forEach((e) => e.classList.remove("off"));
        this.tabs[c - 1].classList.remove("tabBack");
        this.tabs[c - 2].classList.remove("tabBack2");
      }, 500);
      this.current = tabnum;
    } else if (tabnum > c && tabnum - c != 2) {
      this.tabs[c - 1].classList.add("tabForward");
      this.tabs[c].classList.add("tabForward2", "active");
      this.tabs[c - 1].classList.remove("active");
      this.tabs.forEach((e) => e.classList.add("off"));
      setTimeout(() => {
        this.tabs.forEach((e) => e.classList.remove("off"));
        this.tabs[c - 1].classList.remove("tabForward");
        this.tabs[c].classList.remove("tabForward2");
      }, 500);
      this.current = tabnum;
    }
    const letter = this.tabs[this.current - 1].textContent[0];
    Team.tab(letter);
  },
  setup: function () {
    this.tabs.forEach((e, i) =>
      e.addEventListener("click", () => {
        this.swap(i + 1);
      })
    );
  },
  reset: function () {
    this.tabs.forEach((e) => e.classList.remove("active"));
    this.tabs[3].classList.add("active");
    this.current = 4;
  },
};
const SEARCH = {
  results: [],
  txt: undefined,
  e: DOC.get("#search"),
  search: function () {
    this.results = [];
    let f = this.e.value.toLowerCase();
    let PF = DOC.get(".search select").value;
    Team.players.forEach((p) => {
      if (PF && PF != "general") {
        if (p[PF].toLowerCase().includes(f)) this.results.push(p);
      } else {
        for (let prop in p) {
          if (
            p[prop].toLowerCase().includes(f) &&
            !["img", "bonus", "ally"].includes(prop) &&
            p[prop] != "N/A"
          ) {
            this.results.push(p);
            break;
          }
        }
      }
    });
    Team.grid.innerHTML = "";
    Team.grid.add(Team.control);
    this.results.forEach((r) => r.render(Team.grid));
    this.e.focus();
  },
  setup: function () {
    this.e.addEventListener("input", this.search.bind(this));
  },
};
PAGEOPS.setup();
