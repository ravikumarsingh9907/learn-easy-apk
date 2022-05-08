const i=document.getElementById('interest');
const p=document.getElementById('password');
const pe=document.getElementById('password_eye');
const s=document.getElementById('passfield');

i.addEventListener('change',()=>{
    i.style.color='#000';
});

// <i class="fa-solid fa-eye-slash"></i>

// s.lastElementChild.remove();
// s.lastElementChild.innerHTML='<i class="fa-solid fa-eye-slash"></i>';
// s.append(
// <i class="fa-solid fa-eye-slash"></i>);

pe.addEventListener('click',()=>{
    
    if(p.getAttribute('type')=='password'){
        p.setAttribute('type','text');
        pe.classList.add('fa-eye');
        pe.classList.remove('fa-eye-slash');
    }
    else{
        p.setAttribute('type','password');
        pe.classList.add('fa-eye-slash');
        pe.classList.remove('fa-eye');
    }

});