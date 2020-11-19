Object.defineProperty(String.prototype, 'hashCode', {
    value: function () {
        var hash = 0, i, chr;
        for (i = 0; i < this.length; i++) {
            chr = this.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0;
        }
        return hash;
    }
});

const NotFound = {
    template: `
    <p> Not found</p> 
    `
}
const Home = {
    template: `
    <p>Home</p>
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