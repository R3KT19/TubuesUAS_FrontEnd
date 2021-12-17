<template>
    <v-main class="list">
        <h3 class="text-h3" font-weight-medium mb-5>Car Services</h3>
        <v-card>
            <v-card-title>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details>
                </v-text-field>
                <v-spacer></v-spacer>
                <v-btn color="success" dark @click="dialog =true"> Tambah </v-btn>
            </v-card-title>
             <v-data-table :headers="headers" :items="services" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn x-small color="transparent" elevation="0" @click="editHandler(item)">
                        <v-icon color="light-green darken-1"> mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn x-small color="transparent" elevation="0" @click="deleteHandler(item.id)">
                        <v-icon color="red darken-1"> mdi-delete</v-icon>
                    </v-btn>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width= "600px" width='100%'>
            <v-card>
                <v-card-title>
                        <span class="headline">{{ formTitle }} Car Service</span>
                </v-card-title>
                <v-card-text>
                        <v-container>
                            <v-select v-model="form.service_mobil" :items="namaJasa" label="Nama Jasa" required></v-select>
                            <v-text-field v-model="form.jumlah_mobil" label="Jumlah Mobil" required></v-text-field>


                            <v-dialog
                                ref="dialog"
                                v-model="tanggal"
                                persistent
                                width="290px"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="form.tanggal"
                                    label="Pilih tanggal"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                ></v-text-field>
                                </template>
                                <v-date-picker
                                v-model="form.tanggal"
                                scrollable
                                >
                                <v-spacer></v-spacer>
                                <v-btn
                                    text
                                    color="primary"
                                    @click="tanggal = false"
                                >
                                    Cancel
                                </v-btn>
                                <v-btn
                                    text
                                    color="primary"
                                    @click="$refs.dialog.save(form.tanggal)"
                                >
                                    OK
                                </v-btn>
                                </v-date-picker>
                            </v-dialog>
                            <v-select v-model="form.tools" :items="tools" label="Tools" required></v-select>
                        </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="setForm">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogConfirm" persistent max-width="400px" width='100%'>
            <v-card>
                <v-card-title>
                        <span class="headline">Warning!</span>
                </v-card-title>
                    <v-card-text>Anda Yakin ingin menghapus service ini?</v-card-text>
                <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="dialogConfirm = false">Cancel</v-btn>
                        <v-btn color="blue darken-1" text @click="deleteData">Delete</v-btn>
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
                inputType: 'Tambah',
                load: false,
                snackbar: false,
                error_message:'',
                color: '',
                search: null,
                dialog: false,
                dialogConfirm: false,
                headers: [
                    { text: "Nama Jasa Mobil", align: "start", sortable: true, value: "service_mobil"},
                    { text: "Jumlah Mobil", value:'jumlah_mobil'},
                    { text: "Tools", value: 'tools'},
                    { text: "Tanggal", value:'tanggal'},
                    { text: "Actions", value:'actions'},
                ],
                service: new FormData,
                services: [],
                form: {
                    service_mobil: "",
                    jumlah_mobil: "",
                    tools: "",
                    tanggal: "",
                },
                deleteId:'',
                editId:'',
                namaJasa: ['Cuci Mobil', 'Wax Mobil', 'Lengkap(Cuci+Wax)'],
                tools: ['Hanya Jasa (Punya perlengkapan)', 'Lengkap dengan perlengkapan'],
                tanggal: false,
            };
        },
        methods: {
            setForm(){
                if(this.inputType !== 'Tambah'){
                    this.update();
                }else{
                    this.save();
                }
            },
            // Read Data Courses
            readData() {
                var url = this.$api + '/car/' + localStorage.getItem('id');
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.services = response.data.data;
                })
            },
            // simpan data Course
            save() {
                this.service.append ('service_mobil', this.form.service_mobil);
                this.service.append ('jumlah_mobil', this.form.jumlah_mobil);
                this.service.append ('tanggal', this.form.tanggal);
                this.service.append ('tools', this.form.tools);
                this.service.append ('usersID', localStorage.getItem('id'));
                var url = this.$api + '/car'
                this.load = true;
                this.$http.post(url, this.service, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                    }
            }).then(response => {
                this.error_message=response.data.message;
                this.color = "green";
                         
                this.snackbar =true;
                this.load = true; 
                this.close();
                this.readData(); // baca data
                this.resetForm();
            }).catch(error => {
                this.error_message=error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
                        
                });
            },
            // ubah data Course
            update() {
                let newData = {
                    service_mobil : this.form.service_mobil,
                    jumlah_mobil : this.form.jumlah_mobil,
                    tanggal : this.form.tanggal,
                    tools : this.form.tools
                };
                var url = this.$api + '/car/' + this.editId;
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
                    this.inputType = 'Tambah';
                }).catch(error => {
                    this.error_message =error.response.data.message;
                    this.color = 'red';
                    this.snackbar = true;
                    this.load = false;
                });
            },
            // Hapus data produk
            deleteData() {
                
                var url =this.$api + '/car/' + this.deleteId;
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
                    this.inputType = "Tambah";
                }).catch(error => {
                    this.error_message= error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
            },
            editHandler(item) {
                this.inputType = 'Ubah';
                this.editId = item.id;           
                this.form.service_mobil = item.service_mobil;
                this.form.jumlah_mobil = item.jumlah_mobil;
                this.form.tanggal = item.tanggal;
                this.form.tools = item.tools;
                this.dialog= true;
            },
            deleteHandler(id) {
                this.deleteId = id;
                this.dialogConfirm = true;
            },
            close() {
                this.dialog = false;
                this.inputType = 'Tambah';
                this.dialogConfirm = false;
                this.readData();
            },
            cancel () {
                this.resetForm();
                this.readData();
                this.dialog = false;
                this.dialogConfirm = false;
                this.inputType ='Tambah';
            },
            resetForm() {    
                this.form = {
                    service_mobil: "",
                    jumlah_mobil: "",
                    tanggal: "",
                    tools: ""
                };
            },
        },
        computed: {
            formTitle() {
                return this.inputType;
            },
        },

        mounted () {
            this.readData();
        },
    };
</script>