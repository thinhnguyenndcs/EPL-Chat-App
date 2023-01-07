const checkEmpty = () => {
    if(document.forms['login-form'].room.value && document.forms['login-form'].username.value){
        return true;
    }
    alert("Please enter Username");
    return false;
}