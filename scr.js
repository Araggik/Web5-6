const NotFound = {
    template: `
    <p> Not found</p> 
    `
}
Vue.component('blog-post', {
    props: ['title','body'],
    template: '<div><h1>{{ title }}</h1><p>{{body}}</p></div>'
})
posts= [
   
]

Home = {
    data() {
        return {
            posts: posts
        }
    },
    template: `
       <div>
         <blog-post
          v-for="post in posts"
          v-bind:title="post.title"
          v-bind:body="post.body"
         ></blog-post>
      </div>
    `
}
const Register = {
    data() {
        return {
            name: "",
            password: ""
        }
    },
    methods: {
        save() {
            window.localStorage.setItem(this.name, this.password);
        },
    },
    template: ` 
       <div>
          Nickname:
          <input v-model="name">
          Password:
          <input v-model="password">
          <button v-on:click="save">Register</button>
       </div>
    `
}
const Login = {
    data() {
        return {
            name: "",
            password: ""
        }
    },
    methods: {
        check() {
            pass = window.localStorage.getItem(this.name);
            if (pass == this.password) {
                alert("ok");
                posts.push({ title: 'Hi', body: 'Test app'})
            }
            else {
                alert("false");
            }
        },
    },
    template: `
       <div>
          Nickname:
          <input v-model="name">
          Password:
          <input v-model="password">
          <button v-on:click="check">Login</button>
       </div>
    `
}
const Logout = {
    created: function () {
        posts=[]
    },
    template: `
    <p>Logout</p>
    `
}

const routes = [
    { path: '/', component: Home },
    { path: '/register', component: Register },
    { path: '/login', component: Login },
    { path: '/logout', component: Logout },
]

const router = new VueRouter({
    routes 
})

const app = new Vue({
    router
}).$mount('#app')