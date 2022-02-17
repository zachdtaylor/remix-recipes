describe("Pantry page", () => {
  it("redirects user to login if they are not logged in", () => {
    cy.visit("/software/pantry");
    cy.contains("Log In");
  });
  it("lets user create a new shelf", () => {
    cy.login({ email: "bob@example.com" });
    cy.visit("/software/pantry");
    cy.findByRole("button", { name: /Create Shelf/i }).click();
  });
});
