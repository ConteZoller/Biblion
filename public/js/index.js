'use strict';

class Login {
    constructor() {
        this.form = document.querySelector('#login-form');
        this.email = document.querySelector('#email');
        this.password = document.querySelector('#password');

        this.send();
    }

    send() {
        let self = this;

        this.form.addEventListener('submit', async e => {
            e.preventDefault();
            this.clearForm();

            const errors = this.validateForm();

            if(errors.length > 0) {
                for(let err of errors) {
                    this.handleResponse(err, this.form);
                }
            } else {

                const formData = {
                    email: this.email.value,
                    password: this.password.value
                };

                $.post( '/login', formData, function( response ) {
                    self.handleResponse(response, self.form);
                });

                

            }
        });
    }

    handleResponse(resp, target) {
        const element = document.createElement('div');
        if(resp.success) {
            window.location = location.href;
        } else {
            element.className = 'alert alert-danger mt-4';
            element.innerHTML = resp.error; 
        }
        target.appendChild(element);
    }

    clearForm() {
        const alerts = this.form.querySelectorAll('.alert');
        if(alerts.length > 0) {
            alerts.forEach(el => {
                this.form.removeChild(el);
            });
        }
    }

    validateForm() {
        const errors = [];
        if(!validator.isEmail(this.email.value)) {
            errors.push( { error: 'Invalid email.' } );
        }
        if(validator.isEmpty(this.password.value)) {
            errors.push( { error: 'Invalid password.' } );
        }
        return errors;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const login = new Login();
});