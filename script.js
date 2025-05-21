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
    DOC.add(subRow, col6, col62);
    DOC.add(row, subRow, allegiance);
    DOC.add(txt, h2, row);
    DOC.add(content, img, imgOverlay, txt);
    card.setAttribute("data-name", `c${this.fname}&${this.lname}`);
    card.setAttribute("data-job", this.job);
    card.append(content);
    loc.append(card);
    let observer = new ResizeObserver((entries) => {
      entries[0].target.setAttribute(
        "style",
        `height: ${entries[0].target.offsetWidth}px !important;`
      );
    });
    observer.observe(card);
  }
  bonusShow() {
    DOC.get(".vader").classList.add("vaderAnim");
    DOC.get(".vader").classList.remove("vaderBackAnim");
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
  setup: function () {
    fetch("team.txt")
      .then((result) => result.text())
      .then((data) => {
        data.split(";").forEach((e) => {
          this.players.push(new Player(...e.split("@")));
        });
        let temp = DOC.get(".gridControl");
        DOC.get("#gridRow").innerHTML = "";
        DOC.get("#gridRow").append(temp);
        this.players.forEach((p, i) => p.render(DOC.get("#gridRow"), i));
        this.players.forEach((p) => {
          if (p.ally[0] == "E") this.E.push(p);
          else if (p.ally[0] == "R") this.R.push(p);
          else if (p.ally[0] == "M") this.M.push(p);
        });
        this.set = true;
      })
      .catch((error) => {
        throw new Error(error);
      });
  },
  tab: function (letter) {
    let control = DOC.get(".gridControl");
    DOC.get("#gridRow").innerHTML = "";
    DOC.get("#gridRow").append(control);
    if (!["R", "E", "M"].includes(letter.toUpperCase()))
      this.players.forEach((e) => e.render(DOC.get("#gridRow")));
    else
      this[letter.toUpperCase()].forEach((e) => e.render(DOC.get("#gridRow")));
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
    if (classes.length > 0) e.classList.add(...classes);
    e.id = id;
    return e;
  },
  link: function (arg) {
    window.location = arg;
  },
  add: function (loc, ...e) {
    e.forEach((p) => loc.append(p));
  },
};
const PAGEOPS = {
  setup: function () {
    DOC.get("#go").addEventListener("click", this.moveNext);
    DOC.get(".x").addEventListener("click", this.closeVader);
    setTimeout(() => {
      DOC.get(".hero").classList.add("pulsing");
      DOC.get(".hero").classList.remove("bgZoom");
      DOC.getALL("header ul li")[0].addEventListener("click", PAGEOPS.home);
      DOC.getALL("header ul li")[1].addEventListener("click", PAGEOPS.roster);
      DOC.get("#carouselRosterBtn").addEventListener("click", PAGEOPS.roster);
      TABS.setup();
      SEARCH.setup();
    }, 2000);
  },
  moveNext: function () {
    DOC.get(".hero-button").classList.remove("gradfade");
    DOC.get(".hero-button").classList.add("fadeOut");
    setTimeout(() => {
      DOC.get(".hero-button").classList.add("d-none");
    }, 1000);
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
    DOC.get("#carouselBody").classList.add("fadeOut");
    DOC.get("#carouselBody").classList.remove("fadeIn");
    DOC.get(".hero").classList.add("toRosterNav");
    DOC.get(".hero").classList.remove("moveNavDown", "toHomeNav");
    TABS.reset();
    setTimeout(() => {
      DOC.get("#carouselBody").classList.remove("fadeOut");
      DOC.get("#carouselBody").classList.add("d-none");
    }, 1000);
    setTimeout(() => {
      DOC.get("#gridRow").classList.add("fadeIn");
      DOC.get("#gridRow").classList.remove("d-none");
      if (!Team.set) Team.setup();
      setTimeout(() => {
        DOC.get("#gridRow").classList.remove("fadeIn");
      }, 1000);
    }, 2500);
  },
  home: function () {
    DOC.get("#carouselBody").classList.add("fadeIn");
    DOC.get("#carouselBody").classList.remove("d-none", "fadeOut");
    DOC.get(".hero").classList.add("toHomeNav");
    DOC.get(".hero").classList.remove("toRosterNav");
    DOC.get("#gridRow").classList.add("fadeOut");
    setTimeout(() => {
      DOC.get("#carouselBody").classList.remove("fadeIn");
      DOC.get("#gridRow").classList.remove("fadeOut");
      DOC.get("#gridRow").classList.add("d-none");
    }, 1000);
  },
  closeVader: function () {
    DOC.get(".vader").classList.add("vaderBackAnim");
    DOC.get(".vader").classList.remove("vaderAnim");
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
    const GC = DOC.get(".gridControl");
    DOC.get("#gridRow").innerHTML = "";
    DOC.get("#gridRow").append(GC);
    this.results.forEach((r) => r.render(DOC.get("#gridRow")));
    this.e.focus();
  },
  setup: function () {
    this.e.addEventListener("input", this.search.bind(this));
  },
};
PAGEOPS.setup();
