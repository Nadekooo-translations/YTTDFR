<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { buildIndexEntry, deleteSaveData, getRawSave, isValidSaveFile, readSaveIndex, writeSaveData, writeSaveIndex } from './SaveUtils';

const modal = reactive<{text: null | string}>({ text: null });
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
				const raw = reader.result as string;

				if (!isValidSaveFile(raw)) {
					modal.text = "Cette sauvegarde n'a pas l'air valide";
					return;
				}

				writeSaveData(nextFreeSlot.value, raw);
				index[nextFreeSlot.value] = buildIndexEntry(nextFreeSlot.value);
			}
		};

		reader.readAsText(file);
	};

	input.click();
};
</script>

<template>
	<div class="modal" v-if="modal.text" @click="modal.text = null">
		<div class="modal-content">
			<i class="ph-duotone ph-warning modal-icon"></i><br/>
			{{ modal.text }}
		</div>
	</div>
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
				<input type="text" v-model="save.customName">
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

.modal {
	display: flex;
	align-items: center;
	justify-content: center;
	position: fixed;
	z-index: 1;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	overflow: auto;
	background-color: rgba($gray, 0.7);

	.modal-content {
		background-color: $brown;
		border: solid 1px $gold;
  		padding: 2em;
  		width: 20ch;
		animation-name: dialog;
		animation-duration: 0.1s;
		animation-timing-function: linear;

		@keyframes dialog {
			from {
				transform: scaleY(0);
			}

			to {
				transform: scaleY(1);
			}
		}

		.modal-icon {
			font-size: 2em;
			color: $gold;
			text-align: center;
		}
	}
}

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
		width: 24ch;
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
