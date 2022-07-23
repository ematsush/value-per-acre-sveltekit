<script type="ts">
    export let onClick: (...x: any) => void;
</script>

<button on:click={() => onClick()}>
    <slot>
        -
    </slot>
</button>

<style>
	button {
		color: #f06071;
        background-color: #554E4A;
        border: 0px solid #554E4A;
        padding: 1rem 2rem 1rem 2rem;
		margin: 0.5rem;
	}

    button:hover {
        background-color: #443f3b;
        cursor: pointer;
    }
</style>