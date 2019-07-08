<template>
    <div class="level">
        <Platform v-for="(p,i) in platforms"
            :key="i"
            :platform="p"
        />
    </div>
</template>

<script>
import { mapState } from 'vuex';
import Platform from './Platform.vue';

export default {
    components: {
        Platform,
    },
    computed: {
        ...mapState({
            platforms: state => state.level.platforms,
        }),
    },
}
</script>

<style scoped>

</style>
