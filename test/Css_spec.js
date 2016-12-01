'use strict';

var _Css = require('../src/Css');
var extend = require('../src/extend');
var Sizzle = require('../src/Sizzle');

describe('Css', function() {

	var divEle = null;
	var divEle2 = null;
	var divEle3 = null;
	var jTool = null;

	beforeEach(function() {
		jTool = function(selector, context) {
			return new Sizzle(selector, context);
		};

		Sizzle.prototype = jTool.prototype = {};

		jTool.extend = jTool.prototype.extend = extend;

		jTool.prototype.extend(_Css);


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

	});

	afterEach(function() {
		document.body.removeChild(divEle);
		divEle2.removeChild(divEle3);
		document.body.removeChild(divEle2);
		divEle = null;
		divEle2 = null;
		divEle3 = null;
		jTool = null;
	});

	it('获取 css', function() {
		divEle.style.height = '300px';
		expect(jTool('#div1').css('height')).toBe(300);

		divEle.style.color = '#444444';
		expect(jTool('#div1').css('color')).toBe('rgb(68, 68, 68)');

		divEle.style.fontStyle = 'italic';

		expect(jTool('#div1').css('font-style')).toBe('italic');

		divEle.style.border = '1px solid #fff';
		expect(jTool('#div1').css('border')).toBe('1px solid rgb(255, 255, 255)');
	});

	it('设置 css', function() {
		jTool('#div1').css('height', 0);
		expect(divEle.style.height).toBe('0px');

		jTool('#div1').css('height', 12);
		expect(divEle.style.height).toBe('12px');


		jTool('#div1').css('height', '16px');
		expect(divEle.style.height).toBe('16px');


		jTool('#div1').css('color', '#444444');
		expect(divEle.style.color).toBe('rgb(68, 68, 68)');

		jTool('#div1').css('font-style', 'italic');
		expect(divEle.style.fontStyle).toBe('italic');

		jTool('#div1').css('border', '1px solid #fff');
		expect(divEle.style.border).toBe('1px solid rgb(255, 255, 255)');
	});

	it('设置 css 值是对象', function() {
		jTool('#div2').css({height: 0, width: '100px'});
		expect(divEle2.style.height).toBe('0px');
		expect(divEle2.style.width).toBe('100px');

		jTool('#div3').css({color: '#fff', 'font-size': '18px'});
		expect(divEle3.style.color).toBe('rgb(255, 255, 255)');
		expect(divEle3.style.fontSize).toBe('18px');
	});
});
