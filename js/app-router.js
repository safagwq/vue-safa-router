import Vue from 'vue'
import Slide from './slide.js'


Vue.directive('slide', {
    inserted: function (el,binding) {
        new Slide(el, binding.value )
    }
})

Vue.component('Page',{
    abstract: true,
    functional : true,
    render(_,ref) {

        var data=ref.data
        var parent=ref.parent

        if(data.class){
            if(Array.isArray(data.class)){
                data.class.push('Page-scroller')
            }
            else{
                data.class['Page-scroller']=true
            }
        }
        else{
            data.class='Page-scroller'
        }

        var h=parent.$createElement

        var AppView_scroller=h('div',data,ref.children)

        var children=[AppView_scroller]

        if(appRouter._config.AppViewPublic){
            children.push( h('AppViewPublic',{ attrs : { viewData : data.attrs && data.attrs.viewData } }) )
        }

        return h('div',{class:'Page'},children)
    }
})


Vue.component('AppKeepAlive',{
    abstract: true,
    render() {

        if(!history.state){
            history.replaceState( { key:Math.random() },'')
        }

        var vnode = this.$slots.default ? this.$slots.default[0] : null

        if(views.vNodes[history.state.key]){
            return views.vNodes[history.state.key]
        }

        if (vnode) {

            if(!vnode.key){
                vnode.key=history.state.key
            }

            if(!views.vNodes[history.state.key]){
                views.vNodes[history.state.key]=vnode
            }

            vnode.data.keepAlive = true
        }

        return vnode
    }
})


const views={
    list : [],
    lastIndex : 0,
    moveType : 'forward',
    vNodes : {}
}

window.views=views

const appRouter={
    $router : null,
    nextPath : null,
    _config : {
        AppViewPublic : false,
    },

    use($router){
        appRouter.$router=$router

        $router.beforeEach((to,form,next)=>{

            var nextPath=appRouter.nextPath

            if(nextPath){
                appRouter.nextPath=null
                return next(nextPath)
            }

            next()
        })
    },
    config(configObj){
        this.configObj
    },
    getViews(){
        return views
    },
    push(){
        $router.push(...arguments)
    },
    go(){
        $router.go(...arguments)
    },
    forward(){
        $router.forward(...arguments)
    },
    back(){
        $router.back()
    },
    backTo(){

    },
    replaceHome(path){
        location.replace('#'+path)
        views.nextPath=path
        history.go( -(views.list.length-1) )


        var newList=[views.list.pop()]

        views.list.forEach((data)=>{
            destroyVNode(data)
        })

        views.list=newList

        destroyVNode( views.list.pop() )
    },
    replace(path){
        location.replace('#'+path)
        destroyVNode( views.list.pop() )
    },
}


export default appRouter