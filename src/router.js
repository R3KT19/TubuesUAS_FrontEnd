import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
function importComponent(path){
    return()=> import(`./components/${path}.vue`);
}

const router = new VueRouter({
    mode: 'history',
    routes:[
        {
            path: '/',
            component: importComponent("DashboardLayout"),
            children: [
                //Dashboard
                {
                    path:'/profile',
                    name: 'Profile',
                    meta:{title: 'Profile'},
                    component: importComponent('Profile'),
                },
                {
                    path: '/services',
                    name: 'Services',
                    meta: { title: 'Services' },
                    component: importComponent('DataMaster/Services'),
                },
                {
                    path: '/carservices',
                    name: 'Car Services',
                    meta: { title: 'Car Services' },
                    component: importComponent('DataMaster/CarServices'),
                },
                {
                    path: '/personalservices',
                    name: 'Personal Services',
                    meta: { title: 'Personal Services' },
                    component: importComponent('DataMaster/PersonalServices'),
                },

            ],
        },
        {
            path: '/register',
            name: 'Register',
            meta: { title: 'Register'},
            component: importComponent('Register'),
        },
        {
            path: '/login',
            name: 'Login',
            meta: { title: 'Login'},
            component: importComponent('Login'),
        },
        {
            path:'*',
            redirect: '/'
        },
    ],
});

//set Judul
router.beforeEach( (to, from, next) => {
    if(to.name != "Login" && localStorage.getItem("token") == null && to.name!="Register"){
        next('Register')
        document.to.meta.title = "Register"
    }
    
    document.title = to.meta.title;
    next();
});
export default router;