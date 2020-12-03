export const Register = {
    data() {
        return {
            name: "",
            password: ""
        }
    },
    methods: {
        save() {
            if (name != "" && password != "") {
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

module.exports = { Register }