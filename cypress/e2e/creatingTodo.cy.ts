describe("create a todo", () => {
  it("create a todo", () => {
    cy.visit("http://localhost:3000/");
    cy.contains("login").should("exist");
    cy.get("input").eq(0).type("ruurico@testorg.org");
    cy.get("input").eq(1).type("salasana");
    cy.get("button").click();
    cy.contains("my todos").should("exist");
    cy.get("input").eq(0).type("test todo");
    cy.get("input").eq(2).click();
    cy.contains("test todo").should("exist");
    cy.get("input").eq(0).should("have.value", "");
    cy.contains("logout").click();
  });
  it("create org todo", () => {
    cy.visit("http://localhost:3000/");
    cy.contains("login").should("exist");
    cy.get("input").eq(0).type("ruurico@testorg.org");
    cy.get("input").eq(1).type("salasana");
    cy.get("button").click();
    cy.contains("my todos").should("exist");
    cy.get("input").eq(0).type("test orgtodo");
    cy.get("input").eq(1).click();
    cy.get("input").eq(2).click();
    cy.contains("test orgtodo").should("exist");
    cy.contains("logout").click();
  });
  it("org todo shows on other user account", () => {
    cy.visit("http://localhost:3000/");
    const user = {
      email: "tester@testorg.org",
      password: "salasana",
      orgCode: "testorg",
    };
    cy.get("input").eq(0).type(user.email);
    cy.get("input").eq(1).type(user.password);
    cy.get("button").click();
    cy.contains("my todos").should("exist");
    cy.contains("test orgtodo").should("exist");
  });
});
