import { createRouter, createWebHashHistory} from 'vue-router'

const router = createRouter({
    linkActiveClass:'active',
    history: createWebHashHistory(),
    routes:[

        {
            path:'/login',
            component: () => import ('../views/Login.vue')
        },
        {
            path:'/',
            component: () => import ('../layout/Layout.vue'),
            redirect:'/chat',
            children:[
                {
                    path:'/chat',
                    component:()=> import('../views/Chat.vue')
                },
                {
                    path:'/friends',
                    component:()=> import('../views/Friends.vue')
                }
            ]


        }
    ]
})

router.beforeEach((to, from, next) => {
    if (to.path.toLowerCase() === '/login') {
      next()
    } else {
      const user = JSON.parse(localStorage.getItem('user'))
      if (user?.token) {
        next()
      } else {
        alert('请先登陆')
        next('/login')
      }
    }
  })

export default router