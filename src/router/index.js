import  VueRouter from 'vue-router'
import Vue from 'vue'


const  Login = () => import('../components/Login')
const Home = () => import('../components/Home')
const Welcome = () => import('../components/Welcome')
const User = () => import('../components/user/User')
const Rights = () => import('../components/power/Rights')
const Roles = () => import('../components/power/Roles.vue')
const Cart = () => import('../components/goods/Cart.vue')
// const Goods = () => import('../components/goods/Goods.vue')
const Params = () => import('../components/goods/Params.vue')
Vue.use(VueRouter)

 const router = new VueRouter ({
  
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home' ,
      component: Home,
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          component: Welcome
        },
        { 
          path: '/users',
          component: User
        },
        {
          path : '/rights',
        component: Rights        },
        {
          path : '/roles',
        component: Roles        },
        {
          path: '/categories',
          component: Cart
        },
        // {
        //   path: '/goods',
        //   component: Goods
        // },
        { path: '/params',
        component: Params       }
      ]
      
    },

  ]


})

router.beforeEach((to,from,next) => {
  if(to.path === '/login') {
    next()
    return
  }
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) {
    next('/login')
    return
  }
  next()
})
export default router