'use strict';

var _Offset = require('../src/Offset');
var extend = require('../src/extend');
var Sizzle = require('../src/Sizzle');

describe('Offset', function() {

	var divEle = null;
	var divEle2 = null;
	var divEle3 = null;
	var divEle4 = null;
	var divEle5 = null;
	var jTool = null;

	beforeEach(function() {
		jTool = function(selector, context) {
			return new Sizzle(selector, context);
		};

		Sizzle.prototype = jTool.prototype = {};

		jTool.extend = jTool.prototype.extend = extend;

		jTool.prototype.extend(_Offset);


		divEle = document.createElement('div');
		divEle.id = 'div1';
		document.body.appendChild(divEle);

		divEle2 = document.createElement('div');
		divEle2.id = 'div2';
		document.body.appendChild(divEle2);

		divEle3 = document.createElement('div');
		divEle3.id = 'div3';
		divEle3.style.left = '60px';
		divEle3.style.top = '80px';
		divEle3.style.position = 'relative';
		divEle2.appendChild(divEle3);

		divEle4 = document.createElement('div');
		divEle4.id = 'div4';
		divEle4.style.left = '100px';
		divEle4.style.top = '100px';
		divEle4.style.position = 'absolute';
		divEle2.appendChild(divEle4);

		divEle5 = document.createElement('div');
		divEle5.style.height = '2000px';
		divEle5.style.width = '2000px';
		divEle5.id = 'div5';
		divEle2.appendChild(divEle5);

		window.scroll(0, 1000);

	});

	afterEach(function() {
		document.body.removeChild(divEle);
		divEle2.removeChild(divEle3);
		divEle2.removeChild(divEle4);
		divEle2.removeChild(divEle5);
		document.body.removeChild(divEle2);
		divEle = null;
		divEle2 = null;
		divEle3 = null;
		divEle4 = null;
		divEle5 = null;
		jTool = null;
	});

	it('offset', function() {
		var clientRectDiv1 = divEle.getBoundingClientRect();
		var clientRectDiv3 = divEle3.getBoundingClientRect();
		var clientRectDiv4 = divEle4.getBoundingClientRect();
		expect(jTool('#div1').offset()).toEqual({top: clientRectDiv1.top + window.scrollY, left: clientRectDiv1.left + window.scrollX});
		expect(jTool('#div3').offset()).toEqual({top: clientRectDiv3.top + window.scrollY, left: clientRectDiv3.left + window.scrollX});
		expect(jTool('#div4').offset()).toEqual({top: clientRectDiv4.top + window.scrollY, left: clientRectDiv4.left + window.scrollX});
	});

	it('get scrollTop', function() {
		expect(jTool(window).scrollTop()).toBe(window.pageYOffset);
		expect(jTool(document).scrollTop()).toBe(document.body.scrollTop);
		expect(jTool('#div5').scrollTop()).toBe(divEle5.scrollTop);
	});

	it('get scrollLeft', function() {
		expect(jTool(window).scrollLeft()).toBe(window.pageXOffset);
		expect(jTool(document).scrollLeft()).toBe(document.body.scrollLeft);
		expect(jTool('#div5').scrollLeft()).toBe(divEle5.scrollLeft);
	});

	it('set scrollTop', function() {
		jTool(window).scrollTop(700);
		expect(window.pageYOffset).toBe(700);
		jTool(document).scrollTop(600);
		expect(document.body.scrollTop).toBe(600);
	});

	it('set scrollLeft', function() {
		jTool(window).scrollLeft(700);
		expect(window.pageXOffset).toBe(700);
		jTool(document).scrollLeft(600);
		expect(document.body.scrollLeft).toBe(600);
	});
});
