<style>
    *{margin:0;  padding:0;  box-sizing:border-box;  }
    .Page{min-height:100vh;  }
    .Page-scroller{padding-top:64px;  }

    
    .flex{display:flex;  }
    .flex.center{justify-content:center;  align-items:center;  }
    .flex.acenter{align-items:center;  }
    .flex.right{flex-direction:row-reverse;  }
    .flex.top{flex-direction:column;  }
    .flex.wrap{flex-wrap:wrap;  }
    .flex-item{flex-shrink:0;  }
    .flex-item.shrink{flex-shrink:0;  }
    .flex-item.expand{flex-grow:1;  flex-shrink:1;  }

</style>

<template>
    <div id="app">
        <!-- <router-view/> -->
        <AppRouterView />
    </div>
</template>