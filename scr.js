

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
            this.post['user_id'] = window.localStorage.getItem('user');
            $.ajax({
                type: "POST",
                url: '/update',
                data: JSON.stringify(this.post),
            }).done(function (result) {
               
            });
        },
        del() {
            $.ajax({
                type: "POST",
                url: '/delete',
                data: JSON.stringify(this.post),
            }).done(function (result) {

            });
        }
    },
    template: `
       <div>
         Title:
         <input v-model="post['title']">
         Body:
         <input v-model="post['body']">
         Completed:
         <input type="checkbox" v-model="post['completed']">
         <button v-on:click="save">Save</button>
         <button v-on:click="del">Delete</button>
      </div>
    `
}

Vue.component('blog-post', {
    props: ['id','title', 'body', 'completed'],
    methods: {
       show() {
            var url = "https://jsonplaceholder.typicode.com/posts";   
            var i = this.id;
            var index = i % 100;
            $.ajax({
            type: "GET",
            url: url,
            }).done(function (result) {
                mas = JSON.stringify(result[i % 100]);
                ob = JSON.parse(mas);
                div = document.getElementById(i);
                h5 = document.createElement('h5');
                h6 = document.createElement('h6');
                h5.textContent = ob.title;
                h6.textContent = ob.body;
                div.append(h5);
                div.append(h6);
            });
        },
        send() {
            current = {
                id: this.id,
                title: this.title,
                body: this.body,
                completed: this.completed,                
            }
        }
    },
    template: `
      <div :id="id">
       <router-link to='/edit'><button v-on:click="send">Edit</button></router-link>
       <h1>{{ title }}</h1>
       <p>{{body}}</p>
       <p>Complete:{{completed}}</p>
       <button v-on:click="show">Show Comment</button>
      </div>
    `
})

gposts= [
    
]

function Help(res,gp) {
    window.localStorage.setItem('gposts', res);
}

Home = {
    data() {
        return {
            posts: gposts,
            selected: 1,
        }
    },
    methods: {
        Help(res) {
            window.localStorage.setItem('gposts', res);
        },
        onChange(event) {
            this.posts.sort(function compareNumbers(a, b) {
                return a['title'] - b['title'];
            } );
            
        }
    },
    beforeCreate: function () {
        var user_id = window.localStorage.getItem('user');
        if (user_id) {
            $.ajax({
                type: "POST",
                url: '/get_posts',
                data: JSON.stringify(user_id),
                success: (response, gposts) =>{
                    Help(response, gposts);
                    gposts = JSON.parse(window.localStorage.getItem('gposts'));
                    this.posts = gposts;
                }
            })
        }         
       // gposts = JSON.parse(window.localStorage.getItem('gposts'));
        //this.posts = gposts;
    },
    template: `
       <div>
         <select  @change="onChange($event)" v-model="selected">
           <option disabled value="">Choose sort</option>
           <option>Name</option>
           <option>Completed</option>
         </select>
         <router-link to='/edit'><button>Create</button></router-link>
         <blog-post
          v-for="post in posts"
          v-bind:key="post.id"
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
                    var user_id = JSON.parse(result);
                    window.localStorage.setItem('user', user_id.toString());
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
        window.localStorage.clear();
        gposts = [];
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