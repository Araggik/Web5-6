export const Login = {
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

module.exports = { Login }