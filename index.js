/**
 * Created by admin on 17-4-12.
 */
//初始画布
var c1=document.getElementById("myCanvas");
var c2=document.getElementById("myCanvas2");
var width = document.body.clientWidth;
var height = document.body.clientHeight;
var direction = document.getElementById("direction");//控制台
c1.width = width;
c1.height = height;
c2.width = width;
c2.height = height;
var cxt1=c1.getContext("2d");
var cxt2=c2.getContext("2d");
//蛇的身子的集合
var snack = [{x:width/2,y:height/2}];
//蛇的身子的颜色
cxt1.fillStyle="#FF0000";
//单位时间内运动距离，默认向下走
var sportX = 0,sportY = 1;
//运动是时间，每次改变运动的时候要清除
var sportTime;
//运动的路径集合
var sportPath = [];
//食物的集合
var apples = [];
//分数
var score = 0;
//每次增加的食物个数，一开始是三倍
var appleCount = 30;
var appleColor = ["#aea8d3","#8e44ad","#59abe3","#34980b","#4ecdc4","#66cc99","#f5d76e"];
//移动的时候
var lastX,lastY;
direction.addEventListener('touchmove', function (event) {
    var touch = event.touches[0]; //获取第一个触点
    var x = touch.clientX;
    var y = touch.clientY;
    //每次移动的值，长度为1px
    var moveX = x-height/10;
    var moveY = y - height/10;
    var moveRatio = moveX/moveY;
    sportY = Math.sqrt(1/(moveRatio*moveRatio+1))*(Math.abs(moveY)/moveY);
    sportX = Math.abs(sportY*moveRatio)*(Math.abs(moveX)/moveX);
    //保证控制的球不超过边界
    var left,top;
    var h = height/10;
    var xy = Math.abs(x/y);
    var dis = Math.sqrt((h-x)*(h-x)+(h-y)*(h-y));
    if(Math.abs(dis)>height/40){
        left =height/10+ sportX*height/40;
        top = height/10+ sportY*height/40;
    }
    else{
        left = x;
        top = y;
    }
    direction.style.left=left-height/40+"px";
    direction.style.top=top-height/40+"px";

    clearTimeout(sportTime);
    sport();
}, false);
//不按住的时候回到原位
direction.addEventListener('touchend', function (event) {
    direction.style.left="7.5vh";
    direction.style.top="7.5vh";
}, false);

function init(){
    initPath();
    render();
    apple(appleCount*3);
    addSnack();
    sport();
}
//为了给后面加的蛇身子提供位置
function initPath(){
    for(var i=0;i<30;i++){
        sportPath[i] = {};
        sportPath[i].x = height/2;
        sportPath[i].y = height/2+i;
    }
}
//渲染蛇
function render(){
    cxt1.clearRect(0,0,width,height);
    for(var i=0;i<snack.length;i++){
        cxt1.beginPath();
        cxt1.arc(snack[i].x,snack[i].y,15,0,Math.PI*2);
        cxt1.closePath();
        cxt1.fill();
    }
}
//增加蛇的长度
function addSnack(){
    var obj  ={};
    obj.x = snack[snack.length-1].x;
    obj.y = snack[snack.length-1].y+30;
    snack.push(obj);
    render();
}
//添加食物
function apple(count){
    var x, y;
    for(var i= 0,con = count || appleCount;i<con;i++){
        cxt2.fillStyle=appleColor[Math.floor(Math.random()*appleColor.length)];
        x = Math.floor(Math.random()*width);
        y = Math.floor(Math.random()*height);
        apples.push({x:x,y:y});
        cxt2.beginPath();
        cxt2.arc(x,y,10,0,Math.PI*2);
        cxt2.closePath();
        cxt2.fill();
    }
    setTimeout(apple,30000);
}
//持续运动
function sport(){
    var obj={};
    snack[0].x += sportX;
    snack[0].y += sportY;
    if(snack[0].x>width-15 || snack[0].x<15 || snack[0].y>height-15 || snack[0].y<15){
        console.log("shule");
        clearTimeout(sportTime);
        return;
    }
    obj.x = snack[0].x;
    obj.y = snack[0].y;
    sportPath.unshift(obj);
    for(var i=1;i<snack.length;i++){
        snack[i].x = sportPath[i*30].x;
        snack[i].y = sportPath[i*30].y;
    }
    if(sportPath.length > snack.length*30+3){
        sportPath.splice(snack.length*30+3,(sportPath.length - snack.length*30+3));
    }
    clearApple(snack[0].x,snack[0].y);
    render();
    sportTime = setTimeout(sport,10);
}
//吃掉食物
function clearApple(x,y){
    for(var i=0;i<apples.length;i++){
        if(Math.abs(apples[i].x - x)<25 && Math.abs(apples[i].y - y)<25){
            cxt2.clearRect(apples[i].x-10,apples[i].y-10,20,20);
            apples.splice(i,1);
            score++;
            if(score%10 === 0){
                addSnack();
            }
        }
    }
}
init();