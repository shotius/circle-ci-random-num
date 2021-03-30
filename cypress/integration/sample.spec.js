describe('load live server', function() {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:5500/index.html')
        cy.fixture("example").as('ex')
    })

    it('random number is in range', function() {
        cy.get('#random-number').should(($div) => {
            const n = parseFloat($div.text())
            expect(n).to.be.gte(1).be.lte(10)
        })
    })

    it('clicking button to hide random number', function() {
        cy.get(".info").debug().click()
        cy.get('#random-number').should("not.be.visible")
    })

    it('testing promise then keyword', function() {
        cy.get('button').then(($div) => {
            const text = $div.text()
            cy.log(text)

            cy.get('button').then(($div2) => {
                expect($div2.text()).to.eq(text)
            })
        })
    })

    it('fixture with aliases', function() {
        const mail = this.ex.email
        cy.log(mail)
    })

    it('find selector which doesnt exist', function() {
        cy.get('body').should('not.have', 'a')
    })

    it.only('find text which does not exist', function() {
        cy.get('body').then(($body) => {
            if ($body.text().includes('text which does not exist')){
                cy.log('text found')
            } else {
                cy.log('text not found')
            }
        })
    })
})

describe.only('stubbing', function() {
    it('create get and post methods', function() {
        cy.intercept(
            {
                method: "GET",
                url: '/users/*'
            },
            {fixture: 'example.json'}
        )

        cy.intercept(
            {
                method: 'POST',
                url: '/todos/*',
            },
            []
        )
    })

    it('create stub', function() {
       const obj = {
           foo() {}
       }

       const stub = cy.stub(obj, 'foo').as('objFoo')

       stub()
       expect(stub).to.be.called
    })

    it('stubs and spy', function() {
        const user = {
            getName: (args) => {
                return args
            },
            updateEmail: (args) => {
                return args
            },
            fail: () => {
                throw new Error('fail whale')
            }
        }

        cy.stub(user, 'getName').returns('Jane Lane')

        cy.spy(user, 'updateEmail')

        cy.spy(user, 'fail')

        const name = user.getName(123)
        // const email = user.updateEmail('example@email.com')

        expect(name).to.eq("Jane Lane")

        // expect(email).to.eq('example@email.com')
        expect(user.updateEmail).to.be.called
        
    })
})