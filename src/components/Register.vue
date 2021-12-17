<template>
  <main> 
    <v-container fluid fill-height class="posisinya">
      <v-layout flex align-center justify-center>
        <v-flex xs12 sm6 elevation-6>
          <v-toolbar class="light-blue lighten-1">
            <v-toolbar-title class="white--text">
              <h1>Form Register</h1>
            </v-toolbar-title>
          </v-toolbar>

          <v-card>
            <v-card-text>
              <div>
                <v-form v-model="valid" ref="form">
                  <v-card elevation="0" style="padding: 10px">
                  <v-text-field label="Username" v-model="username" :rules="usernameRules" required></v-text-field>
                    <v-text-field label="Nama" v-model="nama" :rules="nameRules" required></v-text-field>
                    <v-text-field label="Telepon" v-model="telp" :rules="teleponRules" required></v-text-field>
                    <v-text-field label="E-mail" v-model="email" :rules="emailRules" required></v-text-field>
                    <v-text-field label="Password" v-model="password" :rules="passwordRules" required type="password"></v-text-field>
                  </v-card>
                  
                  <v-layout justify-space-between style="margin-top: 20px">
                    <v-card elevation="5" loading shaped>
                      <v-btn @click="register" class="blue darken-4 white--text">Login</v-btn>
                    </v-card>

                    <v-card elevation="0">
                      <v-btn @click="go" class="green darken-3 white--text mr-3">Go</v-btn>
                      <v-btn @click="clear" class="red darken-3 white--text">Clear</v-btn>
                    </v-card>
                  </v-layout>
                </v-form>
              </div>
            </v-card-text>
          </v-card>
          <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{ error_message }}</v-snackbar>
        </v-flex>
      </v-layout>
    </v-container>
  </main>
</template>

<style>
  @import url("https://fonts.googleapis.com/css?family=Questrial");
  .white--text{
    font-family: "Questrial";
  }

  .posisinya{
    position: absolute;
    top: 20px;
    left: 0;
    right: 0;
  }
</style>

<script>
  export default{
    name: "Register",
    data(){
      return{
        load:false,
        snackbar: false,
        error_message: '',
        color: '',
        valid: false,
        username:'',
        nama:'',
        telp:'',
        email: '',
        password: '',

        usernameRules:[
          (v) => !!v || 'Username tidak boleh kosong !',
        ],

        nameRules:[
          (v) => !!v || 'Nama tidak boleh kosong !',
        ],

        teleponRules:[
          (v) => !!v || 'Telepon tidak boleh kosong !',
        ],

        emailRules:[
          (v) => !!v || 'Email tidak boleh kosong !',
        ],

        passwordRules:[
          (v) => !!v || 'Password tidak boleh kosong !',
        ]
      };
    },
    
    methods:{
      go()
      {
        if(this.$refs.form.validate())
        {
          this.load = true;
          this.$http.post (this.$api + '/register', 
          {
            username: this.username,
            nama: this.nama,
            telp: this.telp,
            email: this.email,
            password: this.password
          })
          .then(response => 
          {
            this.error_message = response.data.message;
            this.color = "green";
            this.snackbar = true;
            this.load = false;
            this.clear();
            this.$router.push({
              name: 'Login',
            });
          })
          .catch(error => 
          {
            this.error_message = error.response.data.message;
            this.color = "red";
            this.snackbar = true;
            this.load = false;
          })
        }
      },
      register()
      {
        this.$router.push({
          name: 'Login', 
        });
      },

      clear()
      {
        this.$refs.form.reset()
      }
    },
  };
</script>