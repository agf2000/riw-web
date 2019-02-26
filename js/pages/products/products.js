(function ($) {
    $(function () {

        $('.sidenav').sidenav();

        jsGrid.locale("pt-br");

        $("#jsGrid").jsGrid({
            width: '100%',
            height: 'auto',
            autoload: false,
            confirmDeleting: true,
            paging: false,
            pageSize: 10,
            pageButtonCount: 5,
            inserting: true,
            editing: true,
            sorting: true,
            ajaxGridOptions: {
                cache: false
            },
            controller: {
                loadData: function (filter) {
                    return $.ajax({
                        url: "http://localhost:3000/api/products",
                        type: 'GET',
                        contentType: "application/json; charset=utf-8",
                        beforeSend: setHeader,
                        crossDomain: true,
                        // success: function (responseData, textStatus, jqXHR) {
                        //     if (responseData) {
                        //         if (responseData.length) {
                        //             def.resolve(responseData);
                        //         }
                        //     }
                        // },
                        error: function (jqXHR, textStatus, errorThrown) {
                            if (jqXHR.status === 500) {
                                alert(jqXHR.responseJSON.message);
                            } else {
                                localStorage.removeItem('token');
                                window.location.href = 'index.html'
                            }
                        }
                    });
                },
                deleteItem: function (item) {
                    return $.ajax("http://localhost:3000/api/products/remove/" + item.itemId, {
                        method: "DELETE",
                        beforeSend: setHeader,
                        crossDomain: true,
                        error: (jqXHR, status, err) => {
                            alert("Error: " + jqXHR.responseText);
                        },
                        success: (result, status, jqXHR) => {
                            console.log(result);
                        }
                    });
                },
                insertItem: function (item) {
                    return $.ajax("http://localhost:3000/api/products/add", {
                        method: "POST",
                        beforeSend: setHeader,
                        crossDomain: true,
                        data: {
                            name: item.name,
                            price: item.price
                        },
                        error: (jqXHR, status, err) => {
                            alert("Error: " + jqXHR.responseText);
                        },
                        success: (result, status, jqXHR) => {
                            console.log(result);
                        }
                    });
                },
                updateItem: function (item) {
                    return $.ajax("http://localhost:3000/api/products/update", {
                        method: "PUT",
                        beforeSend: setHeader,
                        crossDomain: true,
                        data: {
                            itemId: item.itemId,
                            name: item.name,
                            price: item.price
                        },
                        error: (jqXHR, status, err) => {
                            alert("Error: " + jqXHR.responseText);
                        },
                        success: (result, status, jqXHR) => {
                            console.log(result);
                        }
                    });
                }
            },
            deleteConfirm: function (item) {
                return "O produto \"" + item.name + "\" será removido. Deseja continuar?";
            },
            // editItem: function (item) {
            //     let $row = this.rowByItem(item);
            //     if ($row.length) {
            //         // console.log('$row: ' + JSON.stringify($row)); // I modify this

            //         $('#inputPhone').mask('(99) 99999-9999');

            //         my.recipientId = item.recipientId;

            //         $('#inputName').val(item.recipientName);
            //         $('#inputAddress').val(item.recipientAddress);
            //         $('#inputPhone').val(item.recipientPhone.replace(/[^\d\+]/g, ""));
            //         $('#inputEmail').val(item.recipientEmail);

            //         $('#inputPhone').mask('(99) 99999-9999');

            //         $('#sel2Categories').append($('<option value="' + item.recipientCategory.split(':')[0] + '" selected>' + item.recipientCategory.split(':')[1] + '</option>'));
            //         $("#sel2Categories").trigger("change");

            //         $('#sel2Regions').append($('<option value="' + item.recipientRegion.split(':')[0] + '" selected>' + item.recipientRegion.split(':')[1] + '</option>'));
            //         $("#sel2Regions").trigger("change");

            //         $('#sel2Groups').append($('<option value="' + item.recipientGroup.split(':')[0] + '" selected>' + item.recipientGroup.split(':')[1] + '</option>'));
            //         $("#sel2Groups").trigger("change");

            //         $('#sel2States').append($('<option value="' + item.recipientState.split(':')[0] + '" selected>' + item.recipientState.split(':')[1] + '</option>'))
            //         $("#sel2States").trigger("change");

            //         $('#sel2Cities').append($('<option value="' + item.recipientCity.split(':')[0] + '" selected>' + item.recipientCity.split(':')[1] + '</option>'));
            //         $("#sel2Cities").trigger("change");

            //         $('#btnSaveRecipient').val('put');
            //         updatingRecipient = item;
            //         $('.panel-collapse').collapse('show');
            //         $.scrollTo($('.main-header'), 1000, {
            //             easing: 'swing'
            //         });

            //         this._editRow($row);
            //     }
            // },
            fields: [{
                title: "Código",
                name: "itemId",
                type: "number"
            }, {
                title: "Produto",
                name: "name",
                type: "text"
            }, {
                title: "Preço",
                name: "price",
                type: "money"
            }, {
                type: "control"
            }]
        });

        if (localStorage.getItem('token')) {
            $("#jsGrid").jsGrid("loadData");
        } else {
            window.location.href = 'index.html'
        }

    }); // end of document ready
})(jQuery); // end of jQuery name space

function getToken() {
    return 'Bearer ' + localStorage.getItem('token');
}

function setHeader(xhr) {
    xhr.setRequestHeader('Authorization', getToken());
}

function MoneyField(config) {
    jsGrid.NumberField.call(this, config);
}

MoneyField.prototype = new jsGrid.NumberField({

    itemTemplate: function (value) {
        return "$" + value.toFixed(2);
    },

    filterValue: function () {
        return parseFloat(this.filterControl.val() || 0);
    },

    insertValue: function () {
        return parseFloat(this.insertControl.val() || 0);
    },

    editValue: function () {
        return parseFloat(this.editControl.val() || 0);
    }

});

jsGrid.fields.money = MoneyField;