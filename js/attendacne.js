const domain = "http://localhost:3000";

document.addEventListener('DOMContentLoaded', function () {
    (() => {
        'use strict'

        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        const forms = document.querySelectorAll('.needs-validation')

        // Loop over them and prevent submission
        Array.from(forms).forEach(form => {
            form.addEventListener('submit', event => {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
    })();

    const formAttendElm = document.querySelector(".form-attendance");
    formAttendElm.addEventListener('submit', function (e) {
        e.preventDefault();
        e.stopPropagation()

        if (!formAttendElm.checkValidity())
            return;

        const formUsernameElm = document.getElementById('Username');

        fetch(`http://localhost:3000/users?username=${formUsernameElm.value}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.length === 1 && data[0].username === formUsernameElm.value) {
                    let date = new Date();
                    let today = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
                    let userId = data[0].id;
                    // console.log(today)
                    // console.log(data[0].id);
                    fetch(`${domain}/users/${userId}/attendances?date=${today}`)
                        .then((res) => res.json())
                        .then((data) => {
                            if (data.length) {
                                let patchBody = {out: new Date().getTime()}
                                fetch(`${domain}/attendances/${data[0].id}`, {
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    method: "PATCH",
                                    body: JSON.stringify(patchBody)
                                }).then((res) => {
                                    return res.json();
                                })
                                    .then((data) => {
                                        console.log("departure confirmed!")
                                        console.log(data)
                                    })
                            } else {
                                let postBody = {in: new Date().getTime(), out: 0, date: today}
                                fetch(`${domain}/users/${userId}/attendances`, {
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    method: "POST",
                                    body: JSON.stringify(postBody)
                                }).then((res) => {
                                    return res.json();
                                })
                                    .then((data) => {
                                        console.log("attendance confirmed!")
                                        console.log(data)
                                    })
                            }
                        })
                } else {
                    document.querySelector('.invalid-username').classList.remove('d-none');
                }
            });
    });


});









