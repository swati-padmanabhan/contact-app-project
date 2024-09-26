function loadContacts() {
    $.ajax({
        url: "/Contact/GetAllContacts",
        type: "GET",
        //data: { userId: userId },
        success: function (data) {
            $("#tblBody").empty();

            $.each(data, function (index, contact) {
                var isActiveCheckbox = `<input type="checkbox" class="is-active-checkbox" data-contact-id="${contact.Id}" ${contact.IsActive ? "checked" : ""} />`;

                var row = `<tr>
                    <td>${contact.FirstName}</td>
                    <td>${contact.LastName}</td>
                    <td>${isActiveCheckbox}</td>
                    <td>
                    <button onclick="editContact('${contact.Id}')" class="btn btn-success">Edit</button>
                    </td>
                    <td>
                    <button onclick="viewContactDetails('${contact.Id}')" class="btn btn-primary">View Contact Details</button>                   
                    </td>
                </tr>`;
                $("#tblBody").append(row);
            });
        },
        error: function (err) {
            $("#tblBody").empty();
            alert("Error: No Data Available");
        }
    });
}

function viewContactDetails(contactId) {
    window.location.href = `/ContactDetail/Index?contactId=${contactId}`;
}




function addNewRecord(newItem) {
    $.ajax({
        url: "/Contact/AddContact",
        type: "POST",
        data: newItem,

        success: function (contact) {
            alert("New Contact Added Successfully")
            loadContacts()
        },
        error: function (err) {
            alert("Error Adding New Record")
        }
    })
}

function getContact(contactId) {
    $.ajax({
        url: "/Contact/GetContact",
        type: "GET",
        data: { id: contactId },
        success: function (response) {
            if (response.success) {
                $("#editContactId").val(response.contact.Id);
                $("#newFirstName").val(response.contact.FirstName);
                $("#newLastName").val(response.contact.LastName);
            } else {
                alert(response.message);
            }
        },
        error: function (err) {
            alert("No such data found");
        }
    });
}



function modifyRecord(modifiedContact) {
    $.ajax({
        url: "/Contact/EditContact",
        type: "POST",
        data: modifiedContact,
        success: function (response) {
            if (response.success) {
                alert("Contact Edited Successfully");
                loadContacts(); 
                $("#itemList").show();
                $("#editContact").hide();
            } else {
                alert(response.message);
            }
        },
        error: function (err) {
            alert("Error Editing Record");
        }
    });
}

$(document).on('change', '.is-active-checkbox', function () {
    var isActive = $(this).is(':checked');
    var contactId = $(this).data('contact-id');

    $.ajax({
        url: '/Contact/UpdateIsActiveStatus',
        type: 'POST',
        data: { contactId: contactId, isActive: isActive },
        success: function (response) {
            alert('Status updated successfully');
        },
        error: function (xhr, status, error) {
            alert('An error occurred: ' + error);
        }
    });
});

$("#btnAdd").click(() => {
    $("#itemList").hide();
    $("#newContact").show();
})
function editContact(contactId) {
    getContact(contactId);
    $("#itemList").hide();
    $("#editContact").show();
}



