$(document).ready(function () {
    $("#contactDetailGrid").jqGrid({
        url: "/ContactDetail/GetContactDetails",
        datatype: "json",
        colNames: ["Id", "Number", "Email"],
        colModel: [{ name: "Id", key: true, hidden: true },
            { name: "Number", editable: true, searchoptions: { sopt: ['eq'] }},
        { name: "Email", editable: true }
        ],
        height: "50%",
        caption: "Contact Detail Records",
        //loadonce: true,
        //jsonReader: {
        //    root: function (obj) { return obj; },
        //    repeatitems:false
        //} required when direct object is req without pagination
        pager: "#pager",
        rowNum: 5,
        rowList: [5, 10, 15],
        sortname: 'id',
        sortorder: 'asc',
        viewrecords: true,
        width: "650",
        gridComplete: function () {
            $("#contactDetailGrid").jqGrid('navGrid', '#pager', { edit: true, add: true, del: true,search: true, refresh: true },
                {
                    url: "/ContactDetail/EditContactDetail",
                    closeAfterEdit: true,
                    width: 650, afterSubmit: function (response, postdata) {
                        var result = JSON.parse(response.responseText);
                        if (result.success) {
                            alert(result.message);
                            return [true];
                        } else {
                            alert(result.message);
                            return [false];
                        }
                    },
                },
                {
                    url: "/ContactDetail/AddContactDetail",
                    closeAfterAdd: true,
                    width: 600,
                    afterSubmit: function (response, postdata) {
                        var result = JSON.parse(response.responseText);
                        if (result.success) {
                            alert(result.message);
                            return [true];
                        } else {
                            alert(result.message);
                            return [false];
                        }

                    },
                },
                {
                    url: "/ContactDetail/DeleteContactDetail",
                    afterSubmit: function (response, postdata) {
                        var result = JSON.parse(response.responseText);
                        if (result.success) {
                            alert(result.message);
                            return [true];
                        } else {
                            alert(result.message);
                            return [false];
                        }
                    }
                },
                {
                    multipleSearch: false,
                    closeAfterSearch: true
                }
            );
            $("#refreshButton").click(function () {
                //clear search filters
                $("#contactDetailGrid").jqGrid('setGridParam', { search: false });

                //reload the grid data
                $("#contactDetailGrid").jqGrid('setGridParam', { page: 1 }).trigger('reloadGrid');
            });
        }
    })
})