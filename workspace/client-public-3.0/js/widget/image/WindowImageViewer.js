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
/*global Ext, sitools, getDesktop*/
Ext.namespace('sitools.public.widget.image');

/**
 * A specific window to display preview Images in user desktop. 
 * @class sitools.widget.WindowImageViewer
 * @config {boolean} resizeImage true to resize the image according to the desktop, image ratio is also keeped. 
 * false to keep the image size with scrollbars if needed. Default to false
 * @extends Ext.Window
 */
Ext.define('sitools.public.widget.image.WindowImageViewer', {
    extend : 'Ext.window.Window',
    alias : 'widget.windowImageViewer',
    
    resizeImage : false, 
    maximizable : true, 
    modal : true, 
    minHeight : 0,
    minWidth : 0,
    
    initComponent : function () {
        
        var ww = Desktop.getDesktopEl().getWidth();
        var hw = Desktop.getDesktopEl().getHeight();
        
        this.setSize(ww - 100, hw - 100);
    
        if (!this.resizeImage) {
	        this.panel = Ext.create('Ext.Img', {
                    src : this.src + "?dc=" + Ext.id(),
                    name : 'imgViewer',
                listeners :  {
	                scope : this,
	                render : function (me) {
	                    me.getEl().on('load', this.onImageLoad, this, {
				            single : true
				        });
		                
                        me.getEl().on('error', function (e, t, opts) {
                            Ext.Msg.alert(i18n.get("label.warning"), Ext.String.format(i18n.get("label.cannotloadimage"), this.src));
                            this.getEl().unmask();
                            this.close();
                        }, this);
		            }
	            }
	        });
            this.items = [this.panel];
            this.autoScroll=true;
        } else {
            this.autoEl = {
                tag : 'img',
                name : 'imgViewer',
                src : this.src
            };
        }
        this.constrain = true;

        this.callParent(arguments);
    },
    
    onRender : function () {
        this.callParent(arguments);
        this.getEl().mask(i18n.get("label.loadingimage"));
        if(this.resizeImage) {
            this.getEl().on('load', this.onImageLoad, this, {
                single : true
            });
        }
    },
    /**
     * Method called when the image is loaded. It is in charge of resizing the image according to the desktop size
     */
    onImageLoad : function (event, imgTag, eOpts ) {
        var hi = imgTag.offsetHeight;
        var wi = imgTag.offsetWidth;
        //clear window size configuration to fit with content inside window
        this.setSize(null, null);
        if (!this.resizeImage) {
            this.panel.setSize(wi, hi);
        }

		var ww = Ext.getBody().getWidth();
        var hw = Ext.getBody().getHeight();

        var reduce = false;

        if (hi > hw) {
            wi = wi * hw / hi;
            hi = hw;
            reduce = true;
        }
        if (wi > ww) {
            hi = hi * ww / wi;
            wi = ww;
            reduce = true;
        }

        if (reduce) {
            hi *= 0.9;
            wi *= 0.9;
            var width = wi + this.getEl().getFrameWidth("lr") + 10;
            var height = hi + this.getHeader().getHeight() + this.getEl().getFrameWidth("tb") + 10;
            this.setSize(width,height );
        }
        
		this.center();
		this.getEl().unmask();
	},
    
    setSrc : function (src) {
        var panel;
        if(resizeImage){
            panel = this;
        }else {
            panel = this.panel;
        }
        panel.body.on('load', this.onImageLoad, this, {
            single : true
        });
        panel.body.dom.style.width = panel.body.dom.style.width = 'auto';
        panel.body.dom.src = src;
    },
    
    initEvents : function () {
        this.callParent(arguments);
        if (this.resizer && this.resizeImage) {
            this.resizer.preserveRatio = true;
        }
    }
});

/**
 * A specific panel to display preview Images in user desktop. 
 * @class sitools.widget.WindowImageViewer
 * @extends Ext.Window
 */
Ext.define('sitools.public.widget.image.PanelImageViewer', {
    extend : 'Ext.panel.Panel',
    alias : 'widget.panelImageViewer',

    initComponent : function () {
        this.autoEl = {
            tag : 'img',
            src : this.src
        };
        this.callParent(arguments);
    },

    onRender : function () {
        this.callParent(arguments);
        this.body.on('load', this.onImageLoad, this, {
            single : true
        });
    },

    onImageLoad : function () {
        var h = this.getFrameHeight(), w = this.getFrameWidth();
        this.setSize(this.body.dom.offsetWidth + w, this.body.dom.offsetHeight + h);
        if (Ext.isIE) {
            this.center();
        }
    },

    setSrc : function (src) {
        this.body.on('load', this.onImageLoad, this, {
            single : true
        });
        this.body.dom.style.width = this.body.dom.style.width = 'auto';
        this.body.dom.src = src;
    },

    initEvents : function () {
        this.callParent(arguments);
        if (this.resizer) {
            this.resizer.preserveRatio = true;
        }
    }
    
});

