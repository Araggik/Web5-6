function stringToHash(string) {

    var hash = 0;

    if (string.length == 0) return hash;

    for (i = 0; i < string.length; i++) {
        char = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }

    return hash;
} 

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
            var url = '/reg';
            var pass = stringToHash(this.password);
            user = {
                login: this.name,
                password: pass,
            }
            $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify(user),
            }).done(function (result) {
                alert("alo");
            });
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