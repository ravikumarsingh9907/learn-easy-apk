const p=document.getElementById('password');
const pe=document.getElementById('password_eye');

pe.addEventListener('click',()=>{    
    if(p.getAttribute('type')=='password'){
        p.setAttribute('type','text');
        pe.classList.add('fa-eye');
        pe.classList.remove('fa-eye-slash');
    }
    else {
        p.setAttribute('type','password');
        pe.classList.add('fa-eye-slash');
        pe.classList.remove('fa-eye');
    }
});