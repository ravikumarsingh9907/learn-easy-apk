const p=document.getElementById('password');
const pe=document.getElementById('password_eye');
const p1=document.getElementById('new_password');
const pe1=document.getElementById('new_password_eye');


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

pe1.addEventListener('click',()=>{    
    if(p1.getAttribute('type')=='password'){
        p1.setAttribute('type','text');
        pe1.classList.add('fa-eye');
        pe1.classList.remove('fa-eye-slash');
    }
    else {
        p1.setAttribute('type','password');
        pe1.classList.add('fa-eye-slash');
        pe1.classList.remove('fa-eye');
    }
});