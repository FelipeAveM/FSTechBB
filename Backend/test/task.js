let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);
const url = 'http://localhost:3000';


describe('Locations API', () => {

    /**GETs test */
    describe("Get all locations", () => {
        it("should GET all the locations", (done) => {
            chai.request(url)
                .get('/get/locations/')
                .end(function (err, res) {
                    //console.log(res.body)
                    expect(res).to.have.status(200);
                    done()
                })
        })
    })

    describe("Get location by id", () => {
        it("should GET the location by id", (done) => {
            chai.request(url)
                .get('/get/location/:id=1')
                .end(function (err, res) {
                    //console.log(res.body)
                    expect(res).to.have.status(200);
                    done()
                })
        })
    })

    describe("Get parent by id", () => {
        it("should GET the parent location by id", (done) => {
            chai.request(url)
                .get('/get/parent/:id=1')
                .end(function (err, res) {
                    //console.log(res.body)
                    expect(res).to.have.status(200);
                    done()
                })
        })
    })

    describe("Get area by id", () => {
        it("should GET the area by id", (done) => {
            chai.request(url)
                .get('/get/internals/1')
                .end(function (err, res) {
                    //console.log(res.body)
                    expect(res).to.have.status(200);
                    done()
                })
        })
    })

    /**POSTs test*/

    describe('Insert a location', () => {
        it('should insert a location', (done) => {
            chai.request(url)
                .post('/add/location')
                .send({
                    "id": 7,
                    "name": "Zipa",
                    "area_m2": 890000,
                    "parent_loc": 2,
                    "internal_loc": [5, 7, 8]
                })
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe('Delete a location: ', () => {
        it('should delete data from an existing location', (done) => {
            chai.request(url)
                .post('/remove/location/6')
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe('Insert a location', () => {
        it('should insert a location', (done) => {
            chai.request(url)
                .post('/add/location')
                .send({
                    "id": 7,
                    "name": "Zipa",
                    "area_m2": 890000,
                    "parent_loc": 2,
                    "internal_loc": [5, 7, 8]
                })
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe('Insert a internals locations by id', () => {
        it('should insert a internals locations by id', (done) => {
            chai.request(url)
                .post('/add/internals')
                .send({
                    "id": 7,
                    "internal_loc": [1, 2]
                })
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe('Update a location: ', () => {
        it('should update data from an existing location', (done) => {
            chai.request(url)
                .post('/update/location')
                .send({
                    "id": 6,
                    "name": "Zipaquira",
                    "area_m2": 890000,
                    "parent_loc": 2,
                    "internal_loc": [5, 7, 8]
                })
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe('Update a name location: ', () => {
        it('should update name from an existing location', (done) => {
            chai.request(url)
                .post('/update/name')
                .send({
                    "id": 7,
                    "name": "Zipaquira",
                    "area_m2": 890000,
                    "parent_loc": 2,
                    "internal_loc": [5, 7, 8]
                })
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe('Update an area location: ', () => {
        it('should update area from an existing location', (done) => {
            chai.request(url)
                .post('/update/area')
                .send({
                    "id": 7,
                    "name": "Zipaquira",
                    "area_m2": 990000,
                    "parent_loc": 2,
                    "internal_loc": [5, 7, 8]
                })
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe('Update a parent location: ', () => {
        it('should update parent from an existing location', (done) => {
            chai.request(url)
                .post('/update/parent')
                .send({
                    "id": 7,
                    "name": "Zipaquira",
                    "area_m2": 890000,
                    "parent_loc": 2,
                    "internal_loc": [5, 7, 8]
                })
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe('Update a internals location: ', () => {
        it('should update internals from an existing location', (done) => {
            chai.request(url)
                .post('/update/internals')
                .send({
                    "id": 7,
                    "name": "Zipaquira",
                    "area_m2": 890000,
                    "parent_loc": 2,
                    "internal_loc": [5, 7, 8]
                })
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });
})
