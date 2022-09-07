before(() => {
  cy.task("prepareDB");
});
describe("basic signup & login with ui", () => {
  it("signup & login", () => {
    cy.visit("http://localhost:3000/");
    cy.contains("Signup").click();
    cy.contains("username").should("exist");
    cy.get("input").eq(0).type("ruurico@ruurico.org");
    cy.get("input").eq(1).type("salasana");
    cy.get("input").eq(2).type("salasana");
    cy.get("button").click();
    cy.contains("login").should("exist");
    cy.get("input").eq(0).type("ruurico@ruurico.org");
    cy.get("input").eq(1).type("salasana");
    cy.get("button").click();
    cy.contains("my todos").should("exist");
    cy.contains("logout").click();
  });
});
describe("basic signup with api & login with ui", () => {
  it("signup & login", () => {
    cy.task("signUp", {
      email: "tester@mctester.com",
      password: "salasana",
      orgCode: "",
    });
    cy.visit("http://localhost:3000/");
    cy.get("input").eq(0).type("tester@mctester.com");
    cy.get("input").eq(1).type("salasana");
    cy.get("button").click();
  });
});
describe("create org with ui and a new user to that org", () => {
  it("create org", () => {
    cy.visit("http://localhost:3000/");
    cy.contains("Signup").click();
    cy.contains("Create an org").should("exist").click();
    cy.get("input").eq(3).type("testorg");
    cy.get("input").eq(4).type("testorg");
    cy.contains("button", "Create").click();
    cy.get("input").eq(0).type("ruurico@testorg.org");
    cy.get("input").eq(1).type("salasana");
    cy.get("input").eq(2).type("salasana");
    cy.get("button").click();
    cy.contains("login").should("exist");
    cy.get("input").eq(0).type("ruurico@testorg.org");
    cy.get("input").eq(1).type("salasana");
    cy.get("button").click();
    cy.contains("my todos").should("exist");
    cy.contains("logout").click();
    const user = {
      email: "tester@testorg.org",
      password: "salasana",
      orgCode: "testorg",
    };
    cy.task("signUp", user);
    cy.get("input").eq(0).type(user.email);
    cy.get("input").eq(1).type(user.password);
    cy.get("button").click();
    cy.contains("my todos").should("exist");
  });
});
