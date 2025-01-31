/*******************************************************************************
 * Copyright 2010-2016 CNES - CENTRE NATIONAL d'ETUDES SPATIALES
 * 
 * This file is part of SITools2.
 * 
 * SITools2 is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 * 
 * SITools2 is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License along with
 * SITools2. If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************/

/*global Ext, sitools, i18n, projectGlobal, alertFailure, showResponse */

Ext.namespace('sitools.user.controller.modules.dataStorageExplorer');
/**
 * dataStorageExplorer Module
 * 
 * @class sitools.user.modules.dataStorageExplorer
 * @extends Ext.Panel
 */
Ext.define('sitools.user.controller.modules.dataStorageExplorer.DataStorageExplorerController', {
    extend : 'Ext.app.Controller',
    alias : 'sitools.user.modules.dataStorageExplorer',

    views : [ 'sitools.user.view.modules.dataStorageExplorer.DataStorageExplorerView',
              'sitools.user.view.modules.dataStorageExplorer.DataStorageCreateFolderView',
              'sitools.user.view.modules.dataStorageExplorer.DataStorageUploadFileView'],

    init : function () {
        this.control({
            "dataStorageExplorer treepanel" : {
            	
                beforeitemexpand : function (node, opts) {
                    var view = node.getOwnerTree().up("dataStorageExplorer");
                    var tree = view.down("treepanel");
                    
                    node.removeAll();
                    
                    var reference = new Reference(node.get("url"));
                    var url = reference.getFile();
                    Ext.Ajax.request({
                        params : {
                            index : ""
                        },
                        url : url,
                        headers : {
                            'Accept' : 'application/json+sitools-directory'
                        },
                        method : 'GET',
                        scope : this,
                        success : function (ret) {
                            try {
                                var Json = Ext.decode(ret.responseText);
                                
                                //first append the folders
                                Ext.each(Json, function (child) {
                                    if (Ext.isEmpty(child.leaf)) {
                                        child.leaf = false;
                                    }
                                    child.children = [];
                                    if (!child.leaf) {
                                        var nodeAdded = this.appendChild(child, node);
                                        child.id = nodeAdded.id;
                                    }
                                }, this);
                                
                                //then append the files
                                Ext.each(Json, function (child) {
                                    if (child.leaf) {
                                        var nodeAdded = this.appendChild(child, node);
                                        child.id = nodeAdded.id;
                                    }
                                }, this);
                                
                                this.loadDataview(node);
                                
                                // if there is a node to select prior to the expanding of the node
                                var nodeToSelect = tree.getSelectionModel().getLastSelected(); 
                                if (nodeToSelect && nodeToSelect.get('leaf') === "true") {
                                    var name = nodeToSelect.get('name');
                                    var callback = this.callbackForceSelectNodeOtherDirectory.bind(this, name);
    //                                this.tree.expandPath(node.getPath(), undefined, '/', callback);
                                    node.expand(false);
                                } else {
                                  node.expand(false);
                                    // just expand the current path
    //                                this.tree.expandPath(node.getPath());
                                }
                                return true;
                                
                            } catch (err) {
                                throw err;
                            }
                        },
                        failure : function (response) {
                            if (response.status == 403) {
                                return Ext.Msg.alert(i18n.get("label.error"), i18n.get("label.datastorageForbidden"));
                            }
                            if (response.status == 404) {
                                return Ext.Msg.alert(i18n.get("label.error"), i18n.get("label.datastorageNotFound"));
                            } else {
                                 return Ext.Msg.alert(response.status, response.statusText);
                            }
                        }
                    });
                    return true;
                },
                
                itemclick : function (tree, node, item, e) {
                    
                    var self = tree.up('dataStorageExplorer');
                    self.manageToolbar(node);
                    
                    if (node.get('text').match(/\.(fits)$/)) {
                        var sitoolsFitsViewer = new sitools.user.component.dataviews.services.sitoolsFitsViewer({
                            nodeFits : node
                        });
                        sitoolsFitsViewer.show();
                    }
                    
                    var rec = self.dataview.getStore().getById(node.get('commonStoreId'));
                    if(Ext.isEmpty(rec)){
                        return;
                    }
                    
                    self.dataview.select(rec, false);
                    
                    if (self.isOpenable(node.get('name'))) {
                        if (!Ext.isEmpty(rec)) {
                            self.displayFile(rec);
                        } else {
                            self.reloadNode(node.parentNode);
                        }
                    } else {
                        self.detailPanelContainer.setTitle(i18n.get('label.defaultTitleDetailPanel'));
                        self.detailPanel.setSrc(this.noPreviewAvailableUrl);
                    }
                }
            },
            
            "dataStorageExplorer button#createFolderButton" : {
                click :  function (button, e) {
                    var view = button.up("dataStorageExplorer");
                    var node = view.tree.getSelectionModel().getSelection()[0];

                    var url = null;
                    if (node.isLeaf()) {
                        url = node.parentNode.get('url');
                    } else if (node.get('cls')) {
                        url = node.get('url');
                    } else if (node.isRoot()) {
                        url = view.datastorageUrl;
                        if (url.charAt(url.length - 1) != "/") {
                            url = url + "/";
                        }
                    }
                    
                    var datastorageCreateFolder = Ext.ComponentQuery.query('datastorageCreateFolder')[0];
            		if (Ext.isEmpty(datastorageCreateFolder) || !datastorageCreateFolder.isVisible()) {
            			var menu = this.getView('sitools.user.view.modules.dataStorageExplorer.DataStorageCreateFolderView').create({
            				url : url,
                            scope : view,
                            callback : function () {
                            	view.reloadNode(node);
                            }
            			});
            			menu.showAt(e.getX(), e.getY(), true);
            		}
                }
            },
            
            "dataStorageExplorer button#uplButton" : {
                click :  function (button, e) {
                    var view = button.up("dataStorageExplorer");
                    var nodeSel = view.tree.getSelectionModel().getSelection()[0];
                    
                    if (!Ext.isEmpty(nodeSel)) {
                        this.onUpload(view, nodeSel, e);
                    } else {
                        Ext.Msg.alert(i18n.get('label.warning'), i18n.get('label.noneNodeSelected'));
                    }
                }
            },
            
            "dataStorageExplorer button#dwlButton" : {
                click :  function (button) {
                    var view = button.up("dataStorageExplorer");
                    var nodeSel = view.tree.getSelectionModel().getSelection()[0];
                    if (!Ext.isEmpty(nodeSel)) {
                    	downloadFile(nodeSel.get('url'));
                    } else {
                        Ext.Msg.alert(i18n.get('label.warning'), i18n.get('label.noneNodeSelected'));
                    }
                }
            },
            
            "dataStorageExplorer button#delButton" : {
                click :  function (button) {
                    var view = button.up("dataStorageExplorer");
                    var node = view.tree.getSelectionModel().getSelection()[0];
                    if (!Ext.isEmpty(node)) {
                        Ext.Msg.confirm(i18n.get('label.info'), i18n.get('label.sureDelete') + '<b>' + node.get('name') + '</b>' + " ?", function (btn) {
                            if (btn === 'yes') {
                                if (!node.isRoot()) {
                                    view.deleteNode(node);
                                } else {
                                    Ext.Msg.alert(i18n.get('label.info'), i18n.get('label.cannotDeleteRootNode'));
                                }
                            }
                        }, view);
                    } else {
                        Ext.Msg.alert(i18n.get('label.warning'), i18n.get('label.noneNodeSelected'));
                    }
                }
            },
            
            "dataStorageExplorer dataview#file-view" : {
                itemclick : function (dataview, record, item, index, e) {
                    dataview.select(record, false);
                    
                    var view = dataview.up("dataStorageExplorer");
                    
                    var treeNode = view.treeStore.getRootNode().findChild('commonStoreId', record.get('commonStoreId'), true);
                    // if (rec.data.cls){
                    // this.tree.fireEvent('beforeexpandnode', treeNode);
                    // }
                    view.tree.getSelectionModel().deselectAll();
                    view.tree.getSelectionModel().select(treeNode, false);
                    view.tree.fireEvent('itemclick', view.tree.getView(), treeNode, e);
                }
            }
        });
    },
    
    appendChild : function (child, parent) {
        var reference = new Reference(child.url);
        var url = reference.getFile();
        
        var name = decodeURIComponent(child.text);
        var text = name;
        if (child.leaf) {
            text += "<span style='font-style:italic'> (" + Ext.util.Format.fileSize(child.size) + ")</span>";
        }
        
        var result = parent.appendChild({
            commonStoreId : Ext.id(),
            cls : child.cls,
            text : text,
            name : name,
            url : url,
            leaf : child.leaf,
            size : child.size,
            lastmod : child.lastmod,
            expandable : !child.leaf
        });
        
        return result;
    },
    
    loadDataview : function (parent) {
        var view = parent.getOwnerTree().up("dataStorageExplorer");
        
        var Json = [];
        Ext.each(parent.childNodes, function (child) {
            Json.push(child.raw);
        });
        var dataview = view.down("dataview#file-view");
//        this.dataview.getStore().loadData(Json);
        dataview.getStore().removeAll();
        Ext.each(Json, function (rec) {
            dataview.getStore().add(rec);
        }, this);
        
        
        //clear any file already displayed
//        this.detailPanel.setTitle(i18n.get('label.defaultTitleDetailPanel'));
        view.detailPanel.setSrc(this.noPreviewAvailableUrl);
    },
    
    onUpload : function (view, node, e) {

        var urlUpload = null;
        if (node.isLeaf()) {
            urlUpload = node.parentNode.get('url');
            
        } else if (node.get('cls')) {
            urlUpload = node.get('url');
            
        } else if (node.isRoot()) {
            urlUpload = view.datastorageUrl;
            if (urlUpload.charAt(urlUpload.length - 1) != "/") {
                urlUpload = urlUpload + "/";
            }
        }
        
        var datastorageUploadFile = Ext.ComponentQuery.query('datastorageUploadFile')[0];
		if (Ext.isEmpty(datastorageUploadFile) || !datastorageUploadFile.isVisible()) {
			var menu = this.getView('sitools.user.view.modules.dataStorageExplorer.DataStorageUploadFileView').create({
				urlUpload : urlUpload,
	            scope : view,
	            callback : function () {
	            	view.reloadNode(node);
	            }
			});
			menu.showAt(e.getX(), e.getY(), true);
		}
    }
});
