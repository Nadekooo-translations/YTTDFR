<script setup lang="ts">
import { reactive, watch } from 'vue';
import { getRawSave, readSaveData, readSaveIndex, writeSaveIndex } from './SaveUtils';

const index = reactive(readSaveIndex());
const editing = reactive<{ index: null | number }>({ index: null });
const titleInput = reactive<{ value: null | HTMLInputElement }>({ value: null });

watch(titleInput, (newValue) => {
	newValue.value?.focus();
});

watch(index, (newValue) => {
	writeSaveIndex(newValue);
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
	alert('TODO'); // TODO
};

const uploadSave = () => {
	alert('TODO'); // TODO
}
</script>

<template>
	<h1>
		Sauvegardes

		<button class="upload" @click="uploadSave()">
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
				<div class="title-wrapper" @click="editing.index = key">
					<Transition>
						<input
							type="text"
							v-model="save.title"
							v-if="editing.index === key"
							:ref="(v) => titleInput.value = v as HTMLInputElement"
							@keydown="(e) => { if (['Escape', 'Enter'].includes(e.key)) { editing.index = null } }"
							@blur="editing.index = null">
						<span v-else>{{ save.title }}</span>
					</Transition>
				</div>
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

// FIXME
// .v-enter-active,
// .v-leave-active {
// 	transition: opacity 0.2s ease;
// }

// .v-enter-from,
// .v-leave-to {
// 	opacity: 0;
// }

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
		width: 9ch;
	}

	.timestamp {
		width: 24ch;
	}

	.title-wrapper {
		width: 15ch;
		height: 1em;
		padding: 2px;

		input,
		span {
			position: relative;
			font-size: inherit;
			font-style: inherit;
			font-weight: inherit;
			border: 0;
			padding: 2px;
			margin: 0;
			width: 15ch;
			height: 1em
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
		padding-bottom: 2em;
	}

	&.delete {
		color: $red;
	}
}
</style>
