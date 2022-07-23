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
        padding: 0.25rem 0.5rem 0.25rem 0.5rem;
		margin: 0.5rem;
	}

    button:hover {
        background-color: #443f3b;
        cursor: pointer;
    }
</style>