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

cy.get('.border.bg-card.rounded-xl') // pega os cards
  .filter(':has(div.font-semibold:contains("Texto teste criacao de teste automatico"))') // título
  .filter(':has(p:contains("Valor: R$ 150.66"))') // valor
  .first() // caso haja mais de um, pega o primeiro
  .scrollIntoView()
  .should('be.visible')
  .within(() => {
    cy.contains('button', 'Aprovar').click()
  })
 })
    })
