// Require the dev-dependencies
import * as chai from 'chai';
import { expect } from 'chai';
import chaiHttp from 'chai-http';
const server = require('../../src/index');

chai.should();
chai.use(chaiHttp);
let chaiLib = <any>chai;
let chaiRequestLib = chaiLib.default.request;
const baseUrl = process.env.BASE_URL

// Our parent block
describe('Endpoint Tests', () => {
  /*
  * Test the /BASE route
  */
  describe('/BASE endpoint', () => {
    it('it should call the base endpoint and return a JSON', (done) => {
        chaiRequestLib(baseUrl)
        .get('/base')
        .end((err: any, res: any) => {
            res.status
          res.status.should.be.equal(200);
          res.body.should.have.property('message', 'Welcome to Indicina API');          done();
        });
    });
  });

  describe('/ENCODE', () => {
    it('it should return a validation error when an invalid authorization code is passed', (done) => {
        chaiRequestLib(baseUrl)
        .post('/encode')
        .send()
        .end((err: any, res: any) => {
          res.status.should.be.equal(403);
          res.body.should.have.property('message', 'invalid authorization code');
          done();
        });
    });

    it('it should return a validation error when the request body is empty', (done) => {
        chaiRequestLib(baseUrl)
        .post('/encode')
        .set('Authorization', 'Bearer th1sjust4ny4and0mm5tr1ng')
        .send()
        .end((err: any, res: any) => {
          res.status.should.be.equal(422);
          res.body.should.have.property('message', '"url" is required');
          done();
        });
    });

    it('it does not encode when the url supplied is invalid', (done) => {
      const body = {
        url: 'jebzmos4'
      };
      chaiRequestLib(baseUrl)
        .post('/encode')
        .set('Authorization', 'Bearer th1sjust4ny4and0mm5tr1ng')
        .send(body)
        .end((err: any, res: any) => {
          res.status.should.be.equal(422);
          res.body.should.have.property('message', 'ERR_INVALID_URL');
          done();
        });
    });

    it('it returns the encoded version of the supplied url', (done) => {
        const body = {
            url: 'https://www.netflix.com/watch/70116077?trackId=155573558'
          };
        chaiRequestLib(baseUrl)
          .post('/encode')
          .set('Authorization', 'Bearer th1sjust4ny4and0mm5tr1ng')
          .send(body)
          .end((err: any, res: any) => {
            res.status.should.be.equal(200);
            expect(res.body.message).to.match(/localhost:9000/)
            done();
          });
      });

    it('it returns the supplied url if it exist as an encoded url in memory', (done) => {
        const body = {
            url: 'https://www.netflix.com/watch/70116077?trackId=155573558'
        };

        chaiRequestLib(baseUrl)
        .post('/encode')
        .set('Authorization', 'Bearer th1sjust4ny4and0mm5tr1ng')
        .send(body)
        .end((err: any, res: any) => {
            res.status.should.be.equal(200);
            expect(res.body.message).to.match(/localhost:9000/)
    
            chaiRequestLib(baseUrl)
              .post('/encode')
              .set('Authorization', 'Bearer th1sjust4ny4and0mm5tr1ng')
              .send({url: res.body.message})
              .end((err: any, res: any) => {
                res.status.should.be.equal(200);
                res.body.should.have.property('message', res.body.message);
                done();
              });
        });
      });
  });

  describe('/CODE', () => {
      
    it('it should return a validation error when the code does not exist', (done) => {
        chaiRequestLib(baseUrl)
        .get('/HLjGxlDsbg')
        .set('Authorization', 'Bearer th1sjust4ny4and0mm5tr1ng')
        .send()
        .end((err: any, res: any) => {
          res.status.should.be.equal(422);
          res.body.should.have.property('message', 'shortened url does not exist');
          done();
        });
    });

    it('it should redirect to the appropriate website when the code exists', (done) => {
        chaiRequestLib(baseUrl)
        .get('/ywB9ZRamBG')
        .set('Authorization', 'Bearer th1sjust4ny4and0mm5tr1ng')
        .send()
        .end((err: any, res: any) => {
          res.status.should.be.equal(200);
          res.should.redirectTo('https://www.netflix.com/watch/70116077?trackId=155573558');
          done();
        });
    });
  });

  describe('/statistics/:code', () => {

    it('it should return a validation error when the request body is empty', (done) => {
        chaiRequestLib(baseUrl)
        .get('/statistics/')
        .set('Authorization', 'Bearer th1sjust4ny4and0mm5tr1ng')
        .send()
        .end((err: any, res: any) => {
          res.status.should.be.equal(422);
          res.body.should.have.property('message', 'shortened url does not exist');
          done();
        });
    });

    it('it should return the statistics of a code', (done) => {
        chaiRequestLib(baseUrl)
        .get('/statistics/ywB9ZRamBG')
        .set('Authorization', 'Bearer th1sjust4ny4and0mm5tr1ng')
        .send()
        .end((err: any, res: any) => {
          res.status.should.be.equal(200);
          expect(res.body.message).keys(['url', 'redirectCount', 'createdAt'])
          res.body.message.should.have.property('url', 'https://www.netflix.com/watch/70116077?trackId=155573558')
          done();
        });
    });
  })
});
