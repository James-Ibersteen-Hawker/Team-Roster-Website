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
  render(loc) {
    const card = DOC.create(
      "div",
      `${this.fname}${this.lname}`,
      `${this.ally[0]}`,
      "col-12",
      "col-sm-6",
      "col-md-4",
      "col-lg-3",
      "col-xxl-2"
    );
    const content = DOC.create("div");
    const img = DOC.create("img");
    img.src = this.img;
    const imgOverlay = DOC.create("span", "", "imgOverlay");
    const txt = DOC.create("div", "", "itemText");
    const h2 = DOC.create("h2");
    h2.textContent = `${this.fname} ${this.thisL}`;
    const row = DOC.create("div", "", "infoRow");
    const subRow = DOC.create("div", "", "infoRowSub");
    let [col6, col62] = Array.from({ length: 2 }, () =>
      DOC.create("div", "", "infodiv")
    );
    col6.textContent = `Age: ${this.age}`;
    col62.textContent = `${this.job}`;
    const allegiance = DOC.create("div", "", "allegiance");
    allegiance.addEventListener("click", () => AUDIO.SFX("vader"), true);
    allegiance.addEventListener("click", this.bonusShow.bind(this));
    subRow.add(col6, col62);
    row.add(subRow, allegiance);
    txt.add(h2, row);
    content.add(img, imgOverlay, txt);
    card.setAttribute("data-name", `c${this.fname}&${this.lname}`);
    card.setAttribute("data-job", this.job);
    card.add(content);
    loc.add(card);
    new ResizeObserver((entries) => {
      entries[0].target.setAttribute(
        "style",
        `height: ${entries[0].target.offsetWidth}px !important;`
      );
    }).observe(card);
  }
  get thisL() {
    if (this.lname == "N/A") return "";
    else return this.lname;
  }
  bonusShow() {
    let bg = ["vader1", "vader2", "vader3"];
    DOC.get(".vader").classes(
      "-vader1",
      "-vader2",
      "-vader2",
      `+${bg[Math.floor(Math.random() * bg.length)]}`
    );
    DOC.get("#vaderTextBox h2").textContent = `${this.fname} ${this.thisL}`;
    DOC.get("#vaderTextBox span").innerHTML = this.bonus;
    if (DOC.get(".imgSkew img").src != this.img)
      DOC.get(".imgSkew img").src = this.img;
    DOC.get(".vader").classes("+vaderAnim", "-vaderBackAnim");
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
        this.players.forEach((p) => p.render(this.grid));
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
  page: 1,
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
    DOC.get("#go").addEventListener("click", this.moveNext.bind(this));
    DOC.get(".x").addEventListener("click", this.closeVader);
    DOC.get(".vader").addEventListener("click", this.closeVader);
    setTimeout(() => {
      DOC.get(".hero").classes("+pulsing", "-bgZoom");
      DOC.getALL("header ul li")
        .slice(0, 2)
        .forEach((e) => {
          let n = e.textContent.toLowerCase();
          e.addEventListener("click", () => AUDIO.SFX("ignition"));
          e.addEventListener("click", PAGEOPS[n].bind(PAGEOPS));
        });
      DOC.get("#carouselRosterBtn").addEventListener(
        "click",
        PAGEOPS.roster.bind(this)
      );
      DOC.get("#carouselRosterBtn").addEventListener("click", () =>
        AUDIO.SFX("ignition")
      );
      DOC.getALL(".carousel-header span").forEach((e, i) => {
        e.addEventListener("click", () => this.carouselTabs(i));
      });
      TABS.setup();
      SEARCH.e.addEventListener("input", SEARCH.search.bind(SEARCH));
    }, 2000);
  },
  moveNext: function () {
    this.page = 2;
    AUDIO.init();
    DOC.get(".hero-button").classes("-gradfade", "+fadeOut");
    setTimeout(() => DOC.get(".hero-button").classes("+d-none"), 1000);
    setTimeout(() => {
      DOC.get(".hero").classes("-pulsing", "-bgZoom", "+moveNavDown");
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
    this.page = 3;
    CAROUSEL.body.classes("+fadeOut", "-fadeIn");
    DOC.get(".hero").classes("+toRosterNav", "-moveNavDown", "-toHomeNav");
    TABS.reset();
    setTimeout(() => CAROUSEL.body.classes("-fadeOut", "+d-none"), 1000);
    setTimeout(() => {
      Team.grid.innerHTML = "";
      Team.grid.append(Team.control);
      if (!Team.set) Team.setup();
      else Team.players.forEach((p) => p.render(Team.grid));
      Team.grid.classes("+fadeIn", "-d-none");
      setTimeout(() => Team.grid.classes("-fadeIn"), 1000);
    }, 2500);
  },
  home: function () {
    if (this.page != 2) {
      this.page = 2;
      CAROUSEL.body.classes("+fadeIn", "-d-none", "-fadeOut");
      DOC.get(".hero").classes("+toHomeNav", "-toRosterNav");
      Team.grid.classes("+fadeOut");
      setTimeout(() => {
        CAROUSEL.body.classes("-fadeIn");
        Team.grid.classes("-fadeOut", "+d-none");
      }, 1000);
    }
  },
  carouselTabs: function (num) {
    DOC.getALL(".carousel-header span").forEach((e) => e.classes("-active"));
    DOC.getALL(".carousel-header span")[num].classes("+active");
    let fadeOut, fadeIn;
    if (num == 0) [fadeOut, fadeIn] = [".aboutText", ".quoteText"];
    else if (num == 1) [fadeOut, fadeIn] = [".quoteText", ".aboutText"];
    DOC.get(fadeOut).classes("+fadeOut");
    setTimeout(() => {
      DOC.get(fadeOut).classes("-fadeOut", "+d-none");
      DOC.get(fadeIn).classes("+fadeIn", "-d-none");
      setTimeout(() => {
        DOC.get(fadeIn).classes("-fadeIn");
      }, 1000);
    }, 1000);
  },
  closeVader: () => {
    DOC.get(".vader").classes("+vaderBackAnim", "-vaderAnim");
  },
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
        let mH = DOC.get("p#r.carousel-heading");
        let lH = DOC.get("p#l.carousel-heading");
        mH.textContent = this.text[0][0];
        lH.textContent = this.text[0][1];
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
    if (tabnum < c && c - tabnum < 2) {
      this.tabs[c - 1].classes("+tabBack", "-active");
      this.tabs[c - 2].classes("+tabBack2", "+active");
      this.tabs.forEach((e) => e.classes("+off"));
      this.current = tabnum;
      setTimeout(() => {
        this.tabs.forEach((e) => e.classes("-off"));
        this.tabs[c - 1].classes("-tabBack");
        this.tabs[c - 2].classes("-tabBack2");
      }, 500);
    } else if (tabnum > c && tabnum - c < 2) {
      this.tabs[c - 1].classes("+tabForward", "-active");
      this.tabs[c].classes("+tabForward2", "+active");
      this.tabs.forEach((e) => e.classes("+off"));
      this.current = tabnum;
      setTimeout(() => {
        this.tabs.forEach((e) => e.classes("-off"));
        this.tabs[c - 1].classes("-tabForward");
        this.tabs[c].classes("-tabForward2");
      }, 500);
    }
    Team.tab(this.tabs[this.current - 1].textContent[0]);
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
    this.results = Team.players.filter((p) => {
      return p[PF] && PF != "general"
        ? p[PF]?.toLowerCase().includes(f)
        : Object.keys(p).some((k) => {
            return (
              typeof p[k] == "string" &&
              p[k].toLowerCase().includes(f) &&
              !["imgs", "ally", "bonus"].includes(k)
            );
          });
    });
    Team.grid.innerHTML = "";
    Team.grid.add(Team.control);
    this.results.forEach((r) => r.render(Team.grid));
    this.e.focus();
  },
};
const AUDIO = {
  clickAudio: new Audio("CLICKBLASTER.wav"),
  vaderAudio: new Audio("LIGHTSABER.mp3"),
  bgSpace: new Audio("DEEPSPACE.wav"),
  bgMusic: new Audio("MUSIC.wav"),
  ignition: new Audio("IGNITION.wav"),
  toggler: true,
  init: function () {
    this.bgSpace.loop = true;
    this.bgMusic.loop = true;
    this.bgMusic.volume = 0.8;
    this.bgSpace.volume = 1;
    this.bgSpace.play();
    this.bgMusic.play();
    DOC.get(".vader").addEventListener("click", () => this.SFX("vader"), true);
    window.addEventListener("click", () => this.SFX("click"));
    DOC.get("#on").addEventListener("click", () => {
      AUDIO.toggle(false);
    });
    DOC.get("#off").addEventListener("click", () => {
      AUDIO.toggle(true);
    });
  },
  toggle: function (bool) {
    if (bool == false) {
      [this.bgSpace, this.bgMusic].forEach((m) => m.pause());
      DOC.get("#on").classes("+d-none");
      DOC.get("#off").classes("-d-none");
      this.toggler = false;
    } else if (bool == true) {
      [this.bgSpace, this.bgMusic].forEach((m) => m.play());
      DOC.get("#off").classes("+d-none");
      DOC.get("#on").classes("-d-none");
      this.toggler = true;
    }
  },
  SFX: function (arg) {
    if (this.toggler == true) {
      let audio;
      switch (arg) {
        case "click":
          audio = this.clickAudio.cloneNode();
          break;
        case "vader":
          audio = this.vaderAudio.cloneNode();
          break;
        case "ignition":
          audio = this.ignition.cloneNode();
          break;
      }
      audio.volume = 0.3;
      if (arg == "click") audio.volume = 0.2;
      audio.play();
    }
  },
};
PAGEOPS.setup();

//390
