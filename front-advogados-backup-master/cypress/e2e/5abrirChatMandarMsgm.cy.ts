Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes('Hydration failed')) {
    return false // problema com variavel de data - a ser consertado
  }
})

describe('Advogado dando Lance na Proposta', () => {
  it('Deve entrar na página e fazer login', () => {
    // 1. Visitar a página
    cy.visit('http://localhost:9002/login')

    // 2. Preencher os campos de login
   cy.get('input[name="email"]').type('usuario01@teste.com')
    cy.get('input[name="password"]').type('123456')  // campo de senha

    // 3. Clicar no botão de login
    cy.get('button[type="submit"]').click()

    // 4. Validar se entrou na página correta
    cy.url().should('include', '/dashboard')
// 1. Achar o card certo pelo título, valor e status
cy.get('.border.bg-card.rounded-xl')
  .filter(':has(div.font-semibold:contains("Texto teste criacao de teste automatico"))')
  .filter(':has(p:contains("Valor: R$ 150.66"))')
  .filter(':has(p:contains("Status: APROVADA"))')
  .first()
  .scrollIntoView()
  .should('be.visible')
  .within(() => {
    // 2. Clicar no botão Chat
    cy.contains('button', 'Chat').click()
  })

// 3. Preencher a mensagem no modal
cy.get('input[placeholder="Mensagem"]')
  .should('be.visible')
  .type('Mensagem de teste automatizado no chat do usuario')

// 4. Clicar em Enviar
cy.contains('button', 'Enviar')
  .should('be.visible')
  .and('not.be.disabled')
  .click()



    })
    })