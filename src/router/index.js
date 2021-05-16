import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import VideoIndir from "@/views/VideoIndir";
import VideoIcerik from "@/views/VideoIcerik";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/video/:videoid',
        name: 'VideoIcerik',
        component: VideoIcerik
    },
    {
        path: '/videoindir',
        name: 'VideoIndir',
        component: VideoIndir,
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        //component: () => import(/* webpackChunkName: "about" */ '../views/VideoIndir.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
