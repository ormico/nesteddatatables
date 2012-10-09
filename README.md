﻿# Zack's Fiasco nestedDataTables v1.0.0

Copyright 2012 Zack Moore, all rights reserved.
This source file is free software, under either the GPL v2 license or a BSD style license.

This source file is distributed in the hope that it will be useful, but 
WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY 
or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.

## Depends on:
- jQuery v1.7.2 or higher or jQuery v1.8.2 or higher
- jQueryUI v. 1.8.23 or higher

## Description:
Create a series of nested dataTables.

## Options:
###    columns: this describes the columns that should populate the dataTable. This parameter 
        is passed directly to dataTable() so it takes the same syntax as the dataTable 
        option aoColumns with one addition. Each element in the columns array may contain
        an optional parameter named nestedDataTable.

####        nestedDataTables: 
            key: a flag indicating whether or not this column is a key. key columns may
                be used to query the data for the next lower table. 

####            paramName: normally when calling the web service to load the next table, 
                nestedDataTables will will take the values the key columns of the current row
                and pass them to the web service using the column names as the web
                service parameter names. Using the paramName property, you can specify
                a different parameter name for the column value.

###    dataSource: This property specifies where to load the data for the next lower table from.
        This property may be a string, function, or object.
        
####        function: If dataSource is a function, then this function will be called to load this
            table. The first parameter passed to this function will be the dataTable to load 
            data into. The function must call fnAddData() on this object. See DataTables
            documentation.
            E.g. function F(dt) { var z = [ { a:"A", b: "B" } ]; dt.fnAddData(z); }

####        object: An ajax options object. This object should follow the same syntax as an
            options object passed to jQuery.ajax(). If no data property is specified, one
            will be generated by this plugin from the current row's key columns. If no
            success property is specified, one is added by the plugin to load the data
            into the new dataTable.

            When using this option, allowing this plugin to generate the data and success
            properties.

####        string: A url for the web service to call. The web service will be called via 
            POST. It will send the column key values to the web service as JSON and
            it will expect the returned data to come back as JSON data.

###    nestedDataTable: This property specifies the child table to load when the user clicks the
        open icon that is the first column of the table. This property is an object
        that recursivly has the same properties as the plugin options, meaning that
        it has the properties 'columns', 'dataSource', and 'nestedDataTable'.

## CSS Classes:
###    nestedDataTables: top level table

###    nestedDataTables-nestedTable: each table below the parent table.

###    nestedDataTables-buttonCol: the column in each dataTable that is a button to open the next dataTable
