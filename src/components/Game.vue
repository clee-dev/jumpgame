<template>
    <div class="game">
        <Player />
        <Level />
    </div>
</template>

<script>
import Player from "./Player.vue";
import Level from './Level.vue';

export default {
    components: {
        Player,
        Level,
    },
    // keyword to be called automatically by Vue
    // when component is mounted
    // usually the default hook when the component is 'ready'
    // https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram
    mounted() {
        this.$store.dispatch('init');
    },
}
</script>

<style scoped>
.game {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: cornflowerblue;
    overflow: hidden;
}
</style>
