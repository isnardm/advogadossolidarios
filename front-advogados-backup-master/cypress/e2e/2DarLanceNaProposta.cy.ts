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

    //5. Procurar o Caso pelo titulo do Card
    cy.contains('div', 'Texto teste criacao de teste automatico') // acha o título do card
  .closest('.border') // sobe para o container do card (div principal com a borda)
  .within(() => {
    cy.contains('button', 'Dar Lance').click() // clica no botão Dar Lance só desse card
  })

    // 6. Espera o modal abrir e o textarea aparecer
    cy.get('textarea[placeholder="Comentário"]')
  .should('be.visible')
  .type('Comentario de teste automatico teste automatizado do Advogado.')

// 7. Preencher o campo de valor
cy.get('input[placeholder="Valor"]')
  .should('be.visible')
  .type('150.66')

// 8. Clicar no botão "Enviar Lance"
cy.contains('button', 'Enviar Lance')
  .should('be.visible')
  .and('not.be.disabled') // garante que não está desabilitado
  .click()

// 4. (Opcional) Validar que o modal fechou ou que houve sucesso
// após clicar em Enviar Lance
cy.contains('div', 'Seu lance foi registrado com sucesso.')
  .should('be.visible')


  })
})