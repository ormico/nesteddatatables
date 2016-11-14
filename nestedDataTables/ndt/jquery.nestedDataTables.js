/**
nestedDataTables v1.4.0
Copyright 2016 Zack Moore, all rights reserved.
This source file is free software, under either the GPL v2 license or a BSD style license.

This source file is distributed in the hope that it will be useful, but 
WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY 
or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.

https://bitbucket.org/ormico/nesteddatatables
*/
(function ($) {
    $.fn.nestedDataTables = function (options) {
        var methods;

        if (typeof (options) === "string") {
            // if options is a string then call the public function that matches the string value
            methods = this.data("nestedDataTables");

            if (options === "isNestedDataTables")
            {
                if (typeof methods == "undefined")
                    return false;
                else
                    return true;
            }

            // use the proxy method to call the public function as if it were a member of the methods object
            $.proxy(methods.fn[options], methods)();
        }
        else {
            methods =
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
                        if (curLevel.onAjaxSuccess === null || typeof (curLevel.onAjaxSuccess) === "undefined") {
                            curLevel.onAjaxSuccess = self.onAjaxSuccess;
                        }

                        curLevel.level = curLevelNum;
                        curLevelNum++;

                        var levelCssClass = self._id('level' + curLevel.level);

                        // create a function so that even handler can reference current values of curLevel
                        function setEventHandler(cl) {
                            /*$('td.' + levelCssClass).on('click', function () {
                                if (cl.nestedDataTable !== null && typeof (cl.nestedDataTable) !== "undefined") {
                                    self._createDT(cl.nestedDataTable, this.parentNode);
                                }
                            });*/

                            $(document).on('click', 'td.' + levelCssClass, function () {
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
                    if (id === null) {
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
                        //TODO: make sure this works. if the context changes this might not
                        
                        //TODO: not every server code sends data as a d member of return object. 
                        dt.fnAddData(current.onAjaxSuccess(d));

                        if (typeof (current.afterAjaxSuccess) === "function") {
                            current.afterAjaxSuccess();
                        }
                    }

                    // get params to query
                    var rowData;
                    var wsParams = {};

                    if (parentRow !== null && typeof (parentRow) !== "undefined") {
                        rowData = parentTable.fnGetData(parentRow);

                        var colProps = {};
                        var i = 0;
                        for (i = 0; i < current.parentOptions.columns.length; i++) {
                            if (typeof (current.parentOptions.columns[i]) !== "undefined") {
                                colProps[current.parentOptions.columns[i].mDataProp] = current.parentOptions.columns[i].nestedDataTables;
                            }
                        }

                        var cols = parentTable.fnSettings().aoColumns;
                        for (i = 0; i < cols.length; i++) {
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
                    else {
                        var ajaxOptions =
                            {
                                type: 'POST',
                                data: JSON.stringify(wsParams),
                                contentType: 'application/json; charset=utf-8',
                                dataType: 'json',
                                success: ajaxSuccess
                            };

                        if (typeof (current.dataSource) === "string") {
                            // dataSource is web service url
                            ajaxOptions = $.extend(ajaxOptions, { url: current.dataSource });
                        }
                        else if (typeof (current.dataSource) === "object") {
                            // dataSource is ajax options
                            ajaxOptions = $.extend(ajaxOptions, current.dataSource);
                        }

                        if (typeof current.dataSourceModify === "function") {
                            current.dataSourceModify(ajaxOptions, wsParams);
                        }

                        $.ajax(ajaxOptions);
                    }
                },
                // public functions
                fn: {
                    reload: function () {
                        var self = this;
                        var dt = self.element.dataTable();
                        dt.fnClearTable();
                        self._loadData(self.options, dt);
                    },
                    destroy: function()
                    {
                        var self = this;
                        try
                        {
                            var dt = self.element.dataTable();
                            dt.fnDestroy();
                            self.element.empty().removeData("nestedDataTables");
                        }
                        catch (e)
                        {
                            console.log(e);
                        }
                    }
                },
                onAjaxSuccess: function (data) {
                    var rc = data;

                    if (data.hasOwnProperty("d")) {
                        rc = data.d;
                    }

                    return rc;
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

            this.data("nestedDataTables", methods);
        }

        return this;
    }
})(jQuery);