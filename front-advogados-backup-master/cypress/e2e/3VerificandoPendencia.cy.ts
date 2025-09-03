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
   cy.get('input[name="email"]').type('adv2@advogado.com')
    cy.get('input[name="password"]').type('123456')  // campo de senha

    // 3. Clicar no botão de login
    cy.get('button[type="submit"]').click()

    // 4. Validar se entrou na página correta
    cy.url().should('include', '/dashboard')

 cy.visit('http://localhost:9002/historico')

// 1. Achar o card pelo título
cy.get('.border.bg-card.rounded-xl')         // pega os cards de histórico
  .not('.h-full')                             // exclui os cards de listagem
  .filter(':has(div.font-semibold:contains("Texto teste criacao de teste automatico"))') // card com o título
  .first()
  .scrollIntoView()
  .should('be.visible')
  .within(() => {
    cy.contains('p', 'Status:', { timeout: 15000 })
      .should('contain.text', 'PENDENTE')
    cy.contains('p', 'Valor:', { timeout: 15000 })
      .should('contain.text', '150.66') // se na UI for com vírgula, troque para '150,66'
  })




      })
    })
   