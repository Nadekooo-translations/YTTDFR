<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { buildIndexEntry, deleteSaveData, getRawSave, readSaveIndex, writeSaveData, writeSaveIndex } from './SaveUtils';

const index = reactive(readSaveIndex());

watch(index, (newValue) => {
	writeSaveIndex(newValue);
});

const nextFreeSlot = computed(() => {
	for (let i = 1; i <= 102; i++) {
		if (index[i] === null) {
			return i;
		}
	}

	return null;
});

const downloadSave = (idx: number) => {
	const str = getRawSave(idx);

	if (!str) {
		throw new Error(`Tried to download save ${idx}, but it does not exist.`);
	}

	const buf = new Blob([str], {
		type: "application/octet-stream",
	});
	const url = URL.createObjectURL(buf);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = `file${idx}.rpgsave`;
	document.body.appendChild(anchor);
	anchor.click();
	document.body.removeChild(anchor);
};

const deleteSave = (idx: number) => {
	deleteSaveData(idx);
	index[idx] = null;
};

const uploadSave = () => {
	const input = document.createElement("input");
	input.type = "file";

	input.onchange = (e) => {
		const t = e.target as HTMLInputElement;
		const file = t.files![0];

		const reader = new FileReader();
		reader.onloadend = () => {
			if (nextFreeSlot.value) {
				writeSaveData(nextFreeSlot.value, reader.result as string);
				index[nextFreeSlot.value] = buildIndexEntry(nextFreeSlot.value);
			}
		};

		reader.readAsText(file);
	};

	input.click();
};
</script>

<template>
	<h1>
		Sauvegardes

		<button class="upload" :disabled="!nextFreeSlot" @click="uploadSave()">
			<i class="ph-duotone ph-tray-arrow-up"></i>
		</button>
	</h1>
	<div v-if="index.length === 0">
		Aucune sauvegarde présente
	</div>
	<div v-else>
		<template v-for="(save, key) in index">
			<div v-if="save" class="row">
				<span class="number">{{ key }}</span>
				<input
					type="text"
					v-model="save.title">
				<span class="grow"></span>
				<span class="playtime">
					<i class="ph ph-hourglass"></i> {{ save.playtime }}
				</span>
				<span class="timestamp">
					<i class="ph ph-clock"></i> {{ new Date(save.timestamp).toLocaleString() }}
				</span>
				<button class="download" @click="downloadSave(key)">
					<i class="ph-duotone ph-box-arrow-down"></i>
				</button>
				<button class="delete" @click="deleteSave(key)">
					<i class="ph-duotone ph-trash"></i>
				</button>
			</div>
		</template>
	</div>
</template>

<style lang="scss">
@import "@phosphor-icons/web/regular";
@import "@phosphor-icons/web/duotone";
@import "../../styles/_colors.scss";
@import "@fontsource/noto-sans-mono";
@import "@fontsource/open-sans";

.row {
	display: flex;
	gap: 2ch;
	margin: 0 10ch 1em;
	padding: 0.3em 0.5em;
	background-color: $brown;
	border: solid 1px $gold;
	align-items: center;

	.grow {
		flex-grow: 1;
	}

	.number {
		width: 3ch;
	}

	.playtime {
		font-family: 'Noto Sans Mono', sans-serif;
	}

	.timestamp {
		width: 24ch;
		font-family: 'Open Sans', sans-serif;
	}

	input {
		position: relative;
		font-size: inherit;
		font-style: inherit;
		font-weight: inherit;
		color: inherit;
		border: 0;
		padding: 2px;
		margin: 0;
		width: 15ch;
		height: 1em;
		background-color: transparent;

		&:focus {
			color: black;
			background-color: white;
		}
	}
}

button {
	border: 0;
	background: 0;
	font-size: xx-large;
	margin: 0;
	padding: 0;
	cursor: pointer;

	&.download {
		color: $gold;
	}

	&.upload {
		color: $gold;
		margin-bottom: 2em;

		&[disabled] {
			color: $lightGray;
			cursor: not-allowed;
		}
	}

	&.delete {
		color: $red;
	}
}
</style>
