const app=document.getElementById('app');
const bar=document.getElementById('sidebar');
const cross=document.getElementById('top_cross');


function show(){
    app.classList.toggle('active');
    if(app.classList.contains("active")){
        cross.innerHTML="<i class='bx bx-x'></i>";
    }
    else {
        cross.innerHTML="<i class='bx bx-menu'></i>";
    }
}
bar.addEventListener('click', show);






