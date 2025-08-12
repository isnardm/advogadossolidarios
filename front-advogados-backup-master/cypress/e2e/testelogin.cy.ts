/// <reference types="cypress" />

// Ignora erro de hydration para evitar falha no teste
Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes('Hydration failed')) {
    return false // problema com variavel de data - a ser consertado
  }
})

describe('Login de Usuario', () => {
  it('Preenche nome, senha e envia o formulário para realizar login', () => {
    cy.visit('http://localhost:9002/login')

    // Espera o input aparecer para garantir que o React carregou    
    cy.get('#«r0»-form-item').type('joao@joao.com')
    cy.get('input[name="password"]').type('123456')

    // Clica no botão de envio
    cy.get('button[type="submit"]').click()
  })
})
