let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();

chai.use(chaiHttp);
describe('Stocks',async () => {
    beforeEach((done) => {
        done();
    });

    await describe('/GET Invalid URL', () => {
        it('it should 404 Invalid URL', (done) => {
            chai.request(server)
                .get('/api/stock/1234')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });

        });
    })

    describe('/POST stocks', () => {
        it('it should Save stock', (done) => {
            chai.request(server)
                .post('/api/stocks')
                .send({name: 'Test Stock', qty: 10,unitPrice: 100 })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.response.should.be.a('object');
                    done();
                });

        });
    })

     describe('/GET stocks', () => {

        it('it should GET all the stocks', (done) => {
            chai.request(server)
                .get('/api/stocks')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.response.should.be.a('array');
                    res.body.response.length.should.be.eql(1);
                    done();
                });

        });
    })

    await describe('/GET stocks/{invalid_id}', () => {
        it('it should GET one stock', (done) => {
            chai.request(server)
                .get('/api/stocks/1234')
                .end((err, res) => {
                    res.should.have.status(404);

                });
            done()
        });
    })
})





