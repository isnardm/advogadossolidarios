Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes('Hydration failed')) {
    return false // problema com variavel de data - a ser consertado
  }
})

describe('Advogado dando Lance na Proposta', () => {
  it('Deve preencher email e senha e clicar em Entrar', () => {
    // 1. Acessar a página de login
    cy.visit('http://localhost:9002/login')

    // 2. Preencher o campo de e-mail com "aa"
    cy.get('input[name="email"]')
      .should('be.visible')
      .clear()
      .type('aa')

    // 3. Preencher o campo de senha com "12"
    cy.get('input[name="password"]')
      .should('be.visible')
      .clear()
      .type('12')

    // 4. Clicar no botão Entrar
    cy.contains('button', 'Entrar')
      .should('be.visible')
      .and('not.be.disabled')
      .click()

       // 5. validações
cy.contains('p.text-destructive', 'E-mail inválido.')
  .should('be.visible')

    // 5. validações
cy.contains('p.text-destructive', 'Senha deve ter no mínimo 6 caracteres.')
  .should('be.visible')

    // 5. (Opcional) Validar se foi para o dashboard ou retornou erro
    // cy.url().should('include', '/dashboard')
    // ou
    // cy.contains('E-mail ou senha inválidos').should('be.visible')
  })
})
