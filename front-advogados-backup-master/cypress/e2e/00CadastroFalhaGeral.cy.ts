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

// 4. Botão de Registrar
cy.contains('button', 'Registrar como Advogado')
  .should('be.visible')
  .and('not.be.disabled')
  .click()

  // 5. validações
cy.contains('p.text-destructive', 'Nome deve ter no mínimo 3 caracteres.')
  .should('be.visible')

    // 5. validações
cy.contains('p.text-destructive', 'E-mail inválido.')
  .should('be.visible')

      // 5. validações
cy.contains('p.text-destructive', 'Número da OAB inválido.')
  .should('be.visible')

        // 5. validações
cy.contains('p.text-destructive', 'Senha deve ter no mínimo 6 caracteres.')
  .should('be.visible')
      })
    })