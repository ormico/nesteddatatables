﻿/**
nestedDataTables v1.2.1
Copyright 2012 Zack Moore, all rights reserved.
This source file is free software, under either the GPL v2 license or a BSD style license.

This source file is distributed in the hope that it will be useful, but 
WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY 
or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.

Depends on:
    jQuery v1.7.2 or higher or jQuery v1.8.2 or higher
    jQueryUI v. 1.8.23 or higher

Description:
    Create a series of nested dataTables.

Options:
    columns: this describes the columns that should populate the dataTable. This parameter 
        is passed directly to dataTable() so it takes the same syntax as the dataTable 
        option aoColumns with one addition. Each element in the columns array may contain
        an optional parameter named nestedDataTable.

        nestedDataTables: 
            key: a flag indicating whether or not this column is a key. key columns may
                be used to query the data for the next lower table. 

            paramName: normally when calling the web service to load the next table, 
                nestedDataTables will will take the values the key columns of the current row
                and pass them to the web service using the column names as the web
                service parameter names. Using the paramName property, you can specify
                a different parameter name for the column value.

    dataSource: This property specifies where to load the data for the next lower table from.
        This property may be a string, function, or object.
        
        function: If dataSource is a function, then this function will be called to load this
            table. The first parameter passed to this function will be the dataTable to load 
            data into. The function must call fnAddData() on this object. See DataTables
            documentation. The second parameter passed to this function are the query paramters.
            E.g. function F(dt, wsParams) { var z = [ { a:"A", b: "B" } ]; dt.fnAddData(z); }

        object: An ajax options object. This object should follow the same syntax as an
            options object passed to jQuery.ajax(). If no data property is specified, one
            will be generated by this plugin from the current row's key columns. If no
            success property is specified, one is added by the plugin to load the data
            into the new dataTable.

            When using this option, allowing this plugin to generate the data and success
            properties.

        string: A url for the web service to call. The web service will be called via 
            POST. It will send the column key values to the web service as JSON and
            it will expect the returned data to come back as JSON data.

    dataSourceParams: Retrieve additional parameters that you would like to pass to the data source query. This
        option may be a function or an object.

            function: Returns an object whose properties are added to those passed to the data source query.
            
            object: An object whose properties are added to those passed to the data source query.

    dataTablesOptions: Optional. Options to pass to dataTables plugin when creating each dataTable.
        For example, to use jQueryUI set this option to { bJQueryUI: true }

    buttonClass: CSS class to set on the button column for opening and closing nested tables. 
        If you turn on JQueryUI support, this is set to ui-icon.

    openButtonClass: CSS class to set on the button column for opening a nested tables. 
        If you turn on JQueryUI support, this is set to ui-icon-circle-triangle-e.

    openButtonText: Text to display in the button column for opening a nested table.
        If you turn on JQueryUI support, this is set to blank, otherwise it defaults to "[+]" unless set by the user.

    closeButtonClass: CSS class to set on the button column for closing a nested tables. 
        If you turn on JQueryUI support, this is set to ui-icon-circle-triangle-s.

    closeButtonText: Text to display in the button column for closing a nested table.
        If you turn on JQueryUI support, this is set to blank, otherwise it defaults to "[-]" unless set by the user.

    nestedDataTable: This property specifies the child table to load when the user clicks the
        open icon that is the first column of the table. This property is an object
        that recursivly has the same properties as the plugin options, meaning that
        it has the properties 'columns', 'dataSource', and 'nestedDataTable'.

CSS Classes:
    nestedDataTables: top level table

    nestedDataTables-nestedTable: each table below the parent table.

    nestedDataTables-buttonCol: the column in each dataTable that is a button to open the next dataTable
*/
(function ($) {
    $.fn.nestedDataTables = function(options) {
        var methods =
        {
            _create: function () {
                var self = this;

                // validate inputs
                var o = self.options;
                o.openRows = [];

                o.dataTablesOptions = $.extend({
                        bPaginate: false,
                        bFilter: false,
                        bLengthChange: false,
                        bInfo: false,
                        // bJQueryUI: true,
                        bAutoWidth: false,
                        aaSorting: []
                    }, o.dataTablesOptions);
                
                if (o.dataTablesOptions.bJQueryUI === true) {
                    o.buttonClass = 'ui-icon';
                    o.openButtonClass = 'ui-icon-circle-triangle-e';
                    o.openButtonText='';
                    o.closeButtonClass = 'ui-icon-circle-triangle-s';
                    o.closeButtonText='';
                }

                // create internal html
                self._createPrefix();

                self.element.addClass('nestedDataTables');

                var curLevel = self.options;
                var curLevelNum = 0;
                var prevLevel = null;
                while (curLevel !== null && typeof (curLevel) !== 'undefined') {
                    // validate inputs at each level
                    if (curLevel.dataSource === null || typeof (curLevel.dataSource) === "undefined") {
                        throw new Exception("dataSource not set on level " + curLevelNum);
                    }

                    // build each level's data
                    curLevel.level = curLevelNum;
                    curLevelNum++;

                    var levelCssClass = self._id('level' + curLevel.level);

                    // create a function so that even handler can reference current values of curLevel
                    function setEventHandler(cl) {
                        $('td.' + levelCssClass).live('click', function () {
                            if (cl.nestedDataTable !== null && typeof (cl.nestedDataTable) !== "undefined") {
                                self._createDT(cl.nestedDataTable, this.parentNode);
                            }
                        });
                    }
                    setEventHandler(curLevel);

                    curLevel.parentOptions = prevLevel;
                    prevLevel = curLevel;
                    curLevel = curLevel.nestedDataTable;
                }

                self._createDT(self.options);
            },
            _createDT: function (s, parentRow) {
                var self = this;
                var levelCssClass = self._id('level' + s.level);
                var parentLevelCssClass = self._id('level' + (s.level - 1));
                var buttonColHtml = "<span class='" + self.options.buttonClass + " " + self.options.openButtonClass + "'>";
                var buttonColClass = "nestedDataTables-buttonCol " + levelCssClass;

                if (self.options.dataTablesOptions.bJQueryUI === true) {
                    buttonColClass = "ui-state-default ui-corner-all " + buttonColClass;
                    self.options.openButtonText = '';
                    self.options.closeButtonText = '';
                }

                buttonColHtml = buttonColHtml + self.options.openButtonText + "</span>";

                var combinedCols =
                [
                    {
                        sDefaultContent: buttonColHtml,
                        sTitle: "",
                        bSortable: false,
                        sClass: buttonColClass
                    }
                ];

                if (s.nestedDataTable !== null && typeof (s.nestedDataTable) !== "undefined") {
                    combinedCols = combinedCols.concat(s.columns);
                }
                else {
                    combinedCols = s.columns;
                }

                var parentTable = $(parentRow).closest('table').dataTable();
                var dto = $.extend({}, self.options.dataTablesOptions,
                {
                    aoColumns: combinedCols
                });

                // new dataTable
                var newDt;

                if (s.level === 0) {
                    //parentRow should be null or undefined
                    newDt = self.element.dataTable(dto);
                    self._loadData(s, self.element.dataTable());
                }
                else {
                    // give table a css class at each level so designers to style tables at each level
                    var tblLevelCssClass = self._id('tbllevel' + s.level);

                    // toggle open/close icons
                    var $parentRow = $(parentRow).find("." + parentLevelCssClass + ' > span').toggleClass(self.options.openButtonClass + ' ' + self.options.closeButtonClass);

                    // see if row is open or closed
                    var parentRowIndex = $.inArray(parentRow, self.options.openRows);
                    if (parentRowIndex === -1) {
                        // row is not open. open it.
                        $parentRow.text(self.options.closeButtonText);

                        var nestedTableHtml = "<div><table class='" + tblLevelCssClass + " nestedDataTables-nestedTable'></table></div>";
                        var subRow = parentTable.fnOpen(parentRow, nestedTableHtml, 'details');
                        var newTable = $(subRow).find("table");
                        newDt = newTable.dataTable(dto);
                        self._loadData(s, newDt, parentRow, parentTable);

                        // add row to list
                        self.options.openRows.push(parentRow);
                    }
                    else {
                        // row is open. close it.
                        parentTable.fnClose(parentRow);

                        $parentRow.text(self.options.openButtonText);

                        // remove item from open list
                        self.options.openRows.splice(parentRowIndex, 1);
                    }
                }
            },
            _createPrefix: function () {
                var self = this;
                // if element has an id, then use that for prefix
                var id = self.element.attr('id');
                if (id == null) {
                    id = self.widgetBaseClass + parseInt(Math.random() * 10000);
                }

                self.options.prefix = id + '-';
            },
            _id: function (id) {
                var self = this;
                return self.options.prefix + id;
            },
            _url: function (url) {
                var self = this;
                return '' + self.options.baseUrl + url;
            },
            _loadData: function (current, dt, parentRow, parentTable) {
                function ajaxSuccess(d) {
                    dt.fnAddData(d.d);
                }

                // get params to query
                var rowData;
                var wsParams = {};

                if (parentRow !== null && typeof (parentRow) !== "undefined") {
                    rowData = parentTable.fnGetData(parentRow);

                    var colProps = {};
                    for (var i = 0; i < current.parentOptions.columns.length; i++) {
                        if (typeof (current.parentOptions.columns[i]) !== "undefined") {
                            colProps[current.parentOptions.columns[i].mDataProp] = current.parentOptions.columns[i].nestedDataTables;
                        }
                    }

                    var cols = parentTable.fnSettings().aoColumns;
                    for (var i = 0; i < cols.length; i++) {
                        // if table col is a key
                        var prop = colProps[cols[i].mDataProp];
                        if (prop !== null && typeof (prop) !== "undefined" && prop.key === true) {
                            var paramName = cols[i].mDataProp;

                            if (prop.paramName !== null && typeof (prop.paramName) !== "undefined") {
                                paramName = prop.paramName;
                            }

                            wsParams[paramName] = rowData[cols[i].mDataProp];
                        }
                    }
                }

                // see if there are any extra params to pass to web service
                if (typeof (current.dataSourceParams) === "function") {
                    wsParams = $.extend(wsParams, current.dataSourceParams());
                }
                else if (current.dataSourceParams !== null && typeof (current.dataSourceParams) !== "undefined") {
                    wsParams = $.extend(wsParams, current.dataSourceParams);
                }

                if (typeof (current.dataSource) === "function") {
                    current.dataSource(dt, wsParams);
                }
                else if (typeof (current.dataSource) === "string") {
                    // dataSource is web service url
                    $.ajax({
                        type: 'POST',
                        url: current.dataSource,
                        data: JSON.stringify(wsParams),
                        contentType: 'application/json; charset=utf-8',
                        dataType: 'json',
                        success: ajaxSuccess
                    });
                }
                else if (typeof (current.dataSource) === "object") {
                    // dataSource is ajax options
                    // if user doesn't provide a success function, add our own (probably most comman usage)
                    var ajaxOpts;
                    if (current.dataSource.success === null || typeof (current.dataSource) === "object") {
                        ajaxOpts = $.extend({}, current.dataSource, { success: ajaxSuccess, data: JSON.stringify(wsParams) });
                    }
                    else {
                        ajaxOpts = $.extend({}, current.dataSource, { data: JSON.stringify(wsParams) });
                    }

                    $.ajax(ajaxOpts);
                }
            }
        };

        var optionsDefaults =
        {
            columns: [],
            dataSource: null,
            dataSourceParams: {},
            buttonClass: '',
            openButtonClass: '',
            openButtonText: '[+]',
            closeButtonClass: '',
            closeButtonText: '[-]',
            nestedDataTable: null
        };
        methods.options = $.extend({}, optionsDefaults, options);
        methods.element = this;
        methods._create();

        return this;
    }
})(jQuery);