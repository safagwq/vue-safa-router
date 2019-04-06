10<style>

    .Page{background:#fff;  box-shadow:0 0 15px rgba(0,0,0,0.15);  }
    .Page-scroller{}

    .Page[cache='true']{position:fixed;  top:0;  left:0;  height:100%;  width:100%;  z-index:-1;  transform:translateX(0);  }
    .Page[cache='true']>.Page-scroller{position:absolute;  width:100%;  min-height:100%;  top:0;  left:0;  }

    @keyframes enter{
        0%{transform:translateX(100%);  }
        100%{transform:translateX(0%);  }
    }

    @keyframes leave{
        0%{transform:translateX(0%);  }
        100%{transform:translateX(-50%);  }   
    }

</style>

<template>

    <transition
        @before-enter="beforeEnter"
        @before-leave="beforeLeave"

        @enter="enter"
        @leave="leave"

        @after-enter="afterEnter"
        @after-leave="afterLeave"
    >
        <AppKeepAlive>
            <RouterView v-slide="{ right, start, end }"/>
        </AppKeepAlive>
    </transition>


</template>

<script>

    import AppRouter from '../js/app-router.js'

    var views=AppRouter.getViews()


    export default{
        data(){
            return {
                view : {
                    animationType : 'forward'
                }
            }
        },
        mounted : function(){

            initViewsHome()
        },
        methods:{

            start(e,slideObj){

                if( slideObj.touchData.initX > 50 || views.lastIndex==0 ) {
                    slideObj.touchData.isStop=true
                    return
                }
            },
            right(e,slideObj){
                e.preventDefault()
                e.stopPropagation()

                if(!slideObj.touchData.isCahceView){
                    var el=slideObj.el
                    cacheView( el )
                    initPrevView()
                    slideObj.touchData.isCahceView=true
                }
                

                var changeStatue=slideObj.touchData.changeX/window.innerWidth * 0.4

                slideObj.el.style.animation = `enter 0.4s linear -${changeStatue}s reverse paused`

                if( views.list[views.lastIndex-1] ){
                    views.list[views.lastIndex-1].el.style.animation = `leave 0.4s linear -${changeStatue}s reverse paused`
                }
            },
            end(e,slideObj){

                if(!slideObj.touchData.isMove){
                    return
                }

                if(slideObj.touchData.changeX > 100 && slideObj.touchData.viewDirection == 'right'){
                    views.backTime= 1.5 * 300* (1 - slideObj.touchData.changeX/window.innerWidth )

                    // this.$router.back()
                }
                else{

                    slideObj.el.style.animation = `enter 0.4s linear -${changeStatue}s reverse paused`

                    if( views.list[views.lastIndex-1] ){
                        views.list[views.lastIndex-1].el.style.animation = `leave 0.4s linear -${changeStatue}s reverse paused`
                    }
                }
            },






            beforeEnter(el) {

                var findIndex = getNowIndexInList()

                if(views.list.length > history.length){
                    views.list.splice(history.length-1).forEach(destroyVNode)
                }

                if(findIndex==-1){
                    pushView(el)
                    views.moveType='forward'
                }
                else{
                    views.moveType = findIndex > views.lastIndex? 'forward' : 'back'
                }

                initView(el)
            },
            beforeLeave(el) {
                cacheView(el)
            },
            enter(el){
                if(views.moveType=='forward'){
                    el.style.animation='enter 0.4s ease'
                }
                else{
                    el.style.animation='leave 0.4s ease reverse'
                }

            },
            leave(el){
                if(views.moveType=='forward'){
                    el.style.animation='leave 0.4s ease'
                }
                else{
                    el.style.zIndex=1
                    el.style.animation='enter 0.4s ease reverse'
                }
            },
            restoreView(el){
                
            },

            afterEnter(el) {
                el.style.animation=''
                el.style.zIndex=''
                restoreView(el)
            },
            afterLeave(el) {
                el.style.animation=''
                // cacheView(el)
            },
        },
    }


    function initViewsHome(){
        var key=Object.keys(views.vNodes)[0]

        views.list.push({
            key : history.state.key,
            el : views.vNodes[key].componentInstance.$el,
            vNode : views.vNodes[key]
        })
    }



    function initView(el){

        var findIndex = getNowIndexInList()
        views.lastIndex = findIndex

        if(views.moveType=='forward'){
            // el.style.transform = 'translateX(100%)'

            cacheView(el,0)
        }
        else{
            views.list.splice(findIndex+1).forEach(destroyVNode)
        }
    }

    function pushView(el){
        if(views.list.length == history.length){
            destroyVNode( views.list.pop() )
        }

        views.list.push({
            key : history.state.key,
            el : el,
            vNode : views.vNodes[history.state.key]
        })
    }




    function initPrevView(){
        var prevView=views.list[views.lastIndex-1]
        if( prevView ){
            var nowNode=views.list[views.lastIndex].el
            nowNode.parentElement.insertBefore( prevView.el , nowNode )

            if(prevView.el._scrollTop){
                prevView.el.scrollTop=prevView.el._scrollTop
            }
        }
    }

    function destroyVNode(view){
        view.vNode.componentInstance.$destroy()
        delete views.vNodes[view.key]
    }
    
    function cacheView(el, scrollTop=document.documentElement.scrollTop||document.body.scrollTop ){

        el._scrollTop = scrollTop

        el.querySelector('.Page-scroller').style.top=-scrollTop+'px'

        el.setAttribute('cache',true)
    }

    function restoreView(el){

        el.setAttribute('cache',false)

        el.style.transform=''
        el.querySelector('.Page-scroller').style.top=''

        document.documentElement.scrollTop=
        document.body.scrollTop= el._scrollTop
    }
    
    function getNowIndexInList(){
        return views.list.findIndex(item=>{
            return history.state.key==item.key
        })
    }

</script>