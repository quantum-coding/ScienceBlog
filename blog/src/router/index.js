import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import Info from '../components/Info.vue'
import Manage from '../components/manage/Manage.vue'
import NewArticle from '../components/manage/NewArticle'
import Write from '../components/manage/Write'
import PublishedArticle from '../components/manage/PublishedArticle'
import ArticleDetail from '../components/ArticleDetail'
import '../assets/css/global.css'
import store from '../store/index'

Vue.use(VueRouter)

const routes = [
    { path: '/', redirect: '/home' },
    {
        path: '/home',
        component: Home,
        children: [
            { path: '/login', component: Login },
            { path: '/register', component: Register },
            { path: '/info', component: Info },
            {
                path: '/manage',
                component: Manage,
                children: [
                    { path: '/newArticle', component: NewArticle },
                    { path: '/publishedArticle', component: PublishedArticle }
                ]
            },
            { path: '/articleDetail/:id', component: ArticleDetail }
        ]
    },
    { path: '/write', component: Write }
]

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    // 获取token值
    const tokenStr = window.sessionStorage.getItem('token')
        // 如果要去的是登陆页直接放行
    if (to.path === '/login' || to.path === '/home' || to.path === '/register') {
        // 在跳入首页时判断用户的登陆状态， 如果没有就显示登陆按钮， 隐藏用户信息
        if (to.path === '/home') {
            if (!tokenStr) {
                store.state.showLoginbtn = true
                store.state.showUser = false
            } else {
                // 如果登录了保存用户的登陆状态
                store.state.showLoginbtn = false
                store.state.showUser = true
            }
        }
        if (to.path === '/login') {
            store.state.showLoginbtn = false
            store.state.showUser = false
        }
        return next()
    }
    // 如果token值不存在则强制跳转到登陆页
    if (!tokenStr) return next('/login')
    next()
})
export default router