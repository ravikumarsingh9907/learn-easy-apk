const app = document.getElementById('app');// getting the element by a id associate with the element from 'dom'
const bar = document.getElementById('sidebar');
const cross = document.getElementById('top_cross');
const search_cross = document.getElementById('search-box');
const btn = document.getElementById('btn');
const search_form = document.getElementById('search_form');
const searchBtn = document.getElementById('searchbtn');
const searchbox = document.getElementById('search-box');


// 
function show(){
    app.classList.toggle('active');// toggle() add the given paramater to the target element ,
    // if class has the parameter then it removes that classname(parameter) from the target element classlist
    // if class don't  have the parameter then it adds that classname(parameter) in the target element classlist

    // contains() check the classname (which is passed as a parameter) in the target element classlist
    // if that target element has the classname in his classlist it returns true else false

    if(app.classList.contains("active")){
        cross.innerHTML="<i class='bx bx-x'></i>";
    }
    else {
        cross.innerHTML="<i class='bx bx-menu'></i>";
    }
}

// targetElement.addEventListener(event,eventhandler);
bar.addEventListener('click', show);

// function discard() {
    
// }

search_cross.addEventListener('input',()=>{
  if(search_cross.value !=''){
    btn.style.display = 'block';
    search_form.classList.add('formwidth');
  }
  else{
    btn.style.display = 'none';
    search_form.classList.remove('formwidth');
  }
});

btn.addEventListener('click',(e)=>{
    // e is here eventobject which has all the info about the event
    e.preventDefault();// it prevents the default behaviour of the event
    search_cross.value ='';
    btn.style.display = 'none';
    search_form.classList.remove('formwidth');
});

searchBtn.addEventListener('click',(e)=>{
  if(e.target.id === 'searchShow'){
    search_form.classList.toggle('d-block'); 
  }
})






