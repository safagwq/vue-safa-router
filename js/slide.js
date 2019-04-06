

var configs={
    moveThreshold : 3,
}

class Slide{

    static configs=configs

    constructor(el,events) {
        this.el = el
        this.events = events || {}

        el.addEventListener('touchstart',touchstart)
        el.addEventListener('touchmove',touchmove)
        el.addEventListener('touchend',touchend)

        el.slideObj = this

        // this.init()
    }

    init(){

        this.touchData={

            initX : 0,
            initY : 0,

            changeX : 0,
            changeY : 0,

            isMove : false,
            isStop : false,

            firstDirection : '',
            nowDirection : '',
            lastViewDirection : '',
            viewDirection : '',

            touchstartEvent : null,
            touchmoveEvent : null,
            lastTouchEvent : null,
        }
    }

    updateFirstDirection(){
        var touchData=this.touchData
        if(touchData.firstDirection!=''){
            return
        }

        if(Math.abs(touchData.changeX)>=configs.moveThreshold || Math.abs(touchData.changeY)>=configs.moveThreshold){
            touchData.isMove = true
            touchData.firstDirection = getDirection(touchData.changeX , touchData.changeY)
            touchData.lastViewDirection = touchData.firstDirection
            touchData.ViewDirection = touchData.firstDirection
        }
    }

    updateNowDirection(){
        var touchData=this.touchData
        if(touchData.firstDirection==''){
            return
        }
        touchData.nowDirection = getDirection(touchData.touchmoveEvent.clientX - touchData.lastTouchEvent.clientX , touchData.touchmoveEvent.clientY - touchData.lastTouchEvent.clientY)
    }

    updateViewDirection(){
        var touchData=this.touchData
        touchData.viewDirection = getViewDirection(touchData.firstDirection,touchData.lastViewDirection,touchData.nowDirection)
        touchData.lastViewDirection = touchData.viewDirection
    }
}






function touchstart(e){
    if(e.targetTouches.length!=1){
        return
    }

    var touch=e.targetTouches[0]
    this.slideObj.init()
    var touchData=this.slideObj.touchData

    touchData.initX = touch.clientX
    touchData.initY = touch.clientY
    touchData.touchstartEvent = touch
    touchData.lastTouchEvent = touch

    if(typeof this.slideObj.events.start == 'function'){
        this.slideObj.events.start(e,this.slideObj)
    }
}

function touchmove(e){


    if(e.targetTouches.length!=1){
        return
    }

    var touch=e.targetTouches[0]
    var touchData=this.slideObj.touchData

    touchData.changeX = touch.clientX - touchData.initX
    touchData.changeY = touch.clientY - touchData.initY



    touchData.touchmoveEvent = touch
    this.slideObj.updateFirstDirection()
    this.slideObj.updateNowDirection()
    this.slideObj.updateViewDirection()

    if(touchData.isStop!=true && typeof this.slideObj.events[touchData.firstDirection] == 'function'){
        this.slideObj.events[touchData.firstDirection](e,this.slideObj)
    }

    touchData.lastTouchEvent = touch

    if(touchData.isStop!=true && typeof this.slideObj.events.move == 'function'){
        this.slideObj.events.move(e,this.slideObj)
    }
}

function touchend(e){
    var touchData=this.slideObj.touchData
    if(e.targetTouches.length!=0){
        return
    }

    if(touchData.isStop!=true && typeof this.slideObj.events.end == 'function'){
        this.slideObj.events.end(e,this.slideObj)
    }

}


function getAngle(mx,my){

    var x = Math.abs(-mx)
    var y = Math.abs(-my)
    var z = Math.sqrt(Math.pow(x,2)+Math.pow(y,2))
    var cos = y/z

    var radina = Math.acos(cos)
    var angle = Math.floor(180/(Math.PI/radina))

    // 第四象限
    if(mx>0 && my>0){
        angle = 180 - angle
    }

    // 负方向上
    if(mx==0 && my>0){
        angle = 180
    }

    // 正方向上
    if(mx>0 && my==0){
        angle = 90
    }

    // 第三象限
    if(mx<0 && my>0){
        angle = 180+angle
    }
    // x轴负方向
    if(mx<0 && my==0){
        angle = 270
    }

    // 第二象限
    if(mx<0 && my<0){
        angle = 360 - angle
    }

    return angle
}


function getDirection(x,y){
    var angle=getAngle(x, y)
    if(angle>=360-45 || angle<=45 ){
        return 'up'
    }
    if(angle>=360-45-90){
        return 'left'
    }
    if(angle>=360-45-90-90){
        return 'down'
    }
    if(angle>=45){
        return 'right'
    }
}


function getViewDirection(firstDirection,lastViewDirection,nowDirection){
    var viewDirection=''

    if(firstDirection=='up' || firstDirection=='down'){

        if(nowDirection=='left' || nowDirection=='right'){
            viewDirection = lastViewDirection
        }
        else{
            viewDirection = nowDirection=='up'?'up':'down'
        }
    }

    if(firstDirection=='left' || firstDirection=='right'){

        if(nowDirection=='up' || nowDirection=='down'){
            viewDirection = lastViewDirection
        }
        else{
            viewDirection = nowDirection=='left'?'left':'right'
        }
    }

    return viewDirection
}




export default Slide