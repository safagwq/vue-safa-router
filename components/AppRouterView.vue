<style>

    .Page{background:#fff;  box-shadow:0 0 15px rgba(0,0,0,0.15);  }
    .Page-scroller{padding-top:64px;  }

    .Page[cache='true']{position:fixed;  top:0;  left:0;  height:100%;  width:100%;  z-index:-1;  transform:translateX(0);  }
    .Page[cache='true']>.Page-scroller{position:absolute;  width:100%;  min-height:100%;  top:0;  left:0;  }
</style>

<template>

    <transition
        @before-leave="beforeLeave"
        @before-enter="beforeEnter"

        @leave="leave"
        @enter="enter"
    >
        <AppKeepAlive>
            <RouterView v-slide="{ right, start, end }"/>
        </AppKeepAlive>
    </transition>


</template>

<script>

    import anime from 'animejs'
    import AppRouter from '../js/app-router.js'

    var views=AppRouter.getViews()


    export default{
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
                

                slideObj.el.style.transform = `translateX(${ slideObj.touchData.changeX }px)`
                if( views.list[views.lastIndex-1] ){
                    views.list[views.lastIndex-1].el.style.transform = `translateX(${ -window.innerWidth/2 + slideObj.touchData.changeX/2  }px)`
                }
            },
            end(e,slideObj){

                if(!slideObj.touchData.isMove){
                    return
                }

                if(slideObj.touchData.changeX > 100 && slideObj.touchData.viewDirection == 'right'){
                    this.$router.back()
                }
                else{

                    anime({
                        targets : views.list[views.lastIndex].el,
                        translateX : [0],
                        duration : 200,
                        easing : 'easeOutSine',
                        complete : function (){
                            restoreView( views.list[views.lastIndex].el )
                        }
                    })

                    if( views.list[views.lastIndex-1] ){

                        var moveEl=views.list[views.lastIndex-1].el

                        anime({
                            targets : moveEl,
                            translateX : [-window.innerWidth/2],
                            duration : 200,
                            easing : 'easeOutSine',
                            complete : function (){
                                moveEl.parentElement.removeChild(moveEl)
                            }
                        })

                    }
                }
            },


            beforeEnter(el) {
                var findIndex = getNowIndexInList(el)

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

            enter (el, done) {

                if(views.moveType=='forward'){
                    forwardEnter(el)
                }
                else{
                    backEnter(el)
                }

                done()
            },
            leave (el, done) {

                if(views.moveType=='forward'){
                    forwardLeave(el,done)
                }
                else{
                    backLeave(el,done)
                }
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

        var findIndex = getNowIndexInList(el)
        views.lastIndex = findIndex

        if(views.moveType=='forward'){
            el.style.transform = 'translateX(100%)'

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





    function forwardEnter(el){
        el.style.zIndex=1
        anime({
            targets : el,
            translateX : [0],
            duration : 300,
            easing : 'easeOutSine',
            complete : function (){
                el.style.transform=''
                el.style.zIndex=''

                restoreView(el)
            }
        })
    }

    function forwardLeave(el,done){
        anime({
            targets : el,
            translateX : [-window.innerWidth/2],
            duration : 300,
            easing : 'easeOutSine',
            complete : function (){
                done()
            }
        })
    }



    function backEnter(el){
        
        if(el._scrollTop){
            el.scrollTop=el._scrollTop
        }

        anime({
            targets : el,
            translateX : [0],
            duration : 300,
            easing : 'easeOutSine',
            complete : function (){
                el.style.transform=''
                el.style.zIndex=''
                restoreView(el)
            }
        })
    }

    function backLeave(el,done){
        el.style.zIndex=1
        anime({
            targets : el,
            translateX : [window.innerWidth],
            duration : 300,
            easing : 'easeOutSine',
            complete : function (){
                el.style.transform=''
                el.style.zIndex=''

                done()
            }
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
        // restoreView( views.list[views.lastIndex].el )
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
    
    function getNowIndexInList(el){
        var index=views.list.findIndex((item)=>item.el==el)
        if( index!=-1 ){
            return index
        }
        
        return views.list.findIndex(item=>{
            return history.state.key==item.key
        })
    }

</script>