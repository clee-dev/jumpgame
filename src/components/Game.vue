<template>
    <div class="game">
        <Player />
        <Level />
        <div class="counter">{{ secondsAlive }}</div>
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
        this.test();
        this.startTime = new Date();
        this.now = this.startTime;
        window.setInterval(function() {
            this.now = new Date();
        }.bind(this), 1000);
    },
    data: () => ({
        startTime: null,
        now: null,
    }),
    computed: {
        secondsAlive() {
            return Math.floor((this.now - this.startTime) / 1000);
        }
    },
    methods: {
        test() {
            const rowGap = 400;
            let platforms = [];
            for (let row = 0; row < 100; row++) {
                let plats = between(2, 4);
                for (let rowPlat = 0; rowPlat < plats; rowPlat++) {
                    platforms.push({
                        position: {
                            x: between(0, 900),
                            y: 0 - row * rowGap + (rowGap * 2)
                        },
                        width: between(100, 300)
                    });
                }
            }

            platforms.push({
                position: {
                    x: 0,
                    y: 700,
                },
                width: 800
            });
            this.$store.commit('level/SET_PLATFORMS', platforms);
        }
    }
}

function between(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
.counter {
    position: absolute;
}
</style>
