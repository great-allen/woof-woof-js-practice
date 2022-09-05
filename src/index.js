const url = 'http://localhost:3000/pups';
const dogInfoDiv = document.querySelector('#dog-info')
const filterBtn=document.querySelector('#good-dog-filter');
//console.log(filterBtn);
//console.log(dogInfoDiv);
 init = function (){
    const dogBar=document.querySelector('#dog-bar');
    fetchDogs().then(renderDogBar);
 
 function fetchDogs(){
      return fetch(url)
        .then(res=>res.json())
        
 }

 function renderDogBar(dogs){
    dogs.forEach(dog=>addDogToBar(dog));
 }
 
 function addDogToBar(dog){
    const span = document.createElement('span');
   span.setAttribute('data-id', dog.id);
   //console.log(span);
    span.innerHTML = dog.name;
    span.addEventListener('click',showDogInfo)
    dogBar.append(span)
 }

function showDogInfo(e){
   const dogId=e.target.dataset.id;
   //console.log(dogId);
   fetch(`http://localhost:3000/pups/${dogId}`)
    .then(resp=>resp.json())
    .then(dog =>{
        const goodOrBad= dog.isGoodDog? 'Good dog!':'Bad dog!'
        dogInfoDiv.innerHTML = `<img src=${dog.image}> 
                                <h2>${dog.name}</h2> 
                                 <button data-id=${dogId}>${goodOrBad}</button>`
        dogInfoDiv.querySelector('button').addEventListener('click',toggleDog);
    })
}
function toggleDog(e){
    const goodOrBad = e.target.innerText.slice(0,4);
    const isGoodDog =goodOrBad ==='Good'? true:false;
    const newStatus = isGoodDog? 'Bad dog!':'Good dog!'
    const dogId=e.target.dataset.id;
    fetch(`http://localhost:3000/pups/${dogId}`,{
        method:'PATCH',
        body: JSON.stringify({isGoodDog: !isGoodDog}),
        headers: {'Content-Type': 'application/json'},
    })
    .then(resp=>resp.json())
    .then(console.log)
    e.target.innerText = newStatus; 
}

filterBtn.addEventListener('click',filterDogs);
function filterDogs(e){
    dogBar.innerHTML='';
    const onOrOff= e.target.innerText.split(': ')[1];
    if ( onOrOff=== 'ON'){
        e.target.innerHTML = 'Filter good dogs: OFF'
        fetchDogs().then(renderDogBar);
    }else {
        e.target.innerHTML='Filter good dogs: ON'
        fetchDogs()
        .then(dogs=>dogs.filter(dog=> dog.isGoodDog))
        .then(goodDogs=>renderDogBar(goodDogs))
    }
}

 }
document.addEventListener('DOMContentLoaded',init);