<template>
    <div class="dashboard">

        <v-navigation-drawer v-model="drawer" class="fullheight" width="256" app>
            <v-list-item class = content>
                <v-list-item-content >
                    <v-list-item-title class="title" style="color: #FFFFFF">PW Services</v-list-item-title>
                    <v-list-item-subtitle style="color: #FFFFFF">The One and Only</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>
            <v-list dense nav>
                <v-list-item
                  v-for="item in items"
                  :key="item.title"
                  link
                  tag="router-link"
                  :to="item.to">
                  <v-list-item-content style="color: #000000">
                      <v-list-item-title>{{item.title}}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar app fixed height="67px" color="#01579B">
            <v-app-bar-nav-icon color="#FFFFFF" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <VSpacer />
            <v-toolbar-items class= "quit">
                <v-btn text router @click="logout"><v-icon color="#FFFFFF">mdi-power</v-icon></v-btn>
            </v-toolbar-items>
        </v-app-bar>
        <div class="fullheight pa-5">
            <router-view></router-view>
        </div>
    </div>
</template>

<style>

  .fullheight{
    background:url('https://saintif.com/wp-content/uploads/2020/06/pidato-tentang-kebersihan.png');
  }

 .content{
    background-color: #01579B;
    color: #000000;
  }

  .quit{
      background-color: #01579B;
  }

  .posisinya{
    position: absolute;
    top: 20px;
    left: 0;
    right: 0;
  }
</style>

<script>
export default {
  name: "Dashboard",
  data(){
      return{
          drawer:true,
          items:[
              { title: "Profile", to: '/profile'},
              { title: 'Home Services', to: '/services'},
              { title: 'Car Services', to: '/carservices'},
              { title: 'Personal Services', to: '/personalservices'},
          ],
      };
  },
  methods: {
      logout() {
        localStorage.clear();
        this.$router.push({
            name: 'Login',
        });
      },
  }, 
};
</script>
<style scoped>
    .fullheight{
        min-height: 100vh !important;
    }
    .router{
        text-decoration: none;
        color: black;
    }
</style>