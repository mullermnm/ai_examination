<template>
  <canvas ref="canvas" class="rive-avatar"></canvas>
</template>

<script setup>
    import { ref, onMounted, onBeforeUnmount } from "vue";
    import { Rive, StateMachineInput } from "@rive-app/canvas";

    const props = defineProps({
        src: { type: String, default: "/avatar.riv" },
        stateMachine: { type: String, default: "State Machine 1" },
        width: { type: Number, default: 300 },
        height: { type: Number, default: 300 }
    });

    const canvas = ref(null);
    let riveInstance = null;
    let followInput = null;
    let lidInput = null;

    onMounted(async () => {
        const res = await fetch(props.src);
        const buffer = await res.arrayBuffer();

        // Create Rive instance
        riveInstance = new Rive({
            buffer,
            canvas: canvas.value,
            autoplay: true,
            stateMachines: props.stateMachine,
            onLoad: () => {
                const inputs = riveInstance.stateMachineInputs(props.stateMachine);

                // Get inputs
                followInput = inputs.find(i => i.name === "follow");
                lidInput = inputs.find(i => i.name === "lid");

                // Set them to true
                if (followInput) followInput.value = true;
                if (lidInput) lidInput.value = true;
            }
        });
    });

    onBeforeUnmount(() => {
        riveInstance?.cleanup();
    });
</script>

<style scoped>
    .rive-avatar {
        min-width: 300px;
        min-height: 300px;
        display: block;
        margin: 0 auto;
        border-radius: 50%;
    }
</style>
