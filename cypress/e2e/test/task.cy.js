describe('User Authentication and Shopping Cart Functionality', () => {
  beforeEach(() => {
    cy.visit('https://www.saucedemo.com/')
  })

  it('Verify the user can log into the application with user "standard_user"', () => {
    cy.get('#user-name').type('standard_user')
    cy.get('#password').type('secret_sauce')
    cy.get('#login-button').click()
    cy.url().should('include', '/inventory.html') // Assertion: Checks if URL includes '/inventory.html'
  })

  it('Verify that the user "standard_user" can add items to the cart', () => {
    cy.get('#user-name').type('standard_user')
    cy.get('#password').type('secret_sauce')
    cy.get('#login-button').click()
    cy.get('.btn_primary').first().click()
    cy.get('.shopping_cart_badge').should('have.text', '1') // Assertion: Checks if cart badge displays '1'
  })

  it('Verify that the user "standard_user" can filter the products', () => {
    cy.get('#user-name').type('standard_user')
    cy.get('#password').type('secret_sauce')
    cy.get('#login-button').click()

    // Name (A to Z)
    cy.get('.product_sort_container').select('az')
    cy.get('.inventory_item_name').then(($items) => {
      const itemNames = $items.map((index, element) => Cypress.$(element).text()).get()
      expect(itemNames).to.eql(itemNames.slice().sort()) // Assertion: Verify Name (A to Z) sorting
    })

    // Name (Z to A)
    cy.get('.product_sort_container').select('za')
    cy.get('.inventory_item_name').then(($items) => {
      const itemNames = $items.map((index, element) => Cypress.$(element).text()).get()
      expect(itemNames).to.eql(itemNames.slice().sort().reverse()) // Assertion: Verify Name (Z to A) sorting
    })

    // Price (Low to High)
    cy.get('.product_sort_container').select('lohi')
    cy.get('.inventory_item_price').then(($prices) => {
      const itemPrices = $prices.map((index, element) => parseFloat(Cypress.$(element).text().replace('$', ''))).get()
      expect(itemPrices).to.eql(itemPrices.slice().sort((a, b) => a - b)) // Assertion: Verify Price (Low to High) sorting
    })

    // Price (High to Low)
    cy.get('.product_sort_container').select('hilo')
    cy.get('.inventory_item_price').then(($prices) => {
      const itemPrices = $prices.map((index, element) => parseFloat(Cypress.$(element).text().replace('$', ''))).get()
      expect(itemPrices).to.eql(itemPrices.slice().sort((a, b) => b - a)) // Assertion: Verify Price (High to Low) sorting
    })
  })

  it('Verify that the user "standard_user" can perform a checkout', () => {
    cy.get('#user-name').type('standard_user')
    cy.get('#password').type('secret_sauce')
    cy.get('#login-button').click()
    cy.get('.btn_primary').first().click()
    cy.get('#shopping_cart_container').click()
    cy.get('.checkout_button').click()
    cy.get('#first-name').type('Tilak')
    cy.get('#last-name').type('Shakya')
    cy.get('#postal-code').type('12345')
    cy.get('#continue').click()
    cy.get('.summary_total_label').should('have.text', 'Total: $29.99') // Assertion: Checks if total amount is correct
    cy.get('#finish').click()
    cy.url().should('include', '/checkout-complete.html') // Assertion: Checks if URL includes '/checkout-complete.html'
  })

  it('Verify that the user "locked_out_user" cannot log in to the application', () => {
    cy.get('#user-name').type('locked_out_user')
    cy.get('#password').type('secret_sauce')
    cy.get('#login-button').click()
    cy.get('.error-button').should('be.visible') // Assertion: Checks if error button is visible
  })
})
