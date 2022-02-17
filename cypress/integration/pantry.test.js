beforeEach(() => {
  cy.deleteUser({ email: "bob@example.com" });
});

describe("Pantry page", () => {
  it("redirects user to login if they are not logged in", () => {
    cy.visit("/software/pantry");
    cy.contains("Log In");
  });

  it("lets a user do a typical flow", () => {
    cy.login({ email: "bob@example.com" });
    cy.visit("/software/pantry");
    cy.findByRole("button", { name: /Create Shelf/i }).click();
    const shelfNameInput = cy.findByLabelText(/shelf name/i);
    shelfNameInput.clear().type("Dairy");

    const newItemInput = cy.findByLabelText(/new item/i);
    newItemInput.type("Milk{enter}");
    newItemInput.type("Eggs{enter}");
    newItemInput.type("Yogurt{enter}");

    // Leave and go back to make sure changes persisted
    cy.visit("/software/recipes");
    cy.visit("/software/pantry");

    cy.findByText("Milk").should("exist");
    cy.findByText("Eggs").should("exist");
    cy.findByText("Yogurt").should("exist");

    cy.findByLabelText(/delete eggs/i).click();
    cy.findByText("Eggs").should("not.exist");

    cy.findByRole("button", { name: /Delete Shelf/i }).click();
    cy.findByLabelText(/shelf name/i).should("not.exist");
  });
});
