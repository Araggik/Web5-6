export const Edit = {
    data() {
        return {
            post: current
        }
    },
    methods: {
        save() {
            this.post['user_id'] = window.localStorage.getItem('user');
            if (!this.post['completed']) {
                this.post['completed'] = false;
            }
            $.ajax({
                type: "POST",
                url: '/update',
                data: JSON.stringify(this.post),
            }).done(function (result) {

            });
            current = {};
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

module.exports = { Edit }