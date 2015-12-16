$(document).ready(function () {
    Parse.$ = jQuery;
    // Initialize Parse with your Parse application javascript keys
    Parse.initialize("UIX2yWbJR0BBg4sUvxTkFracFjlaXt4q4Ee18whZ", "odtjY02VHcst6CVS2OPxEGSfwpQPmykHQeBFpACu");
    var $grid = null;


    function bindGrid() {
        var apUsers = Parse.Object.extend("Groups");
        var apUsersQuery = new Parse.Query(apUsers);
        apUsersQuery.equalTo("Owner", "Arun@gmail.com");
        apUsersQuery.find({
            success: function (results) {
                var data = [];
                $.each(results, function (i, v) {
                    data.push({ id: this.id, GroupName: this.attributes.GroupName, GroupDescription: this.attributes.GroupDescription, Like: 0, UnLike: 0 });
                });
                var dataSource = new kendo.data.DataSource({
                    data: data,
                    pageSize: 10,
                    schema: {
                        model: {
                            id: "id",
                            fields: {
                                GroupName: { validation: { required: true } },
                                GroupName: { validation: { required: true } },
                                Like: { type: "number", editable: false },
                                UnLike: { type: "number", editable: false }
                            }
                        }
                    }
                });
                $("#teacherGrid").data("kendoGrid").setDataSource(dataSource);
                $('#teacherGrid tbody > tr').dblclick(function (e) {
                    var grid = $("#teacherGrid").data("kendoGrid")
                    location.href = "/Forum.html?classID ="+ grid.dataItem(grid.select()).id;
                });
            }
        });
    }

    bindGrid();


    $("#teacherGrid").kendoGrid({
        selectable: "row",
        pageable: true,
        height: 550,
        toolbar: ["create"],
        columns: [
            { field: "GroupName", title: "Class Name", width: "120px" },
            { field: "GroupDescription", title: "Class Description" },
            { field: "Like", title: "Like", width: "120px", editable: false },
            { field: "UnLike", title: "UnLike", width: "120px", editable: false },
            {
                command: [{ name: "edit" }, {
                    name: "Delete", click: function (e) {
                        debugger;
                        var tr = $(e.target).closest("tr"); //get the row for deletion
                        var data = this.dataItem(tr); //get the row data so it can be referred later
                        var result = confirm("Want to delete?");
                        if (result) {
                            var gp = Parse.Object.extend("Groups");
                            var query = new Parse.Query(gp);
                            query.equalTo("objectId", data.id);
                            query.find({
                                success: function (objAp) {
                                    if (objAp.length > 0) {
                                        // The object was retrieved successfully.
                                        objAp[0].destroy({
                                            success: function () {
                                                var grid = $("#teacherGrid").data("kendoGrid");
                                                grid.dataSource.remove(data)  //prepare a "destroy" request 
                                                grid.dataSource.sync()
                                                toastr.success("Deleted Successfully");
                                            },
                                            error: function (data, error) {
                                                toastr.error("Error");
                                            }
                                        });

                                    }
                                },
                                error: function (object, error) {
                                    // The object was not retrieved successfully.
                                    // error is a Parse.Error with an error code and description.
                                }
                            });
                        }
                    }
                }], title: "&nbsp;", width: "250px"
            }],
        editable: "popup",
        edit: function (e) {
            debugger;
            if (e.model.id === "") {
                handleInsert(e);
            } else {
                handleUpdate(e);
            }
        }
    });

    function handleUpdate(e) {
        e.container.find(".k-button.k-grid-update").click(function () {
            var query = new Parse.Query("Groups");
            var grid = $("#teacherGrid").data("kendoGrid");
            var rowId = grid.dataItem($("#teacherGrid").data("kendoGrid").table.find("tr[data-uid=" + e.model.uid + "]")).id;
            query.equalTo("objectId", rowId);
            query.find({
                success: function (Contact) {
                    if (Contact.length > 0) {
                        Contact[0].set("GroupName", $("[name='GroupName']").val());
                        Contact[0].set("GroupDescription", $("[name='GroupDescription']").val());
                        Contact[0].save(null, {
                            success: function (contact) {
                                toastr.success("Updated Successfully");
                            },
                            error: function (data, error) {
                                toastr.error("Error");
                            }
                        });
                    }
                },
                error: function (data, error) {
                    toastr.error("Error");
                }
            });
        });
    }

    function handleInsert(e) {
        e.container.find(".k-button.k-grid-update").click(function () {
            var groupName = $("[name='GroupName']").val();
            var groupDescription = $("[name='GroupDescription']").val();

            var groups = new Parse.Object("Groups");
            groups.set("Owner", "Arun@gmail.com");
            groups.set("GroupName", groupName);
            groups.set("GroupDescription", groupDescription);
            groups.save(null, {
                success: function (data) {
                    // Execute any logic that should take place after the object is saved.
                    toastr.success("Added Successfully");
                },
                error: function (data, error) {
                    // Execute any logic that should take place if the save fails.
                    // error is a Parse.Error with an error code and message.
                    toastr.error("Error");
                }
            });
        });


    }
});