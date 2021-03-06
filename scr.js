$.ajaxSetup({
    global: false,
    cache: false
});

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



Vue.component('blog-post', {
    data() {
        return {
            isshow: false
        }
    },
    props: ['id','title', 'body', 'completed'],
    methods: {
        show() {
            if (!this.isshow) {
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
                this.isshow = true;
            }
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
      <div :id="id" class="blog">
       <router-link to='/edit'><button v-on:click="send">Edit</button></router-link>
       <h1 class="titl">{{ title }}</h1>
       <p class="bod">{{body}}</p>
       <p class="comp">Complete:{{completed}}</p>
       <button v-on:click="show">Show Comment</button>
      </div>
    `
})

gposts= [
    
]

firstload=true

Home = {
    data() {
        return {
            posts: [],
            selected: "",
            isuser: window.localStorage.getItem('user'),
        }
    },
    methods: {
        Help(res) {
            window.localStorage.setItem('gposts', res);
        },
        onChange(event) {
            if (this.selected == "Name") {
                this.posts.sort(function compareNumbers(a, b) {
                    if (a.title > b.title) {
                        return 1;
                    }
                    if (a.title < b.title) {
                        return -1;
                    }
                    return 0;
                });
            }
            if (this.selected == "Completed") {
                this.posts.sort(function compareNumbers(a, b) {                   
                    return a.completed-b.completed;
                });
            }
        }
    },
    computed: {
        dynamicComponent: function () {           
            return {
                props: ['posts','selected'],
                template: `
                <div>                  
                  <blog-post
                    v-for="post in posts"
                    v-bind:key="post.id"
                    v-bind:id="post.id"
                    v-bind:title="post.title"
                    v-bind:body="post.body"
                    v-bind:completed="post.completed"
                  ></blog-post>
                </div>
                `,
            }
        }
    },
    beforeCreate: function () {
        var user_id = window.localStorage.getItem('user');
        if (user_id&&firstload) {
            $.ajax({
                type: "POST",
                url: '/get_posts',
                data: JSON.stringify(user_id),
                success: (response, gposts) =>{
                    window.localStorage.setItem('gposts', response);
                    gposts = JSON.parse(window.localStorage.getItem('gposts'));
                    this.posts = gposts;
                }
            })

            //firstload = false;
            //gposts = JSON.parse(window.localStorage.getItem('gposts'));
            //alert(gposts);
        }         
    }, 
    template:`
     <div>
      <select v-if="isuser" @change="onChange($event)" v-model="selected">
          <option disabled value="">Choose sort</option>
          <option>Name</option>
          <option>Completed</option>
      </select>
      <router-link v-if="isuser" to='/edit'><button>Create</button></router-link>
      <div v-bind:is="dynamicComponent" v-bind:posts=posts v-bind:selected=selected>
      </div>
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

const Register = {
    data() {
        return {
            name: "",
            password: ""
        }
    },
    methods: {
        save() {
            if (this.name != "" && this.password != "") {
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
            }
            else {
                alert("Enter the data");
            }
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

const Edit = {
    data() {
        return {
            post: current
        }
    },
    methods: {
        save() {
            this.post['user_id'] = window.localStorage.getItem('user');
            if (!this.post['completed']) {
                this.post['completed'] = 0;
            }
 
            $.ajax({
                type: "POST",
                url: '/update',
                contentType: false,
                processData: false,
                data: JSON.stringify(this.post),                          
            })
            current = {};

            //let findel = false;
            //alert(gposts);
            //gposts.forEach(function (item, index, array) {
            //    if (item.id == this.post['id']) {
            //        item.title = this.post['title'];
            //        item.body = this.post['body'];
            //        item.completed = this.post['completed'];
            //        findel = true;
            //    }
            //});
            //if (!findel) {
            //    gposts.push({ id: this.post['id'], title: this.post['title'], body: this.post['body'], user_id: this.post['user_id'], completed: this.post['completed'] });
            //}
        },
        del() {

            $.ajax({
                type: "POST",
                url: '/delete',
                contentType: false,
                processData: false,
                data: JSON.stringify(this.post),               
            })
            current = {};

            //alert(gposts);
            //gposts.forEach(function (item, index, array) {
            //    if (item.id == this.post['id']) {
            //        array.slice(index, 1);
            //    }
            //});
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