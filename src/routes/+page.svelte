<script>
	let informations = $state([]);

	let socialMediaEntries = $derived(
		[
			...new Set(
			  informations.flatMap(information =>
			    information.accounts.map(account => account.socialMedia)
			  )
			)
		]
	);

	let nameEntries = $state([]);

	let name = $state('');
	let socialMedia = $state('');
	let userName = $state('');

	const defaultSocialMedia = 'Select Account If Added';
	
	let inputText = $state('');
	let inputSocialMedia = $state(defaultSocialMedia);
	let outputText = $state('');
	let outputSocialMedia = $state(defaultSocialMedia);

	$effect(() => {
		const localStorageInformations = JSON.parse(localStorage.getItem('informations'));
		if (localStorageInformations.length) {
			informations = localStorageInformations;
		}
	});

	let entryIndex = - 1;

	const addEntry = (event) => {
		event.preventDefault();
		
		if (name && socialMedia && userName) {
			entryIndex++;

			name = name.trim();
			socialMedia = socialMedia.trim();
			userName = userName.trim();

			let flag = true;
		
			for (let i = 0; i < informations.length; i++) {
				if (informations[i].name === name) {
					let innerFlag = true;
					for (let j = 0; j < informations[i].accounts.length; j++) {
						if (informations[i].accounts[j].socialMedia === socialMedia) {
							innerFlag = false;
							alert(`${name} has ${socialMedia} account already!`);
						}
					}

					if (innerFlag) {
						informations[i].accounts.push({
							socialMedia,
							userName
						});
					}

					flag = false;
				}
			}

			if (flag) {
				informations.push({
					name,
					accounts: [
						{
							socialMedia,
							userName
						}
					]
				});
			}

			if (entryIndex === 0) {
				inputSocialMedia = socialMedia;
				outputSocialMedia = socialMedia;
			}

			name = '';
			socialMedia = '';
			userName = '';
		}
		else {
			alert('empty!');
		}
	};

	const convert = () => {
		const space = ' ';
		nameEntries = [];
		outputText = '';
		
		if (inputText) {
			for (let i = 0; i < inputText.split(space).length; i++) {
				let outerFlag = true;
				const outerWord = inputText.split(space)[i];
				outputText += outerWord + space;
				for (let j = 0; j < informations.length; j++) {
					const outerInformation = informations[j];
					for (let k = 0; k < outerInformation.accounts.length; k++) {
						const outerAccount = outerInformation.accounts[k];
						if (outerWord[0] === '@') {
							if (outerAccount.userName === outerWord && outerAccount.socialMedia === inputSocialMedia) {
								outerFlag = false;
								let outputTextDuplicate = outputText;
								outputText = '';
								for (let l = 0; l < outputTextDuplicate.split(space).length - 2; l++) {
									const outputTextDuplicateWord = outputTextDuplicate.split(space)[l];
									outputText += outputTextDuplicateWord + space;
								}
								if (nameEntries.indexOf(outerInformation.name) === - 1) {
									nameEntries.push(outerInformation.name);
								}
								loop: for (let l = 0; l < inputText.split(space).length; l++) {
									let innerFlag = true;
									for (let m = 0; m < informations.length; m++) {
										const information = informations[m];
										for (let n = 0; n < information.accounts.length; n++) {
											const account = information.accounts[n];
											// same entry
											if (information.name === outerInformation.name && account.socialMedia === outputSocialMedia) {
												innerFlag = false;
												outputText += `<span class='text-[red] font-bold'>${account.userName}</span>${space}`;
												break loop;
											}
										}
									}
									if (innerFlag) {
										alert(`No ${outputSocialMedia} account found for ${outerInformation.name}!`);
										break loop;
									}
								}
							}
						}
					}
				}
				if (outerWord[0] === '@' && outerFlag) {
					alert(`No ${inputSocialMedia} account with this username found: ${outerWord}!`);
				}
			}
			outputText = outputText.substring(0, outputText.lastIndexOf(space));
		}
		else {
			alert('empty!');
		}
	};

	const exportInformations = () => {
		localStorage.setItem('informations', JSON.stringify(informations));

		const element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(informations)));
		element.setAttribute('download', Date.now());
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	};

	const importInformations = (event) => {
		const file = event.target.files[0];
		const fileName = file.name;
		const fileFormat = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length);
		if (fileFormat === 'txt') {
			const reader = new FileReader();
			reader.onload = () => {
				const result = reader.result;
				informations = JSON.parse(result);
			};
			reader.readAsText(file);
			event.target.value = '';
		}
		else {
			alert('Wrong format! Only txt files are allowed!');
		}
	};

	const deleteEntries = () => {
		if (confirm('Delete all accounts?')) {
			informations = [];
		}
	};

	const alertDuplicates = (informationIndex, accountIndex, event) => {
		const newSocialMedia = informations[informationIndex].accounts[accountIndex].socialMedia.trim();
		
		let flag = true;
		const accounts = informations[informationIndex].accounts;
		for (let i = 0; i < accounts.length; i++) {
			const oldSocialMedia = accounts[i].socialMedia;
			if (oldSocialMedia === newSocialMedia && i !== accountIndex) {
				alert(`${oldSocialMedia ? oldSocialMedia : 'empty'} account already added for ${informations[informationIndex].name}!`);
				event.target.classList.remove('bg-lime-500');
				event.target.classList.add('bg-[red]');
				flag = false;
			}
		}
		
		if (flag) {
			// ul tag
			for (let i = 0; i < event.target.parentElement.parentElement.parentElement.children.length; i++) {
				event.target.parentElement.parentElement.parentElement.children[i].children[0].children[0].classList.remove('bg-[red]', 'bg-[orangered]');
				event.target.parentElement.parentElement.parentElement.children[i].children[0].children[0].classList.add('bg-lime-500');
			}
		}
		
		if (!newSocialMedia) {
			alert('empty!');
			event.target.classList.remove('bg-lime-500');
			event.target.classList.add('bg-[orangered]');
		}
	};
