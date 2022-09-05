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
describe("basic signup & login with api", () => {
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
