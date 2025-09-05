Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes('Hydration failed')) {
    return false // problema com variavel de data - a ser consertado
  }
})

describe('Advogado dando Lance na Proposta', () => {
  it('Deve entrar na página e fazer login', () => {

// 1. Acessar a tela de login
cy.visit('http://localhost:9002/login')

// 2. Clicar no botão Registrar
cy.contains('button', 'Registrar') // ou cy.get('button[id^="radix-"]')
  .should('be.visible')
  .click()

// 3. Selecionar a opção "Como Advogado" no menu
cy.contains('a[role="menuitem"]', 'Como Advogado')
  .should('be.visible')
  .click()

// 4. (Opcional) Validar que foi redirecionado
cy.url().should('include', '/register/lawyer')

// 1. Campo Nome
cy.get('input[name="name"]')
  .should('be.visible')
  .type('Nome Teste Automatizado')

// 2. Campo Email
cy.get('input[name="email"]')              // pega o campo
  .should('be.visible')                    // garante que está visível
  .clear()                                 // limpa se já tiver algo
  .type('teste@testeauto.com')             // digita o e-mail

// 3. Campo Senha
cy.get('input[name="password"]')
  .should('be.visible')
  .type('123456')

// 4. Botão de Registrar
cy.contains('button', 'Registrar como Advogado')
  .should('be.visible')
  .and('not.be.disabled')
  .click()

// 5. (Opcional) Validar email invalido
cy.contains('p.text-destructive', 'Número da OAB inválido.')
  .should('be.visible')
    })
    })