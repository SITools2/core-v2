/***************************************
* Copyright 2010-2016 CNES - CENTRE NATIONAL d'ETUDES SPATIALES
* 
* This file is part of SITools2.
* 
* SITools2 is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
* 
* SITools2 is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* 
* You should have received a copy of the GNU General Public License
* along with SITools2.  If not, see <http://www.gnu.org/licenses/>.
***************************************/
/**
 * Define a specific DatePicker to offer possibility to choose Hours Minutes and Seconds
 * @class Ext.SitoolsDatePicker
 * @extends Ext.BoxComponent
 */
Ext.define('sitools.public.widget.date.DatePicker', {
    alternateClassName : ['Ext.SitoolsDatePicker'],
    extend : 'Ext.Component',
    alias : 'widget.datepicker',
    todayText : 'Today',
    /**
     * @cfg {String} okText
     * The text to display on the ok button (defaults to <code>'&#160;OK&#160;'</code> to give the user extra clicking room)
     */
    okText : '&#160;OK&#160;',
    /**
     * @cfg {String} cancelText
     * The text to display on the cancel button (defaults to <code>'Cancel'</code>)
     */
    cancelText : 'Cancel',
    /**
     * @cfg {Function} handler
     * Optional. A function that will handle the select event of this picker.
     * The handler is passed the following parameters:<div class="mdetail-params"><ul>
     * <li><code>picker</code> : DatePicker<div class="sub-desc">This DatePicker.</div></li>
     * <li><code>date</code> : Date<div class="sub-desc">The selected date.</div></li>
     * </ul></div>
     */
    /**
     * @cfg {Object} scope
     * The scope (<code><b>this</b></code> reference) in which the <code>{@link #handler}</code>
     * function will be called.  Defaults to this DatePicker instance.
     */
    /**
     * @cfg {String} todayTip
     * A string used to format the message for displaying in a tooltip over the button that
     * selects the current date. Defaults to <code>'{0} (Spacebar)'</code> where
     * the <code>{0}</code> token is replaced by today's date.
     */
    todayTip : '{0} (Spacebar)',
    /**
     * @cfg {String} minText
     * The error text to display if the minDate validation fails (defaults to <code>'This date is before the minimum date'</code>)
     */
    minText : 'This date is before the minimum date',
    /**
     * @cfg {String} maxText
     * The error text to display if the maxDate validation fails (defaults to <code>'This date is after the maximum date'</code>)
     */
    maxText : 'This date is after the maximum date',
    /**
     * @cfg {String} format
     * The default date format string which can be overriden for localization support.  The format must be
     * valid according to {@link Date#parseDate} (defaults to <code>'m/d/y'</code>).
     */
    format : 'm/d/y',
    /**
     * @cfg {String} disabledDaysText
     * The tooltip to display when the date falls on a disabled day (defaults to <code>'Disabled'</code>)
     */
    disabledDaysText : 'Disabled',
    /**
     * @cfg {String} disabledDatesText
     * The tooltip text to display when the date falls on a disabled date (defaults to <code>'Disabled'</code>)
     */
    disabledDatesText : 'Disabled',
    /**
     * @cfg {Array} monthNames
     * An array of textual month names which can be overriden for localization support (defaults to Date.monthNames)
     */
    monthNames : Date.monthNames,
    /**
     * @cfg {Array} dayNames
     * An array of textual day names which can be overriden for localization support (defaults to Date.dayNames)
     */
    dayNames : Date.dayNames,
    /**
     * @cfg {String} nextText
     * The next month navigation button tooltip (defaults to <code>'Next Month (Control+Right)'</code>)
     */
    nextText : 'Next Month (Control+Right)',
    /**
     * @cfg {String} prevText
     * The previous month navigation button tooltip (defaults to <code>'Previous Month (Control+Left)'</code>)
     */
    prevText : 'Previous Month (Control+Left)',
    /**
     * @cfg {String} monthYearText
     * The header month selector tooltip (defaults to <code>'Choose a month (Control+Up/Down to move years)'</code>)
     */
    monthYearText : 'Choose a month (Control+Up/Down to move years)',
    /**
     * @cfg {Number} startDay
     * Day index at which the week should begin, 0-based (defaults to 0, which is Sunday)
     */
    startDay : 0,
    /**
     * @cfg {Boolean} showToday
     * False to hide the footer area containing the Today button and disable the keyboard handler for spacebar
     * that selects the current date (defaults to <code>true</code>).
     */
    showToday : true,
    
    /**
     * @cfg {Boolean} showTime
     * False to hide the footer area containing the hour definition
     * (defaults to <code>false</code>).
     */
    showTime : false, 
    
    
    
    

    
    // private
    // Set by other components to stop the picker focus being updated when the value changes.
    focusOnSelect: true,

    
    
    // default value used to initialise each date in the DatePicker
    // (note: 12 noon was chosen because it steers well clear of all DST timezone changes)
    initHour: 12, 

    
    initComponent : function(){
        Ext.SitoolsDatePicker.superclass.initComponent.call(this);

        this.value = this.value ?
                 this.value.clearTime(true) : new Date().clearTime();
		this.hourValue = this.value ? this.value.getHours() : new Date().getHours();
		this.minuteValue = this.value ? this.value.getMinutes() : new Date().getMinutes();
		this.secondValue = this.value ? this.value.getSeconds() : new Date().getSeconds();
		
        this.addEvents(
            
            'select'
        );

        if(this.handler){
            this.on('select', this.handler,  this.scope || this);
        }

        this.initDisabledDays();
    },

    
    // private
    initDisabledDays : function(){
        if(!this.disabledDatesRE && this.disabledDates){
            var dd = this.disabledDates,
                len = dd.length - 1,
                re = '(?:';

            Ext.each(dd, function(d, i){
                re += Ext.isDate(d) ? '^' + Ext.escapeRe(d.dateFormat(this.format)) + '$' : dd[i];
                if(i != len){
                    re += '|';
                }
            }, this);
            this.disabledDatesRE = new RegExp(re + ')');
        }
    },

    
    /**
     * Replaces any existing disabled dates with new values and refreshes the DatePicker.
     * @param {Array/RegExp} disabledDates An array of date strings (see the {@link #disabledDates} config
     * for details on supported values), or a JavaScript regular expression used to disable a pattern of dates.
     */
    setDisabledDates : function(dd){
        if(Ext.isArray(dd)){
            this.disabledDates = dd;
            this.disabledDatesRE = null;
        }else{
            this.disabledDatesRE = dd;
        }
        this.initDisabledDays();
        this.update(this.value, true);
    },

    
    /**
     * Replaces any existing disabled days (by index, 0-6) with new values and refreshes the DatePicker.
     * @param {Array} disabledDays An array of disabled day indexes. See the {@link #disabledDays} config
     * for details on supported values.
     */
    setDisabledDays : function(dd){
        this.disabledDays = dd;
        this.update(this.value, true);
    },

    
    /**
     * Replaces any existing {@link #minDate} with the new value and refreshes the DatePicker.
     * @param {Date} value The minimum date that can be selected
     */
    setMinDate : function(dt){
        this.minDate = dt;
        this.update(this.value, true);
    },

    
    /**
     * Replaces any existing {@link #maxDate} with the new value and refreshes the DatePicker.
     * @param {Date} value The maximum date that can be selected
     */
    setMaxDate : function(dt){
        this.maxDate = dt;
        this.update(this.value, true);
    },

    
    /**
     * Sets the value of the date field
     * @param {Date} value The date to set
     */
    setValue : function(value){
        this.value = value;
        this.update(this.value);
    },

    
    /**
     * Gets the current selected value of the date field
     * @return {Date} The selected date
     */
    getValue : function(){
        return this.value;
    },

    
    // private
    focus : function(){
        this.update(this.activeDate);
        if (this.showTime) {
        	this.updateTime(this.activeDate);
        }
    },
    // private
	updateTime : function (date) {
		this.hourField.setValue(date.getHours());
		this.minuteField.setValue(date.getMinutes());
		this.secondField.setValue(date.getSeconds());
	}, 
    
    // private
    onEnable: function(initial){
        Ext.SitoolsDatePicker.superclass.onEnable.call(this);
        this.doDisabled(false);
        this.update(initial ? this.value : this.activeDate);
        if(Ext.isIE){
            this.el.repaint();
        }

    },

    
    // private
    onDisable : function(){
        Ext.SitoolsDatePicker.superclass.onDisable.call(this);
        this.doDisabled(true);
        if(Ext.isIE && !Ext.isIE8){
            /* Really strange problem in IE6/7, when disabled, have to explicitly
             * repaint each of the nodes to get them to display correctly, simply
             * calling repaint on the main element doesn't appear to be enough.
             */
            
             Ext.each([].concat(this.textNodes, this.el.query('th span')), function(el){
                 Ext.fly(el).repaint();
             });
        }
    },

    
    // private
    doDisabled : function(disabled){
        this.keyNav.setDisabled(disabled);
        this.prevRepeater.setDisabled(disabled);
        this.nextRepeater.setDisabled(disabled);
        if(this.showToday){
            this.todayKeyListener.setDisabled(disabled);
            this.todayBtn.setDisabled(disabled);
        }
    },

    
    // private
    onRender : function(container, position){
        var m = [
             '<table cellspacing="0">',
                '<tr><td class="x-date-left"><a href="#" title="', this.prevText ,'">&#160;</a></td><td class="x-date-middle" align="center"></td><td class="x-date-right"><a href="#" title="', this.nextText ,'">&#160;</a></td></tr>',
                '<tr><td colspan="3"><table class="x-date-inner" cellspacing="0"><thead><tr>'],
                dn = this.dayNames,
                i;
        for(i = 0; i < 7; i++){
            var d = this.startDay+i;
            if(d > 6){
                d = d-7;
            }
            m.push('<th><span>', dn[d].substr(0,1), '</span></th>');
        }
        m[m.length] = '</tr></thead><tbody><tr>';
        for(i = 0; i < 42; i++) {
            if(i % 7 === 0 && i !== 0){
                m[m.length] = '</tr><tr>';
            }
            m[m.length] = '<td><a href="#" hidefocus="on" class="x-date-date" tabIndex="1"><em><span></span></em></a></td>';
        }
        m.push('</tr></tbody></table></td></tr>',
                this.showTime ? '<tr><td colspan="3" class="x-date-time" align="center"></td></tr>' : '',
                this.showToday ? '<tr><td colspan="3" class="x-date-bottom" align="center"></td></tr>' : '',
                '</table><div class="x-date-mp"></div>');

        var el = document.createElement('div');
        el.className = 'x-date-picker';
        el.innerHTML = m.join('');

        container.dom.insertBefore(el, position);

        this.el = Ext.get(el);
        this.eventEl = Ext.get(el.firstChild);

        this.prevRepeater = new Ext.util.ClickRepeater(this.el.child('td.x-date-left a'), {
            handler: this.showPrevMonth,
            scope: this,
            preventDefault:true,
            stopDefault:true
        });

        this.nextRepeater = new Ext.util.ClickRepeater(this.el.child('td.x-date-right a'), {
            handler: this.showNextMonth,
            scope: this,
            preventDefault:true,
            stopDefault:true
        });

        this.monthPicker = this.el.down('div.x-date-mp');
        this.monthPicker.enableDisplayMode('block');

        this.keyNav = new Ext.KeyNav(this.eventEl, {
            'left' : function(e){
                if(e.ctrlKey){
                    this.showPrevMonth();
                }else{
                    this.update(this.activeDate.add('d', -1));
                }
            },

            'right' : function(e){
                if(e.ctrlKey){
                    this.showNextMonth();
                }else{
                    this.update(this.activeDate.add('d', 1));
                }
            },

            'up' : function(e){
                if(e.ctrlKey){
                    this.showNextYear();
                }else{
                    this.update(this.activeDate.add('d', -7));
                }
            },

            'down' : function(e){
                if(e.ctrlKey){
                    this.showPrevYear();
                }else{
                    this.update(this.activeDate.add('d', 7));
                }
            },

            'pageUp' : function(e){
                this.showNextMonth();
            },

            'pageDown' : function(e){
                this.showPrevMonth();
            },

            'enter' : function(e){
                e.stopPropagation();
                return true;
            },

            scope : this
        });
		//Suppress unselectable option to allow chrome input fields to be modified.
//        this.el.unselectable();

        this.cells = this.el.select('table.x-date-inner tbody td');
        this.textNodes = this.el.query('table.x-date-inner tbody span');

        this.mbtn = new Ext.Button({
            text: '&#160;',
            tooltip: this.monthYearText,
            renderTo: this.el.child('td.x-date-middle', true)
        });
        this.mbtn.el.child('em').addClass('x-btn-arrow');

        if(this.showToday){
            this.todayKeyListener = this.eventEl.addKeyListener(Ext.EventObject.SPACE, this.selectToday,  this);
            var today = (new Date()).dateFormat(this.format);
            this.todayBtn = new Ext.Button({
                renderTo: this.el.child('td.x-date-bottom', true),
                text: Ext.String.format(this.todayText, today),
                tooltip: Ext.String.format(this.todayTip, today),
                handler: this.selectToday,
                scope: this
            });
        }
        
        
        if (this.showTime){

        	this.hourField = new Ext.form.TextField({
                value : this.hourValue, 
                width : "25"
                , 
            	listeners : {
                	scope : this, 
                	specialkey : function (field, e) {
                		if (e.getKey() == e.TAB) {
                			if (e.shiftKey) {
                				this.secondField.focus();
                			}
                			else {
                				this.minuteField.focus();
                			}
                		}
                		
                	}
                }
                , 
                maxLength : 2, 
                maskRe : /[0-9]/, 
                disabled : false, 
                validationEvent : "blur", 
                validator : function (value) {
                	var intValue = parseInt(value);
                	if (!Ext.isEmpty(intValue) && intValue <= 23 && intValue >= 0) {
                		if (value.length == 1) {
                			this.setValue("0" + value);
                		}
                		return true;
                	}
                	else {
                		return "incorrect Value";
                	}
                }
            });
        	this.minuteField = new Ext.form.TextField({
                value : this.minuteValue, 
                width : "25", 
            	listeners : {
                	scope : this, 
                	specialkey : function (field, e) {
                		if (e.getKey() == e.TAB) {
                			if (e.shiftKey) {
                				this.hourField.focus();
                			}
                			else {
                				this.secondField.focus();
                			}
                		}
                		
                	}
                }, 
                maxLength : 2, 
                maskRe : /[0-9]/, 
                validationEvent : "blur", 
                validator : function (value) {
                	var intValue = parseInt(value);
                	if (!Ext.isEmpty(intValue) && intValue <= 59 && intValue >= 0) {
                		if (value.length == 1) {
                			this.setValue("0" + value);
                		}
                		return true;
                	}
                	else {
                		return "incorrect Value";
                	}
                }
            });

        	this.secondField = new Ext.form.TextField({
                value : this.minuteValue, 
                width : "25", 
            	listeners : {
                	scope : this, 
                	specialkey : function (field, e) {
                		if (e.getKey() == e.TAB) {
                			if (e.shiftKey) {
                				this.minuteField.focus();
                			}
                			else {
                				this.hourField.focus();
                			}
                		}
                		
                	}
                }, 
                maxLength : 2, 
                maskRe : /[0-9]/, 
                validationEvent : "blur", 
                validator : function (value) {
                	var intValue = parseInt(value);
                	if (!Ext.isEmpty(intValue) && intValue <= 59 && intValue >= 0) {
                		if (value.length == 1) {
                			this.setValue("0" + value);
                		}
                		return true;
                	}
                	else {
                		return "incorrect Value";
                	}
                }
            });

            var sepLabel1 = new Ext.form.DisplayField({
            	value : ":"
            });
            var sepLabel2 = new Ext.form.DisplayField({
            	value : ":"
            });
            
            this.timeForm = new Ext.form.FormPanel({
        		labelWidth : 1,
        		itemsCls : "sitools-no-margin",
        		items : [{
        			xtype : "fieldcontainer",
        			width : 135,
        			style : {
        				padding : "3px"
        			},
        			items : [this.hourField, sepLabel1, this.minuteField, sepLabel2, this.secondField]
        		}], 
        		renderTo : this.el.child('td.x-date-time', true)
        	});
            /**/
        }
        this.mon(this.eventEl, 'mousewheel', this.handleMouseWheel, this);
        this.mon(this.eventEl, 'click', this.handleDateClick,  this, {delegate: 'a.x-date-date'});
        this.mon(this.mbtn, 'click', this.showMonthPicker, this);
        this.onEnable(true);
    },  

    
    // private
    createMonthPicker : function(){
        if(!this.monthPicker.dom.firstChild){
            var buf = ['<table border="0" cellspacing="0">'];
            for(var i = 0; i < 6; i++){
                buf.push(
                    '<tr><td class="x-date-mp-month"><a href="#">', Date.getShortMonthName(i), '</a></td>',
                    '<td class="x-date-mp-month x-date-mp-sep"><a href="#">', Date.getShortMonthName(i + 6), '</a></td>',
                    i === 0 ?
                    '<td class="x-date-mp-ybtn" align="center"><a class="x-date-mp-prev"></a></td><td class="x-date-mp-ybtn" align="center"><a class="x-date-mp-next"></a></td></tr>' :
                    '<td class="x-date-mp-year"><a href="#"></a></td><td class="x-date-mp-year"><a href="#"></a></td></tr>'
                );
            }
            buf.push(
                '<tr class="x-date-mp-btns"><td colspan="4"><button type="button" class="x-date-mp-ok">',
                    this.okText,
                    '</button><button type="button" class="x-date-mp-cancel">',
                    this.cancelText,
                    '</button></td></tr>',
                '</table>'
            );
            this.monthPicker.update(buf.join(''));

            this.mon(this.monthPicker, 'click', this.onMonthClick, this);
            this.mon(this.monthPicker, 'dblclick', this.onMonthDblClick, this);

            this.mpMonths = this.monthPicker.select('td.x-date-mp-month');
            this.mpYears = this.monthPicker.select('td.x-date-mp-year');

            this.mpMonths.each(function(m, a, i){
                i += 1;
                if((i%2) === 0){
                    m.dom.xmonth = 5 + Math.round(i * 0.5);
                }else{
                    m.dom.xmonth = Math.round((i-1) * 0.5);
                }
            });
        }
    },

    
    // private
    showMonthPicker : function(){
        if(!this.disabled){
            this.createMonthPicker();
            var size = this.el.getSize();
            this.monthPicker.setSize(size);
            this.monthPicker.child('table').setSize(size);

            this.mpSelMonth = (this.activeDate || this.value).getMonth();
            this.updateMPMonth(this.mpSelMonth);
            this.mpSelYear = (this.activeDate || this.value).getFullYear();
            this.updateMPYear(this.mpSelYear);

            this.monthPicker.slideIn('t', {duration:0.2});
        }
    },

    
    // private
    updateMPYear : function(y){
        this.mpyear = y;
        var ys = this.mpYears.elements;
        for(var i = 1; i <= 10; i++){
            var td = ys[i-1], y2;
            if((i%2) === 0){
                y2 = y + Math.round(i * 0.5);
                td.firstChild.innerHTML = y2;
                td.xyear = y2;
            }else{
                y2 = y - (5-Math.round(i * 0.5));
                td.firstChild.innerHTML = y2;
                td.xyear = y2;
            }
            this.mpYears.item(i-1)[y2 == this.mpSelYear ? 'addClass' : 'removeClass']('x-date-mp-sel');
        }
    },

    
    // private
    updateMPMonth : function(sm){
        this.mpMonths.each(function(m, a, i){
            m[m.dom.xmonth == sm ? 'addClass' : 'removeClass']('x-date-mp-sel');
        });
    },

    
    // private
    selectMPMonth : function(m){

    },

    
    // private
    onMonthClick : function(e, t){
        e.stopEvent();
        var el = new Ext.Element(t), pn;
        if(el.is('button.x-date-mp-cancel')){
            this.hideMonthPicker();
        }
        else if(el.is('button.x-date-mp-ok')){
            var d = new Date(this.mpSelYear, this.mpSelMonth, (this.activeDate || this.value).getDate());
            if(d.getMonth() != this.mpSelMonth){
                
                d = new Date(this.mpSelYear, this.mpSelMonth, 1).getLastDateOfMonth();
            }
            this.update(d);
            this.hideMonthPicker();
        }
        else if((pn = el.up('td.x-date-mp-month', 2))){
            this.mpMonths.removeClass('x-date-mp-sel');
            pn.addClass('x-date-mp-sel');
            this.mpSelMonth = pn.dom.xmonth;
        }
        else if((pn = el.up('td.x-date-mp-year', 2))){
            this.mpYears.removeClass('x-date-mp-sel');
            pn.addClass('x-date-mp-sel');
            this.mpSelYear = pn.dom.xyear;
        }
        else if(el.is('a.x-date-mp-prev')){
            this.updateMPYear(this.mpyear-10);
        }
        else if(el.is('a.x-date-mp-next')){
            this.updateMPYear(this.mpyear+10);
        }
    },

    
    // private
    onMonthDblClick : function(e, t){
        e.stopEvent();
        var el = new Ext.Element(t), pn;
        if((pn = el.up('td.x-date-mp-month', 2))){
            this.update(new Date(this.mpSelYear, pn.dom.xmonth, (this.activeDate || this.value).getDate()));
            this.hideMonthPicker();
        }
        else if((pn = el.up('td.x-date-mp-year', 2))){
            this.update(new Date(pn.dom.xyear, this.mpSelMonth, (this.activeDate || this.value).getDate()));
            this.hideMonthPicker();
        }
    },

    
    // private
    hideMonthPicker : function(disableAnim){
        if(this.monthPicker){
            if(disableAnim === true){
                this.monthPicker.hide();
            }else{
                this.monthPicker.slideOut('t', {duration:0.2});
            }
        }
    },

    
    // private
    showPrevMonth : function(e){
        this.update(this.activeDate.add('mo', -1));
    },

    
    // private
    showNextMonth : function(e){
        this.update(this.activeDate.add('mo', 1));
    },

    
    // private
    showPrevYear : function(){
        this.update(this.activeDate.add('y', -1));
    },

    
    // private
    showNextYear : function(){
        this.update(this.activeDate.add('y', 1));
    },

    
    // private
    handleMouseWheel : function(e){
        e.stopEvent();
        if(!this.disabled){
            var delta = e.getWheelDelta();
            if(delta > 0){
                this.showPrevMonth();
            } else if(delta < 0){
                this.showNextMonth();
            }
        }
    },

    
    // private
    handleDateClick : function(e, t){
        e.stopEvent();
        if(!this.disabled && t.dateValue && !Ext.fly(t.parentNode).hasClass('x-date-disabled')){
            this.cancelFocus = this.focusOnSelect === false;
            var date = new Date(t.dateValue);
            if (this.showTime) {
	            date = date.add(Date.HOUR, this.hourField.getValue());
	            date = date.add(Date.MINUTE, this.minuteField.getValue());
	            date = date.add(Date.SECOND, this.secondField.getValue());
	            if (!this.hourField.isValid() || !this.minuteField.isValid() || !this.secondField.isValid()) {
	            	return;
	            }
            }
            this.setValue(date);
            delete this.cancelFocus;
            this.fireEvent('select', this, this.value);
        }
    },

    
    // private
    selectToday : function(){
        if(this.todayBtn && !this.todayBtn.disabled){
            var dateNow = new Date();
            this.setValue(dateNow);
            if (this.showTime) {
		        this.hourField.setValue(dateNow.getHours());
	            this.minuteField.setValue(dateNow.getMinutes());
	            this.secondField.setValue(dateNow.getSeconds());
            }
            this.fireEvent('select', this, this.value);
        }
    },

    
    // private
    update : function(date, forceRefresh){
        if(this.rendered){
            if (!Ext.isDate(date)) {
            	date = new Date();	
            }
            var vd = this.activeDate, vis = this.isVisible();
            var dateWithoutTime = new Date(date.getTime());
            
            dateWithoutTime.setHours(0);
            dateWithoutTime.setMinutes(0);
            dateWithoutTime.setMilliseconds(0);
            dateWithoutTime.setSeconds(0);
            this.activeDate = date;
            if(!forceRefresh && vd && this.el){
                var t = dateWithoutTime.getTime();
                if(vd.getMonth() == dateWithoutTime.getMonth() && vd.getFullYear() == dateWithoutTime.getFullYear()){
                    this.cells.removeClass('x-date-selected');
                    this.cells.each(function(c){
                       if(c.dom.firstChild.dateValue == t){
                           c.addClass('x-date-selected');
                           if(vis && !this.cancelFocus){
                               Ext.fly(c.dom.firstChild).focus(50);
                           }
                           return false;
                       }
                    }, this);
                    return;
                }
            }
            var days = date.getDaysInMonth(),
                firstOfMonth = date.getFirstDateOfMonth(),
                startingPos = firstOfMonth.getDay()-this.startDay;

            if(startingPos < 0){
                startingPos += 7;
            }
            days += startingPos;

            var pm = date.add('mo', -1),
                prevStart = pm.getDaysInMonth()-startingPos,
                cells = this.cells.elements,
                textEls = this.textNodes,
                
                d = (new Date(pm.getFullYear(), pm.getMonth(), prevStart, this.initHour));
                d.setHours(pm.getHours());
                d.setMinutes(pm.getMinutes());
                d.setSeconds(pm.getSeconds());
                
                today = new Date().getTime(),
                sel = date.clearTime(true).getTime(),
                min = this.minDate ? this.minDate.clearTime(true) : Number.NEGATIVE_INFINITY,
                max = this.maxDate ? this.maxDate.clearTime(true) : Number.POSITIVE_INFINITY,
                ddMatch = this.disabledDatesRE,
                ddText = this.disabledDatesText,
                ddays = this.disabledDays ? this.disabledDays.join('') : false,
                ddaysText = this.disabledDaysText,
                format = this.format;

            if(this.showToday){
                var td = new Date().clearTime(),
                    disable = (td < min || td > max ||
                    (ddMatch && format && ddMatch.test(td.dateFormat(format))) ||
                    (ddays && ddays.indexOf(td.getDay()) != -1));

                if(!this.disabled){
                    this.todayBtn.setDisabled(disable);
                    this.todayKeyListener[disable ? 'disable' : 'enable']();
                }
            }

            var setCellClass = function(cal, cell){
                cell.title = '';
                var t = d.clearTime(true).getTime();
                cell.firstChild.dateValue = t;
                if(t == today){
                    cell.className += ' x-date-today';
                    cell.title = cal.todayText;
                }
                if(t == sel){
                    cell.className += ' x-date-selected';
                    if(vis){
                        Ext.fly(cell.firstChild).focus(50);
                    }
                }
                
                if(t < min) {
                    cell.className = ' x-date-disabled';
                    cell.title = cal.minText;
                    return;
                }
                if(t > max) {
                    cell.className = ' x-date-disabled';
                    cell.title = cal.maxText;
                    return;
                }
                if(ddays){
                    if(ddays.indexOf(d.getDay()) != -1){
                        cell.title = ddaysText;
                        cell.className = ' x-date-disabled';
                    }
                }
                if(ddMatch && format){
                    var fvalue = d.dateFormat(format);
                    if(ddMatch.test(fvalue)){
                        cell.title = ddText.replace('%0', fvalue);
                        cell.className = ' x-date-disabled';
                    }
                }
            };

            var i = 0;
            for(; i < startingPos; i++) {
                textEls[i].innerHTML = (++prevStart);
                d.setDate(d.getDate()+1);
                cells[i].className = 'x-date-prevday';
                setCellClass(this, cells[i]);
            }
            for(; i < days; i++){
                var intDay = i - startingPos + 1;
                textEls[i].innerHTML = (intDay);
                d.setDate(d.getDate()+1);
                cells[i].className = 'x-date-active';
                setCellClass(this, cells[i]);
            }
            var extraDays = 0;
            for(; i < 42; i++) {
                 textEls[i].innerHTML = (++extraDays);
                 d.setDate(d.getDate()+1);
                 cells[i].className = 'x-date-nextday';
                 setCellClass(this, cells[i]);
            }

            this.mbtn.setText(this.monthNames[date.getMonth()] + ' ' + date.getFullYear());

            if(!this.internalRender){
                var main = this.el.dom.firstChild,
                    w = main.offsetWidth;
                this.el.setWidth(w + this.el.getBorderWidth('lr'));
                Ext.fly(main).setWidth(w);
                this.internalRender = true;
                
                
                
                if(Ext.isOpera && !this.secondPass){
                    main.rows[0].cells[1].style.width = (w - (main.rows[0].cells[0].offsetWidth+main.rows[0].cells[2].offsetWidth)) + 'px';
                    this.secondPass = true;
                    this.update.defer(10, this, [date]);
                }
            }
        }
    },

    
    // private
    beforeDestroy : function() {
        if(this.rendered){
            Ext.destroy(
                this.keyNav,
                this.monthPicker,
                this.eventEl,
                this.mbtn,
                this.nextRepeater,
                this.prevRepeater,
                this.cells.el,
                this.todayBtn
            );
            delete this.textNodes;
            delete this.cells.elements;
        }
    }

    
});


