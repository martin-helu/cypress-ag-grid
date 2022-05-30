describe("Cypress Studio Test", () => {
    it("Cypress Studio Test One", () => {
        cy.visit("https://my.helu.ninja")
        /* ==== Generated with Cypress Studio ==== */
        cy.get('[data-testid=signInUsername]').clear();
        cy.get('[data-testid=signInUsername]').type('martin+business@helu.io');
        cy.get('.v-text-field__slot > [data-testid=signInPassword]').clear();
        cy.get('.v-text-field__slot > [data-testid=signInPassword]').type('Password123!');
        cy.get('[data-testid=authFormButton] > .flex').click();
        cy.get('.py-4 > div').should('have.text', 'Hi  Martin ! You have 985 days left in your Trial period. Upgrade to Premium account now!');
        /* ==== End Cypress Studio ==== */
    })
})