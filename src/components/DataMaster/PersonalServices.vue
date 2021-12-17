<template>
    <v-main class="list">
        <h3 class="text-h3" font-weight-medium mb-5>Personal Services</h3>
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
                        <span class="headline">{{ formTitle }} Personal Service</span>
                </v-card-title>
                <v-card-text>
                        <v-container>
                            <v-select v-model="form.personal_service" :items="namaJasa" label="Personal Service" required></v-select>
                            <v-text-field v-model="form.durasi" label="Durasi" required></v-text-field>


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
                            <v-select v-model="form.paket" :items="paket" label="Paket" required></v-select>
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
                    { text: "Personal Service", align: "start", sortable: true, value: "personal_service"},
                    { text: "Durasi", value:'durasi'},
                    { text: "Paket", value:'paket'},
                    { text: "Tanggal", value: 'tanggal'},
                    { text: "Actions", value:'actions'},
                ],
                service: new FormData,
                services: [],
                form: {
                    personal_service: "",
                    durasi: "",
                    tanggal: "",
                    paket: "",
                },
                deleteId:'',
                editId:'',
                namaJasa: ['Pijat', 'Salon', 'Nail Art'],
                paket: ['Normal', 'Ultra', 'Deluxe'],
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
                var url = this.$api + '/personal/' + localStorage.getItem('id');
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
                this.service.append ('personal_service', this.form.personal_service);
                this.service.append ('durasi', this.form.durasi);
                this.service.append ('tanggal', this.form.tanggal);
                this.service.append ('paket', this.form.paket);
                this.service.append ('usersID', localStorage.getItem('id'));
                var url = this.$api + '/personal'
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
                    personal_service : this.form.personal_service,
                    durasi : this.form.durasi,
                    tanggal : this.form.tanggal,
                    paket : this.form.paket
                };
                var url = this.$api + '/personal/' + this.editId;
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
                
                var url =this.$api + '/personal/' + this.deleteId;
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
                this.form.personal_service = item.personal_service;
                this.form.durasi = item.durasi;
                this.form.tanggal = item.tanggal;
                this.form.paket = item.paket;
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
                    personal_service: "",
                    durasi: "",
                    tanggal: "",
                    paket: ""
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