describe("empty spec", () => {
  it("signup &login", () => {
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
  });
});
