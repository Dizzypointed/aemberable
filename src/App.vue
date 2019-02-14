<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
html {
  font-size: 16px;
  @media (max-width: 375px) {
    font-size: 12px;
  }
}
body {
  margin: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
li {
  list-style: none;
}
ul {
  padding: 0;
}
</style>
