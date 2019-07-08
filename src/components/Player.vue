<template>
    <div class="player" :style="styleObj">
        <div class="text">
            X: {{ realPosition.x }}
            <br/>
            Y: {{ realPosition.y }}
            <br/>
            <br/>
            aX: {{ acceleration.x }}
            <br/>
            aY: {{ acceleration.y }}
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
    computed: {
        ...mapState({
            realPosition: state => state.player.position,
            acceleration: state => state.player.acceleration,
            running: state => state.player.running,
        }),
        ...mapGetters({
            position: 'player/renderPosition'
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