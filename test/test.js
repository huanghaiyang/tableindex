'use strict';

var should = require('should'),
	jsdom = require('jsdom'),
	TableConvertor = require('../index');

const tpl = '<!docype html5><html><head><meta charset="utf8"></head><body></body></html>'


describe('tableindex', function() {

	it('1行2列', function(done) {
		jsdom.env('<table><tbody><tr><td></td><td></td></tr></tbody></table>', function(err, window) {
			var table = window.document.body.getElementsByTagName('table')[0];
			var convertor = new TableConvertor(table)
			var storage = convertor.convert().storage;
			storage.should.be.an.Array().and.lengthOf(1)
			storage[0].should.be.an.Array().and.lengthOf(2)
			done()
		});
	});


	it('2行2列', function(done) {
		jsdom.env('<table><tbody><tr><td></td><td></td></tr><tr><td></td><td></td></tr></tbody></table>', function(err, window) {
			var table = window.document.body.getElementsByTagName('table')[0];
			var convertor = new TableConvertor(table)
			var storage = convertor.convert().storage;
			storage.should.be.an.Array().and.lengthOf(2)
			storage[0].should.be.an.Array().and.lengthOf(2)
			storage[1].should.be.an.Array().and.lengthOf(2)
			done()
		});
	});

	it('2行2列,第1个单元格内容为:hello', function(done) {
		jsdom.env('<table><tbody><tr><td>hello</td><td></td></tr><tr><td></td><td></td></tr></tbody></table>', function(err, window) {
			var table = window.document.body.getElementsByTagName('table')[0];
			var convertor = new TableConvertor(table)
			var storage = convertor.convert().storage;
			storage.should.be.an.Array().and.lengthOf(2)
			storage[0].should.be.an.Array().and.lengthOf(2)
			storage[1].should.be.an.Array().and.lengthOf(2)
			storage[0][0].innerHTML.should.be.type('string').equal('hello')
			done()
		});
	});

	it('2行2列,第1个单元格跨2列', function(done) {
		jsdom.env('<table><tbody><tr><td colSpan=2></td></tr><tr><td></td><td></td></tr></tbody></table>', function(err, window) {
			var table = window.document.body.getElementsByTagName('table')[0];
			var convertor = new TableConvertor(table)
			var storage = convertor.convert().storage;
			storage.should.be.an.Array().and.lengthOf(2)
			storage[0].should.be.an.Array().and.lengthOf(2)
			storage[1].should.be.an.Array().and.lengthOf(2);
			(parseInt(storage[0][0].colSpan)).should.be.exactly(2);
			(storage[0][1] === null).should.be.true
			done()
		});
	});

	it('4行4列,第2行第2个单元格跨2行2列', function(done) {
		jsdom.env('<table><tbody><tr><td></td><td></td><td></td><td></td></tr><tr><td></td><td rowSpan=2 colSpan=2></td><td></td></tr><tr><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td></tr></tbody></table>', function(err, window) {
			var table = window.document.body.getElementsByTagName('table')[0];
			var convertor = new TableConvertor(table);
			var storage = convertor.convert().storage;
			storage.should.be.an.Array().and.lengthOf(4);
			storage[0].should.be.an.Array().and.lengthOf(4);
			storage[1].should.be.an.Array().and.lengthOf(4);
			storage[2].should.be.an.Array().and.lengthOf(4);
			storage[3].should.be.an.Array().and.lengthOf(4);
			(parseInt(storage[1][1].colSpan)).should.be.exactly(2);
			(parseInt(storage[1][1].rowSpan)).should.be.exactly(2);
			(storage[1][2] === null).should.be.true;
			(storage[1][3] === null).should.be.true;
			(storage[2][1] === null).should.be.true;
			(storage[2][2] === null).should.be.true;
			(storage[2][3] === null).should.be.true;
			done()
		});
	});
});