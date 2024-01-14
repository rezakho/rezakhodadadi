<script lang="ts">
import { defineComponent, type PropType } from 'vue';

export default defineComponent({
    name: 'Index',

    components: {},

    data()
    {
        return {

        };
    }
});
</script>

<template>
    <div id="index">
        <h1>Welcome!</h1>
    </div>
</template>

<style lang="scss" scoped>
#index
{
    padding: 40px;

    h1
    {
        font-family: monospace;
        text-align: center;
    }
}
</style>
