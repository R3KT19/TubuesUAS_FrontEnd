<template>
    <v-main class="list">
        <h3 class="text-h3" font-weight-medium mb-5> Profile </h3>
        
        <v-card>
                <v-card-title>
                        <span class="headline">Profile</span>
                        
                </v-card-title>
                <v-card-text>
                        <v-container v-model="profile">
                            <v-text-field v-model="test.username" label="Username" :disabled="disabled == 1"></v-text-field>
                            <v-text-field v-model="test.nama" label="Nama" :disabled="disabled == 1"></v-text-field>
                            <v-text-field v-model="test.telp" label="Telepon" :disabled="disabled == 1"></v-text-field>
                            <v-text-field v-model="test.password" label="Password" type="password" min="8" :rules="passwordRules" counter required :disabled="disabled == 1"></v-text-field>
                            <v-text-field v-model="test.email" label="Email" disabled></v-text-field>
                        </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="cancel; disabled = (disabled + 1) % 2">Enable Edit</v-btn>
                    <v-btn color="primary" @click="setForm">Save</v-btn>
                </v-card-actions>
            </v-card>

        <v-dialog v-model="dialogDelete" persistent max-width="400px" width='100%'>
            <v-card>
                <v-card-title>
                        <span class="headline">Warning!</span>
                </v-card-title>
                    <v-card-text>Anda Yakin ingin menghapus profile ini?</v-card-text>
                <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="dialogDelete = false">Cancel</v-btn>
                        <v-btn color="blue darken-1" text @click="deleteProfile">Delete</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{ error_message }}</v-snackbar>
    </v-main>
</template>

<script>
    export default {
        name: "List",
        data() {
            return {
                load: false,
                snackbar: false,
                error_message:'',
                color: '',
                disabled: 1,
                search: null,
                dialog: false,
                dialogDelete: false,
                headers: [
                    { text: "", align: "start", sortable: true, value: "username"},
                    { text: "", value:'nama'},
                    { text: "", value: 'telp'},
                    { text: "", value:'password'},
                    { text: "", value:'actions'},
                ],
                user: new FormData,
                users: [],
                form: {
                    username: null,
                    nama: null,
                    telp: null,
                    password: null,
                },
                test: {
                    username: null,
                    nama: null,
                    telp: null,
                    email: null,
                    password: null,
                },
                deleteId:'',
                editId:''
            };
        },
        methods: {
            setForm(){
                this.update();
            },
            // Read Data Courses
            readData() {
                var url = this.$api + '/user/' + localStorage.getItem('id');
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.test.username = response.data.username;
                    this.test.nama = response.data.nama;
                    this.test.telp = response.data.telp;
                    this.test.email = response.data.email;
                })
            },
            // ubah data Course
            update() {
                let newData = {
                    username : this.test.username,
                    nama : this.test.nama,
                    telp : this.test.telp,
                    password : this.test.password
                };
                var url = this.$api + '/user/' + localStorage.getItem('id');
                this.load = true;
                this.$http.put(url, newData, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.error_message = response.data.message;
                    this.color = 'green';
                    this.snackbar =true;
                    this.load = false;     
                    this.close();
                    this.readData(); // baca data
                    this.resetForm();
                }).catch(error => {
                    this.error_message =error.response.data.message;
                    this.color = 'red';
                    this.snackbar = true;
                    this.load = false;
                });
            },
            // Hapus data profile
            deleteProfile() {
                
                var url =this.$api + '/user/' + this.deleteId;
                this.load = true;
                this.$http.delete(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.error_message=response.data.message;
                    this.color = "green";          
                    this.snackbar= true;
                    this.load = false;
                    this.close();
                    this.readData();
                    this.resetForm();
                }).catch(error => {
                    this.error_message= error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
            },
            editHandler(item) {
                this.editId = item.id;           
                this.form.username = item.username;
                this.form.nama = item.nama;
                this.form.telp = item.telp;
                this.form.password = item.password;
                this.dialog= true;
            },
            deleteHandler(id) {
                this.deleteId = id;
                this.dialogDelete = true;
            },
            close() {
                this.dialog = false;
                this.dialogDelete = false;
                this.readData();
            },
            cancel () {
                this.resetForm();
                this.readData();
                this.dialog = false;
                this.dialogDelete = false;
            },
            resetForm() {    
                this.form = {
                    username: null,
                    nama: null,
                    telp: null,
                    password: null
                };
            },
        },
        mounted () {
            this.readData();      
        },
    };
</script>