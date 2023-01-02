document.addEventListener('DOMContentLoaded', () => {
 
    const grid =document.querySelector(".grid");
 /*document.querySelector(".grid") is a inbuilt javascript method 
 we are looking for class (.grid) through this, once we found it, we assign it 
 to the const grid */
    let squares = Array.from(document.querySelectorAll(".grid div")); // makes the grid element into  a grid
    const width =10; 
    const scoreDisplay =document.querySelector("#score");
    const startBtn = document.querySelector("#start-button"); 
    let nextRand=0
    let timerId
    let score =0
    const col=[
        'brown',
        'rebeccapurple',
        'red',
        'green',
        'blue'
    ]

    //The tetrominoes

    const lTet=[
        [1,width+1,width*2+1,2],
        [width,width+1,width+2,width*2+2],
        [1,width+1,width*2+1,width*2],
        [width,width*2,width*2+1,width*2+2]
    ]

    const zTet=[
        [width*2,width*2+1,width+1,width+2],
        [1,width+1,width,width*2],
        [width,width+1,width*2+1,width*2+2],
        [1,width+1,width+2, width*2+2]
    ]

    const sTet=[
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
    ]
   
    const TTet=[
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ]
     
    const iTet=[
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ]

    const theTet=[lTet,zTet,sTet,TTet,iTet];

    let currpos= 4;
    let currrot=0;

// randomly select a tetromino
let random =Math.floor(Math.random()*theTet.length)
    let current =theTet[random][0];
   // console.log(current);

    
   // draws Tetromino
   function draw(){
    current.forEach(index => {
        squares[currpos +index].classList.add("tet") //add the element on screen
        squares[currpos +index].style.backgroundColor =col[random]
        
    })
    }

   // draw();

   //undraw the tetromino
   function undraw(){
    
    current.forEach(index => {
        squares[currpos +index].classList.remove("tet") //add the element on screen
        squares[currpos +index].style.backgroundColor =''
    })
   }
 
   //make the tetromino move down every second
//    timerId =setInterval(moveDown,1000);


   // assign functions to keyCodes:
 function control(e){
    if(e.keyCode === 37) {moveLeft();}
    else if( e.keyCode===38 ) {rotate();
    }
    else if(e.keyCode ===39) {
        moveRight();
    }
    else if(e.keyCode ===40){
        moveDown();
    }

   }
    document.addEventListener('keyup',control);


   //move down function
   function moveDown(){
    undraw()
    currpos +=width;
    draw()
    freeze()
   }
   
  function freeze(){
    if(current.some(index => squares[ currpos +index +width].classList.contains('taken'))){
    current.forEach(index=> squares[currpos+index].classList.add('taken'))   
    //start a new tetromino falling
    random=nextRand
    nextRand=Math.floor(Math.random()* theTet.length)
        current =theTet[random][currrot];
        currpos =4;
        draw()
        disShape()
        addScore()
        gameover()
    }
}

function moveLeft(){
    undraw();
    const isAtLeftEdge= current.some(index => (currpos +index) % width ===0)
    if(!isAtLeftEdge) currpos-=1;

    if(current.some(index=> squares[currpos+index].classList.contains('taken')))
   {  currpos +=1
}     draw();
}

// move the tetromino right, unless is at edge or there is a blockage 

function moveRight(){
    undraw();
    const isAtRightEdge = current.some(index => (currpos +index) % width ===width-1);
    if(!isAtRightEdge) currpos+=1;
    if(current.some(index=> squares[currpos +index].classList.contains('taken'))){
        currpos -=1
    }  draw();
}

// rotate the tetromino

function rotate(){      
    undraw()
    currrot ++
    if(currrot === current.length){
        // if the current rotation gets to 4, make it back to 0
        currrot =0
    }

    current=theTet[random][currrot]
    draw()
}

//show up-next tet in mini grid

const mingrid=document.querySelectorAll('.mini-grid div')
const disW= 4
const disInd=0


// the tet without rotation

const nextTet= [
    [1, disW+1,disW*2+1,2], //ltet
    [0,1,disW+1,disW+2], //ztet
    [0,1, disW,disW+1], //stet
    [0,1,2,disW+1], // ttet   
    [1,disW+1,disW*2+1,disW*3+1] //itet
]


//display the shape in mini-grid display

function disShape(){
    // remove any trace from entire grid
    mingrid.forEach( square =>{ 
        square.classList.remove('tet')
        square.style.backgroundColor =''
    } )
    nextTet[nextRand].forEach(index => {
        mingrid[disInd+ index].classList.add("tet")
        mingrid[disInd+ index].style.backgroundColor=col[nextRand]
    })
}


startBtn.addEventListener('click',()=>{
    if(timerId){
        clearInterval(timerId)
        timerId=null
    }else{
        draw()
        timerId=setInterval( moveDown, 1000)
        nextRand=Math.floor(Math.random()*theTet.length)
        
    }

})

//add score

function addScore() {
    for(let i=0;i<199;i +=width){
        const row =[i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9]

        if(row.every(ind=> squares[ind].classList.contains('taken'))){
            score+=10
            scoreDisplay.innerHTML =score
            row.forEach(ind=> { squares[ind].classList.remove('taken')
                                squares[ind].classList.remove('tet')
                                squares[ind].style.backgroundColor =''
        })
            const sqRemoved =squares.splice(i, width)
            squares =sqRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))

        }
    }

}

// gameover

function gameover(){
    if(current.some(ind => squares[currpos+ind].classList.contains('taken'))){
        scoreDisplay.innerHTML="end"
        clearInterval(timerId)
    }

}











})