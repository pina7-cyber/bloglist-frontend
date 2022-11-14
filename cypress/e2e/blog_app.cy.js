
describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user1 = {
        name: 'Pina Cyber',
        username: 'pina7',
        password: 'secret'
      }
    const user2 = {
        name: 'Another Cyber',
        username: 'another',
        password: 'topsecret'
      }
    cy.request('POST', 'http://localhost:3001/api/users/', user1)
    cy.request('POST', 'http://localhost:3001/api/users/', user2)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
        cy.get('#username').type('pina7')
        cy.get('#password').type('secret')
        cy.get('#login-button').click()
        cy.contains('Pina Cyber logged-in')
    })

    it('fails with wrong credentials', function() {
        cy.get('#username').type('pina7')
        cy.get('#password').type('wrong')
        cy.get('#login-button').click()

        cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    
        cy.get('html').should('not.contain', 'Pina Cyber logged-in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
        cy.login({ username: 'pina7', password: 'secret' })
    })
    
    it('A blog can be created', function() {
        cy.contains('create new Blog').click()
        cy.get('#title').type('a blog created by cypress')
        cy.get('#author').type('cypress')
        cy.get('#url').type('www.cypress-blog.de')
        cy.get('#create-button').click()
        cy.contains('a blog created by cypress')
    })

    describe('and there is a posted blog of the logged-in user', function() {
        beforeEach(function() {
            cy.createBlog({ title: 'a blog created by cypress', author: 'cypress', url: 'www.cypress-blog.de' })
        })
        
        it('can be liked', function() {
            cy.contains('a blog created by cypress')
            cy.contains('0')
            cy.get('#toggle-button').click()
            cy.get('#like-button').click()
            cy.contains('1')
        })

        it('can be deleted', function() {
            cy.contains('a blog created by cypress')
            cy.get('#toggle-button').click()
            cy.get('#delete-button').click()
            cy.get('html').should('not.contain', 'a blog created by cypress')
        })
    })

    describe('and there is a posted blog of another user', function() {
        beforeEach(function() {
            cy.createBlog({ title: 'a blog created by cypress', author: 'cypress', url: 'www.cypress-blog.de' })
            cy.login({ username: 'another', password: 'topsecret' })
        })
        
        it('can be liked', function() {
            cy.contains('a blog created by cypress')
            cy.contains('0')
            cy.get('#toggle-button').click()
            cy.get('#like-button').click()
            cy.contains('1')
        })

        it('cannot be deleted', function() {
            cy.contains('a blog created by cypress')
            cy.get('#toggle-button').click()
            cy.get('#delete-button').parent().should('have.css', 'display', 'none')
            cy.get('#delete-button').click({force: true})
            cy.get('.error')
               .should('contain', 'must be creator of blog to delete it')
               .and('have.css', 'color', 'rgb(255, 0, 0)')
            cy.contains('a blog created by cypress')
        })
    })

    describe('and there are several posted blogs', function() {
        beforeEach(function() {
            cy.createBlog({ title: 'The title with the most likes', author: 'cypress', url: 'www.cypress-blog1.de', likes: 24 })
            cy.createBlog({ title: 'The title with the fewest likes', author: 'cypress', url: 'www.cypress-blog3.de', likes: 2 })
            cy.createBlog({ title: 'The title with the second most likes', author: 'cypress', url: 'www.cypress-blog2.de', likes: 13 })
        })
        
        it('blogs are listed in a descending order regarding to likes', function() {
            cy.get('.blog').eq(0).should('contain', 'The title with the most likes')
            cy.get('.blog').eq(1).should('contain', 'The title with the second most likes')
            cy.get('.blog').eq(2).should('contain', 'The title with the fewest likes')
        })
    })

  })
})