let strings=document.getElementsByClassName("btn");
let container=document.getElementById("container");


for(let i=0; i<strings.length;i++){
    strings[i].addEventListener("click",()=>{
        pickedNote=strings[i].value;

        isStringSelected=true;

    })
}