</script>

<svelte:head>
	<title>Social Converter</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="xl:max-w-[80rem] mx-auto flex flex-col xl:gap-3 xl:py-3 h-screen">
	<header>
		<form class="flex flex-col xl:gap-3" onsubmit={ (event) => addEntry(event) }>
			<div class="flex h-12 xl:gap-3">
				<input type="text" placeholder="Give the account a name (e.g., Sina)" class="flex-1 focus:outline-none bg-stone-100 focus:bg-white transition-colors duration-[250ms] xl:px-3 tracking-wider placeholder:text-gray-500 border border-gray-400 focus:border-black rounded" bind:value={name}>
				<input type="text" placeholder="Social media (e.g., Instagram)" class="flex-1 focus:outline-none bg-stone-100 focus:bg-white transition-colors duration-[250ms] xl:px-3 tracking-wider placeholder:text-gray-500 border border-gray-400 focus:border-black rounded" bind:value={socialMedia}>
				<input type="text" placeholder="@username (e.g., @sinaGST)" class="flex-1 focus:outline-none bg-stone-100 focus:bg-white transition-colors duration-[250ms] xl:px-3 tracking-wider placeholder:text-gray-500 border border-gray-400 focus:border-black rounded" bind:value={userName}>
			</div>
			<button type="submit" class="h-12 w-full flex justify-center items-center bg-stone-600 hover:bg-stone-700 transition-colors duration-[250ms] rounded">
				<svg class="w-auto h-1/2 fill-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" color="" viewBox="5 5 14 14"><path d="M0 0h24v24H0z" fill="none"></path><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>
			</button>
		</form>
	</header>

	<main class="flex flex-1 overflow-hidden xl:gap-3">
		<section class="flex flex-col w-1/4 xl:gap-3">
			<div class="flex tracking-widest xl:gap-3">
				<button class="w-1/2 text-white bg-emerald-400 transition-colors duration-[250ms] hover:bg-emerald-500 text-center h-12 rounded flex justify-center xl:gap-2 items-center" onclick={ exportInformations }>
					<svg class="w-auto h-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" color="" viewBox="3 3 18 18"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
					<span>
						Export
					</span>
				</button>
				<label class="w-1/2 text-white bg-emerald-400 transition-colors duration-[250ms] hover:bg-emerald-500 text-center h-12 rounded flex justify-center xl:gap-2 items-center cursor-pointer">
					<input type="file" class="hidden" onchange={ (event) => importInformations(event) }>
					<svg class="w-auto h-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" color="" viewBox="3 3 18 18"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
					<span>
						Import
					</span>
				</label>
			</div>
			<h1 class="tracking-wider text-white bg-green-500 text-center leading-[3rem] rounded">
				Accounts Added
			</h1>
			<div class="flex flex-col flex-1 overflow-auto tracking-widest xl:gap-3">
				{#each informations as information, i}
					<div class="text-white">
						<div class="flex overflow-hidden border-b border-white rounded-tl">
							<div class="flex items-center justify-center w-10 border-r border-white aspect-square shrink-0 bg-lime-400">
								<span class="-rotate-45">
									{i + 1}
								</span>
							</div>
							<input placeholder="Give the account a name (e.g., Sina)" class="sticky top-0 z-10 w-full font-bold bg-lime-500 xl:leading-10 xl:px-3 focus:outline-none placeholder:text-gray-100" bind:value={information.name}>
						</div>
						<ul class="text-xs">
							{#each information.accounts as account, j}
								<li class="flex border-b border-white xl:leading-8">
									<div class="flex flex-1">
										<input placeholder="Social media (e.g., Instagram)" class="w-1/2 transition-colors duration-[250ms] border-r border-white bg-lime-500 xl:px-3 focus:outline-none placeholder:text-gray-100" bind:value={account.socialMedia} onblur={ (event) => alertDuplicates(i, j, event) }>
										<input placeholder="@username (e.g., @sinaGST)" class="w-1/2 border-r border-white bg-lime-500 xl:px-3 focus:outline-none placeholder:text-gray-100" bind:value={account.userName}>
									</div>
									<button class="size-8 flex justify-center items-center bg-lime-500 hover:bg-lime-400 transition-colors duration-[250ms]" onclick={ () => {confirm(`Delete ${information.name}'s ${account.socialMedia} account?`) && informations[i].accounts.splice(j, 1); !informations[i].accounts.length && informations.splice(i, 1);} }>
										<svg class="w-auto h-1/2 fill-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" color="" viewBox="5 3 14 18"><path d="M0 0h24v24H0z" fill="none"></path><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
									</button>
								</li>
							{/each}
						</ul>
						<button class="flex items-center justify-center w-full h-10 transition-colors duration-[250ms] bg-lime-500 hover:bg-lime-400" onclick={ () => {confirm(`Delete all ${informations[i].name} accounts?`) && informations.splice(i, 1);} }>
							<svg class="w-auto h-1/2 fill-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" color="" viewBox="5 3 14 18"><path d="M0 0h24v24H0z" fill="none"></path><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
						</button>
					</div>
					{:else}
						<p class="font-bold leading-[3rem] border border-gray-500 h-full flex justify-center items-center rounded text-gray-500">
							No Accounts Added
						</p>
				{/each}
			</div>
			{#if informations.length}
				<button class="h-12 mt-auto w-full flex xl:gap-2 justify-center items-center bg-red-600 hover:bg-red-700 transition-colors duration-[250ms] rounded text-white tracking-widest" onclick={ deleteEntries }>
					<svg class="w-auto h-1/2 fill-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" color="" viewBox="5 3 14 18"><path d="M0 0h24v24H0z" fill="none"></path><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
					<span>
						Delete All Accounts
					</span>
				</button>
			{/if}
		</section>
		<section class="flex flex-col flex-1 xl:gap-3">
			<div class="flex flex-col flex-1 overflow-hidden border border-gray-400 rounded focus-within:border-black">
				<select class="w-full h-12 tracking-wider text-black bg-slate-300 focus:outline-none xl:px-3" bind:value={inputSocialMedia}>
					<option class="text-[red]">
						{defaultSocialMedia}
					</option>
					{#each socialMediaEntries as socialMediaEntry}
						<option>
							{socialMediaEntry}
						</option>
					{/each}
				</select>
				<textarea class="tracking-widest resize-none bg-slate-100 size-full focus:outline-none xl:p-3 placeholder:text-slate-500 focus:bg-white transition-colors duration-[250ms]" bind:value={inputText} placeholder="Your message!"></textarea>
			</div>
			<button class="h-12 w-full flex justify-center items-center bg-slate-500 hover:bg-slate-600 transition-colors duration-[250ms] rounded" onclick={ convert }>
				<svg class="w-auto h-1/2 fill-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" color="" viewBox="2 1 20 22"><path d="M0 0h24v24H0z" fill="none"></path><path d="M22 18v-2H8V4h2L7 1 4 4h2v2H2v2h4v8c0 1.1.9 2 2 2h8v2h-2l3 3 3-3h-2v-2h4zM10 8h6v6h2V8c0-1.1-.9-2-2-2h-6v2z"></path></svg>
			</button>
			<div class="flex flex-col flex-1 overflow-hidden border border-gray-400 rounded focus-within:border-black">
				<p class="tracking-widest bg-slate-100 size-full xl:p-3">
					{@html outputText}
				</p>
				<select class="w-full h-12 tracking-wider text-black bg-slate-300 focus:outline-none xl:px-3" bind:value={outputSocialMedia}>
					<option class="text-[red]">
						{defaultSocialMedia}
					</option>
					{#each socialMediaEntries as socialMediaEntry}
						<option>
							{socialMediaEntry}
						</option>
					{/each}
				</select>
			</div>
		</section>
		<section class="flex flex-col w-1/4 xl:gap-3">
			<h1 class="tracking-wider text-white bg-orange-600 text-center leading-[3rem] rounded">
				Accounts Mentioned
			</h1>
			<ul class="flex flex-col xl:gap-3">
				{#each nameEntries as nameEntry}
					<li class="tracking-widest text-white bg-orange-400 xl:leading-8 xl:px-3">
						{nameEntry}
					</li>
				{/each}
			</ul>
		</section>
	</main>
</div>