(function ($) {
    $(function () {

        if (localStorage.getItem('token')) {
            location.href = 'products.html';
        }

        $('#btnAction').click(function (e) {
            e.preventDefault();

            let postData = {
                email: $('#txtBoxEmail').val(),
                password: $('#txtBoxPass').val()
            };

            $.ajax({
                type: "POST",
                url: "http://api.riw.com.br/api/login",
                data: postData,
                contentType: "application/x-www-form-urlencoded",
                success: function (responseData, textStatus, jqXHR) {
                    localStorage.setItem('token', responseData);

                    location.href = 'products.html';
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(errorThrown);
                    alert(errorThrown);
                }
            });
        });

    }); // end of document ready
})(jQuery); // end of jQuery name space