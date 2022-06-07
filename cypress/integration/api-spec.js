import "../support"
describe("api tests", () => {
    it("api testcase",{ tags: '@smoke' } ,() => {
        cy.request('https://reqres.in/api/users/2')
        .should((response) => {
            expect(response.status).to.eq(200)
            //expect(response).to.have.property('email').to.contain('janet.weaver@reqres.in')
            //expect(response.body).property('data').to.contain('janet.weaver@reqres.in')
        })
    })
})