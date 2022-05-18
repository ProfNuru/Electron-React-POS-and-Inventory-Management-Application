const userEmail = document.getElementById('userEmail');
const appAuthKey = document.getElementById('appAuthKey');
const admin_username_field = document.getElementById('admin-username');
const admin_password1_field = document.getElementById('admin-password1');
const admin_password2_field = document.getElementById('admin-password2');
const to_trial_btn = document.getElementById('to-trial');
const submit_forms = document.getElementById('submit-forms');

to_trial_btn.addEventListener("click", set_login_credentials_and_launch);
submit_forms.addEventListener("click", authenticate_and_set_login);


function set_login_credentials_and_launch(){
    let username = admin_username_field.value;
    let pwd1 = admin_password1_field.value;
    let pwd2 = admin_password2_field.value;

    if(username.trim().length <= 0){
        alert('username required');
        return;
    }
    if(pwd1.trim().length <= 0 || pwd1 !== pwd2){
        alert('passwords do not match');
        return;
    }
    try {
        // fetch for JWT
    } catch{
        // On failure, save login credentials locally
    }
}

function authenticate_and_set_login(){
    let auth_email = userEmail.value;
    let auth_key = appAuthKey.value;

    if(auth_email.trim().length <= 0){
        alert('E-mail required');
        return;
    }
    if(auth_key.trim().length <= 0){
        alert('Authentication key required');
        return;
    }
}
