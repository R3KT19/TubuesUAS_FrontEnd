<template>
    <v-main class="list">
        <h3 class="text-h3" font-weight-medium mb-5>Home Services</h3>
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
                        <span class="headline">{{ formTitle }} Home Service</span>
                </v-card-title>
                <v-card-text>
                        <v-container>
                            <v-select v-model="form.nama_jasa" :items="namaJasa" label="Nama Jasa" required></v-select>
                            <v-text-field v-model="form.alamat" label="Alamat" required></v-text-field>


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
                            <v-select v-model="form.jam" :items="jam" label="Jam" required></v-select>
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
                    { text: "Nama Jasa", align: "start", sortable: true, value: "nama_jasa"},
                    { text: "Alamat", value:'alamat'},
                    { text: "Tanggal", value: 'tanggal'},
                    { text: "Jam", value:'jam'},
                    { text: "Actions", value:'actions'},
                ],
                service: new FormData,
                services: [],
                form: {
                    nama_jasa: "",
                    alamat: "",
                    tanggal: "",
                    jam: "",
                },
                deleteId:'',
                editId:'',
                namaJasa: ['Bersihin AC', 'Bersihin Rumah', 'Gardener'],
                jam: ['2', '3', '4', '5', '6'],
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
                var url = this.$api + '/service/' + localStorage.getItem('id');
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
                this.service.append ('nama_jasa', this.form.nama_jasa);
                this.service.append ('alamat', this.form.alamat);
                this.service.append ('tanggal', this.form.tanggal);
                this.service.append ('jam', this.form.jam);
                this.service.append ('usersID', localStorage.getItem('id'));
                var url = this.$api + '/service'
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
                    nama_jasa : this.form.nama_jasa,
                    alamat : this.form.alamat,
                    tanggal : this.form.tanggal,
                    jam : this.form.jam
                };
                var url = this.$api + '/service/' + this.editId;
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
                
                var url =this.$api + '/service/' + this.deleteId;
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
                this.form.nama_jasa = item.nama_jasa;
                this.form.alamat = item.alamat;
                this.form.tanggal = item.tanggal;
                this.form.jam = item.jam;
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
                    nama_jasa: "",
                    alamat: "",
                    tanggal: "",
                    jam: ""
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