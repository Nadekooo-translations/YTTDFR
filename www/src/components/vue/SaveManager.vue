<script setup lang="ts">
import { reactive } from 'vue';
import { readSaveData, readSaveIndex } from './SaveUtils';

const saves = reactive(readSaveData());
const index = reactive(readSaveIndex());

</script>

<template>
	<ul>
		<li v-for="(save, key) in index">
			<pre>{{ key }}: {{ JSON.stringify(save, undefined, 4) }}</pre>
		</li>
	</ul>
</template>
