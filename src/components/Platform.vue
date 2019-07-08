<template>
    <div
        class="platform"
        :style="styleObj"
    />
</template>

<script>
import { mapState } from 'vuex';

export default {
    props: ['platform'],
    computed: {
        styleObj() {
            return {
                left: this.platform.position.x + 'px',
                top: this.platform.position.y + this.cameraOffset + 'px',
                width: this.platform.width + 'px',
            }
        },
        ...mapState({
            cameraOffset: state => state.camera.y,
        }),
    }
}
</script>

<style scoped>
.platform {
    background: blue;
    min-height: 50px;
    position: absolute;
}
</style>
