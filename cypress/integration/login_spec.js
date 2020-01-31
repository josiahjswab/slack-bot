/* eslint-disable no-undef */
describe('Log into admin dash and succeed in selecting a student.', () => {
  it('Given the right user login & password, should bring up dashboard', () => {
    cy.visit('http://localhost:3000/admin/login');
    cy.get('.action-email')
      .type(Cypress.env('ADMIN_EMAIL'))
      .should('have.value', Cypress.env('ADMIN_EMAIL'));
    cy.get('.action-password')
      .type(Cypress.env('ADMIN_PASSWORD'))
      .should('have.value', Cypress.env('ADMIN_PASSWORD'));
    cy.contains('Login').click();
    cy.url().should('include', '/dashboard');
    cy.get('#stomp')
      .click();
    cy.get('.data-section-container-grid');
  });
});
