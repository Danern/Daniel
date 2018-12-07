var p1butt=document.querySelector("#p1");
var p2butt=document.querySelector("#p2");
var resetbutt=document.querySelector("#reset");
var p1Disp=document.querySelector("#p1Disp");
var p2Disp=document.querySelector("#p2Disp");
var scoreTill=document.querySelector("p span");
var num=document.querySelector("input");


var p1Score=0,p2Score=0;
var gameOver=false;
var winScore=5;


p1butt.addEventListener("click",function(){
		if(!gameOver)
		p1Score++;
		if(p1Score===winScore){
			p1Disp.classList.add("winner");
			gameOver=true;
		}
		p1Disp.textContent=p1Score;	
});

p2butt.addEventListener("click",function(){
		if(!gameOver)
		p2Score++;
		if(p2Score===winScore){
			p2Disp.classList.add("winner");
			gameOver=true;
		}
		p2Disp.textContent=p2Score;	
});

resetbutt.addEventListener("click",function(){
			p1Score=0;
			p2Score=0;
			p1Disp.textContent=0;
			p2Disp.textContent=0;
			p1Disp.classList.remove("winner");
			p2Disp.classList.remove("winner");
			gameOver=false;
});

function reset(){
			p1Score=0;
			p2Score=0;
			p1Disp.textContent=0;
			p2Disp.textContent=0;
			p1Disp.classList.remove("winner");
			p2Disp.classList.remove("winner");
			gameOver=false;

}

num.addEventListener("change",function(){
	scoreTill.textContent=this.value;
	winScore=Number(this.value);
	reset();
});