Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes('Hydration failed')) {
    return false // problema com variavel de data - a ser consertado
  }
})

describe('Submeter Lance', () => {
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

    // 5. Clicar em submeter caso
    cy.contains('a', 'Submeter Caso').click()

    // 6. Preencher o campo "title"
    cy.get('input[name="title"]')
      .type('Texto teste criacao de teste automatico')

    // 7. Preencher o campo "description"
    cy.get('textarea[name="description"]')
      .type('Caso de Teste de criacao automatica por testes automatizados. Criacao de nova proposta para o advogado.')

    // 8. Clicar em submeter caso.
    cy.contains('button', 'Enviar Caso').click()

    // 1. Clicar no botão do usuário (dropdown)
cy.get('button[id^="radix-"]') // o id parece dinâmico, mas sempre começa com radix-
  .should('be.visible')
  .click()

// 2. Esperar o dropdown abrir e clicar em "Sair"
cy.contains('div[role="menuitem"]', 'Sair')
  .should('be.visible')
  .click()

// 3. (Opcional) Validar que foi para a tela de login
cy.url().should('include', '/login')



  })
})
