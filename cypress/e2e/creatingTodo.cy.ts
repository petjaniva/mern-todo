describe("create a todo", () => {
  it("create a todo", () => {
    cy.visit("http://localhost:3000/");
    cy.contains("login").should("exist");
    cy.get("input").eq(0).type("ruurico@ruurico.org");
    cy.get("input").eq(1).type("salasana");
    cy.get("button").click();
    cy.contains("my todos").should("exist");
    cy.get("input").eq(0).type("test todo");
    cy.get("input").eq(2).click();
    cy.contains("test todo").should("exist");
  });
  it("create org todo", () => {
    cy.get("input").eq(0).type("test orgtodo");
    cy.get("input").eq(1).click();
    cy.get("input").eq(2).click();
    cy.contains("test orgtodo").should("exist");
  });
});
