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

export default router