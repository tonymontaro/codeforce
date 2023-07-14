var app = new Vue({
  el: "#app",
  data: {
    message: "Hello Vue!",
    username: localStorage.getItem("username") || "",
    data: {},
    solved: JSON.parse(localStorage.getItem("solved")) || {},
    titles: ["Div. 3", "Div. 2", "Div. 1", "Educational", "other"],
    hideSolved: false,
  },
  mounted() {
    let dis = this;
    $.getJSON(
      `js/data.json?rand=${parseInt(Math.random() * 1000)}`,
      function (data) {
        dis.data = data;
      }
    );
    $('[data-toggle="tooltip"]').tooltip();

    this.getUserData();
  },
  computed: {
    problemSets() {
      let sets = [[], [], [], [], []];
      for (let i = 0; i < this.titles.length; i++) {
        sets[i] = this.getProblems(this.titles[i]);
      }
      return sets;
    },
    div3problems() {
      return this.getProblems("Div. 3");
    },
    div2problems() {
      return this.getProblems("Div. 2");
    },
    div1problems() {
      return this.getProblems("Div. 1");
    },
    otherProblems() {
      return this.getProblems("other");
    },
    educationalProblems() {
      return this.getProblems("Educational");
    },
  },
  methods: {
    search() {
      this.getUserData();
      localStorage.setItem("username", this.username);
    },
    getUserData() {
      let dis = this;
      $.getJSON(
        `https://codeforces.com/api/user.status?handle=${this.username}`,
        function (data) {
          let solved = {};
          for (let prob of data.result) {
            if (prob.verdict === "OK") {
              solved[`${prob.problem.contestId}/${prob.problem.index}`] = true;
            }
          }
          dis.solved = solved;
          localStorage.setItem("solved", JSON.stringify(solved));
        }
      );
    },
    getProblems(division) {
      if (
        this.data.groups == undefined ||
        this.data.groups[division].length == 0
      )
        return [];
      const problems = [];
      for (let ct of this.data.groups[division]) {
        let pps = [];
        let contest = this.data.contests[ct];
        if (this.data.contests[ct] != undefined) {
          for (let i = contest.length - 1; i >= 0; i--)
            pps.push(this.data.problems[contest[i]]);
          problems.push(pps);
        }
      }
      return problems;
    },
  },
});
