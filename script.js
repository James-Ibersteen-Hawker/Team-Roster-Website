class Player {
  fname;
  lname;
  age;
  ally;
  job;
  constructor(fname, lname, age, ally, job) {
    (this.fname = fname),
      (this.lname = lname),
      (this.age = age),
      (this.ally = ally),
      (this.job = job);
  }
  print() {
    console.log(this);
  }
}

const Team = {
  players: undefined,
  setup: function () {},
};
