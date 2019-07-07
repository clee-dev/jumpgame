<template>
    <div class="player" :style="styleObj">
        <div class="text">
            X: {{ position.x }}
            <br/>
            Y: {{ position.y }}
            <br/>
            <br/>
            aX: {{ acceleration.x }}
            <br/>
            aY: {{ acceleration.y }}
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState({
            position: state => state.player.position,
            acceleration: state => state.player.acceleration,
            running: state => state.player.running,
        }),
        styleObj() {
            return {
                left: this.position.x + 'px',
                top: this.position.y + 'px'
            }
        }
    }
}
</script>

<style scoped>
.player {
    background: red;
    width: 100px;
    height: 100px;
    position: absolute;
}
.text {
    color: white;
    font-size: 16px;
}
</style>