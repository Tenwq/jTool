var _Event = require('../src/Event');
var Sizzle = require('../src/Sizzle');
var extend = require('../src/extend');

describe('Event', function() {

	var jTool = null;
	var pEle = null;
	var pEle2 = null;

	beforeEach(function() {
		jTool = function(selector, context) {
            return new Sizzle(selector, context);
		};

		Sizzle.prototype = jTool.prototype = {};

		jTool.extend = jTool.prototype.extend = extend;

		jTool.prototype.extend(_Event);


		pEle = document.createElement('p');
		pEle.id = 'p1';

		document.body.appendChild(pEle);

		pEle2 = document.createElement('p');
		pEle2.id = 'p2';

		document.body.appendChild(pEle2);

		spyOn(pEle2, 'addEventListener');
		spyOn(pEle2, 'removeEventListener');
	});

	afterEach(function() {
		jTool = null;
		document.body.removeChild(pEle);
		document.body.removeChild(pEle2);
		pEle = null;
		pEle2 = null;
	});

	it('注册事件', function() {
		var clickHandler = jasmine.createSpy('clickHandler');
		jTool('#p2').on('click', clickHandler);

		expect(clickHandler.calls.count()).toBe(0);
		expect(pEle2.addEventListener).toHaveBeenCalled();
		expect(pEle2.addEventListener).toHaveBeenCalledWith('click', clickHandler, false);

		jTool('#p2').off('click');
	});

	it('删除事件', function() {
		var clickHandler = jasmine.createSpy('clickHandler');
		jTool('#p2').on('click', clickHandler);
		jTool('#p2').off('click');
	});

	it('注册事件 是否冒泡', function() {
		var clickHandler = jasmine.createSpy('clickHandler');
		jTool('#p2').on('click', clickHandler, true);

		expect(clickHandler.calls.count()).toBe(0);
		expect(pEle2.addEventListener).toHaveBeenCalled();
		expect(pEle2.addEventListener).toHaveBeenCalledWith('click', clickHandler, true);
		jTool('#p2').off('click');
	});

	it('注册多个事件', function() {
		var mouseupHandler = jasmine.createSpy('mouseupHandler');
		var mouseupHandler2 = jasmine.createSpy('mouseupHandler2');

		jTool('#p2').on('mouseup', mouseupHandler).on('mouseup', mouseupHandler2);
		expect(mouseupHandler.calls.count()).toBe(0);
		expect(mouseupHandler2.calls.count()).toBe(0);
		expect(pEle2.addEventListener).toHaveBeenCalledTimes(2);
		expect(pEle2.addEventListener).toHaveBeenCalledWith('mouseup', mouseupHandler, false);
		expect(pEle2.addEventListener).toHaveBeenCalledWith('mouseup', mouseupHandler2, false);
		jTool('#p2').off('mouseup');
	});

	it('注册多个不同事件', function() {
		var mousedownHandler = jasmine.createSpy('mousedownHandler');
		var clickHandler = jasmine.createSpy('clickHandler');
		jTool('#p2').on('mousedown', mousedownHandler).on('click', clickHandler);

		expect(mousedownHandler.calls.count()).toBe(0);
		expect(clickHandler.calls.count()).toBe(0);

		expect(pEle2.addEventListener).toHaveBeenCalledTimes(2);
		expect(pEle2.addEventListener).toHaveBeenCalledWith('mousedown', mousedownHandler, false);
		expect(pEle2.addEventListener).toHaveBeenCalledWith('click', clickHandler, false);

		jTool('#p2').off('mousedown');
	});

	it('注册多个不同事件 2', function() {
		var handler = jasmine.createSpy('handler');
		jTool('#p2').on('mousedown click click mousedown', handler);

		expect(pEle2.addEventListener).toHaveBeenCalledTimes(4);
		expect(pEle2.addEventListener).toHaveBeenCalledWith('mousedown', handler, false);
		expect(pEle2.addEventListener).toHaveBeenCalledWith('click', handler, false);

		jTool('#p2').off('mousedown click click mousedown');
		expect(pEle2.removeEventListener).toHaveBeenCalledTimes(4);
		expect(pEle2.removeEventListener).toHaveBeenCalledWith('mousedown', handler);
		expect(pEle2.removeEventListener).toHaveBeenCalledWith('click', handler);
	});

	it('触发事件', function () {
		var mousedownHandler = jasmine.createSpy('mousedownHandler');
		var clickHandler = jasmine.createSpy('clickHandler');
		jTool('#p1').on('mousedown', mousedownHandler).on('click', clickHandler).trigger('click').trigger('click').trigger('mousedown');

		expect(mousedownHandler.calls.count()).toBe(1);
		expect(clickHandler.calls.count()).toBe(2);
		jTool('#p1').off('mousedown');
	});

	// it('如果没有注册 click 事件, 触发 click 事件 抛出异常', function () {
	// 	try {
	// 		jTool('#p1').trigger('click');
	// 	} catch (err) {
	// 		expect(err.message).toEqual(jasmine.stringMatching(/mouseover/));
	// 	}
	// });
    //
	// it('如果没有注册 mouseover 事件, 触发 mouseover 事件 抛出异常', function () {
	// 	try {
	// 		jTool('#p1').trigger('mouseover');
	// 	} catch (err) {
	// 		expect(err.message).toEqual(jasmine.stringMatching(/mouseover/));
	// 	}
	// });

	it('测试 window', function () {
		var mousedownHandler = jasmine.createSpy('mousedownHandler');
		var clickHandler = jasmine.createSpy('clickHandler');
		jTool(window).on('mousedown', mousedownHandler).on('click', clickHandler).trigger('click').trigger('click').trigger('mousedown');

		expect(mousedownHandler.calls.count()).toBe(1);
		expect(clickHandler.calls.count()).toBe(2);
		jTool(window).off('mousedown');
	});

	it('测试 document', function () {
		var mousedownHandler = jasmine.createSpy('mousedownHandler');
		var clickHandler = jasmine.createSpy('clickHandler');
		jTool(document).on('mousedown', mousedownHandler).on('click', clickHandler).trigger('click').trigger('click').trigger('mousedown');

		expect(mousedownHandler.calls.count()).toBe(1);
		expect(clickHandler.calls.count()).toBe(2);
		jTool(document).off('mousedown');
	});

	it('测试双击事件', function () {
		var dblclickHandler = jasmine.createSpy('dblclickHandler');
		jTool(document).on('dblclick', dblclickHandler).trigger('dblclick');

		expect(dblclickHandler.calls.count()).toBe(1);
		jTool(document).off('dblclick');
	});

	// 只有click事件可以通过trigger进行调用, 需要修改.(但是通过真实的事件触发,是不会有问题的)
	it('子选择器预绑定事件', function () {
		var clickHandler = jasmine.createSpy('clickHandler');
		jTool('#p1').on('click', 'span', clickHandler);
		var span1 = document.createElement('span');
		span1.className = 'span1';
		document.querySelector('#p1').appendChild(span1);
		jTool('.span1').trigger('click');
		expect(clickHandler.calls.count()).toBe(1);


		document.querySelector('#p1').removeChild(span1);
		span1 = null;
		jTool('#p1').off('click');
	});
});
