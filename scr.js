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

current = {

}

Edit =  {
    data() {
        return {
            post: current
        }
    },
    methods: {
        save() {
        }
    },
    template: `
       <div>
         Title:
         <input v-model="post['title']">
         Body:
         <input v-model="post['body']">
         <button v-on:click="save">Save</button>
      </div>
    `
}

Vue.component('blog-post', {
    props: ['id','title', 'body', 'completed'],
    methods: {
        show() {

        },
        send() {
            current = {
                id: this.id,
                title: this.title,
                body: this.body,
                completed: this.completed,                
            }
            alert("Allo");
        }
    },
    template: `
      <div>
       <router-link to='/edit'><button v-on:click="send">Edit</button></router-link>
       <h1>{{ title }}</h1>
       <p>{{body}}</p>
       <p>Complete:{{completed}}</p>
       <button v-on:click="show">Show Comment</button>
      </div>
    `
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
          v-bind:id="post.id"
          v-bind:title="post.title"
          v-bind:body="post.body"
          v-bind:completed="post.completed"
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
                alert(result);
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
            var pass = stringToHash(this.password);
            user = {
                login: this.name,
                password: pass,
            }
            $.ajax({
                type: "POST",
                url: '/check_pass',
                data: JSON.stringify(user),
            }).done(function (result) {
                if (result != 'false') {
                    posts = JSON.parse(result);
                }
                else {
                    alert("Check data");
                }
            });
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
    { path: '/edit', component: Edit},
    { path: '*', component: NotFound}
]

const router = new VueRouter({
    routes 
})

const app = new Vue({
    router
}).$mount('#app')