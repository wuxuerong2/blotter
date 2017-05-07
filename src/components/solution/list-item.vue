<template>

      <ul>
        <li v-for="item in items">
          name{{item.name}}- phone{{item.phone}}
        </li>
      </ul>

</template>

<script>

  import { Swipeout, SwipeoutItem, SwipeoutButton, XButton } from 'vux'

  export default {
      props:["items","who"],
  }

</script>

<style scoped>


</style>
