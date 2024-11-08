<script>
	const informations = $state([]);
	
	let socialMediaEntries = $state([]);
	let capturedSocialMediaEntry = $state('');

	let nameEntries = $state([]);

	let name = $state('');
	let socialMedia = $state('');
	let userName = $state('');

	let inputText = $state('');
	let inputSocialMedia = $state();
	let outputText = $state('');
	let outputSocialMedia = $state();

	let entryIndex = 0;

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
							alert(`${socialMedia} added for ${name}`);
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

			if (socialMediaEntries.indexOf(socialMedia) === - 1) {
				socialMediaEntries.push(socialMedia);
			}

			if (entryIndex === 1) {
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
		
		for (let i = 0; i < inputText.split(space).length; i++) {
			const outerWord = inputText.split(space)[i];
			outputText += outerWord + space;
			for (let j = 0; j < informations.length; j++) {
				const outerInformation = informations[j];
				for (let k = 0; k < outerInformation.accounts.length; k++) {
					const outerAccount = outerInformation.accounts[k];
					if (outerWord[0] === '@' && outerAccount.userName === outerWord && outerAccount.socialMedia === inputSocialMedia) {
						console.log(outputText);
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
							const word = inputText.split(space)[l];
							for (let m = 0; m < informations.length; m++) {
								const information = informations[m];
								for (let n = 0; n < information.accounts.length; n++) {
									const account = information.accounts[n];
									// same entry
									if (information.name === outerInformation.name && account.socialMedia === outputSocialMedia) {
										outputText += account.userName + space;
										break loop;
									}
								}
							}
						}
					}
				}
			}
		}
		outputText = outputText.substring(0, outputText.lastIndexOf(space));
	};

	const captureSocialMediaEntry = (event) => {
		capturedSocialMediaEntry = event.target.value;
	};

	const editSocialMediaEntry = (event) => {
		for (let i = 0; i < socialMediaEntries.length; i++) {
			if (socialMediaEntries[i] === capturedSocialMediaEntry) {
				socialMediaEntries[i] = event.target.value;
			}
		}
	};

	const submitEditedSocialMediaEntry = (event) => {
		if (event.key === 'Enter') {
			event.target.blur();
		}
	}
</script>

<svelte:head>
	<title>Social Converter</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="xl:max-w-[80rem] mx-auto flex flex-col h-screen">
	<header class="h-24">
		<form class="h-full" onsubmit={ (event) => addEntry(event) }>
			<div class="flex h-1/2">
				<input type="text" placeholder="Give the account a name (e.g., Sina)" class="flex-1 focus:outline-none bg-blue-100 focus:bg-blue-50 transition-colors duration-[250ms] xl:px-4 tracking-wider placeholder:text-gray-500" bind:value={name}>
				<input type="text" placeholder="Social media (e.g., Instagram)" class="flex-1 focus:outline-none bg-blue-100 focus:bg-blue-50 transition-colors duration-[250ms] xl:px-4 tracking-wider placeholder:text-gray-500 border-x border-gray-400" bind:value={socialMedia}>
				<input type="text" placeholder="@username (e.g., @sinaGST)" class="flex-1 focus:outline-none bg-blue-100 focus:bg-blue-50 transition-colors duration-[250ms] xl:px-4 tracking-wider placeholder:text-gray-500" bind:value={userName}>
			</div>
			<button type="submit" class="h-1/2 w-full flex justify-center items-center bg-sky-600 hover:bg-sky-800 transition-colors duration-[250ms]">
				<svg class="w-auto h-1/2 fill-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" color="" viewBox="5 5 14 14"><path d="M0 0h24v24H0z" fill="none"></path><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>
			</button>
		</form>
	</header>

	<main class="flex flex-1 overflow-hidden bg-gray-200">
		<article class="w-1/4 overflow-auto">
			<p class="tracking-wider text-white bg-orange-700 text-center leading-[3rem] xl:px-4 border-b border-white">
				Accounts Added
			</p>
			{#each informations as information, i}
				<div class="tracking-widest text-white">
					{#if information.accounts.length}
						<input placeholder="Give the account a name (e.g., Sina)" class="sticky top-0 w-full bg-orange-600 border-b border-white xl:leading-10 xl:px-4 focus:outline-none placeholder:text-gray-100" bind:value={information.name}>
					{/if}
					<ul class="text-xs">
						{#each information.accounts as account, j}
							<li class="flex border-b border-white xl:leading-8">
								<div class="flex flex-1">
									<input placeholder="Social media (e.g., Instagram)" class="w-1/2 bg-orange-400 border-r border-white xl:px-4 focus:outline-none placeholder:text-gray-100" bind:value={account.socialMedia} onkeydown={ (event) => submitEditedSocialMediaEntry(event) } onblur={ (event) => editSocialMediaEntry(event) } onfocus={ (event) => captureSocialMediaEntry(event) }>
									<input placeholder="@username (e.g., @sinaGST)" class="w-1/2 bg-orange-400 border-r border-white xl:px-4 focus:outline-none placeholder:text-gray-100" bind:value={account.userName}>
								</div>
								<button class="size-8 flex justify-center items-center bg-red-600 hover:bg-red-700 transition-colors duration-[250ms]" onclick={ () => {informations[i].accounts.splice(j, 1); !informations[i].accounts.length && informations.splice(i, 1);} }>
									<svg class="w-auto h-1/2 fill-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" color="" viewBox="5 3 14 18"><path d="M0 0h24v24H0z" fill="none"></path><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
								</button>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</article>
		<div class="flex flex-1">
			<div class="flex flex-col flex-1">
				<section class="flex flex-col flex-1">
					<select class="w-full h-12 tracking-wider text-black bg-yellow-100 focus:outline-none xl:px-4" disabled={!informations.length && true} bind:value={inputSocialMedia}>
						{#each socialMediaEntries as socialMediaEntry}
							<option>
								{socialMediaEntry}
							</option>
							{:else}
								<option>
									No Account Added
								</option>
						{/each}
					</select>
					<textarea class="tracking-wider bg-yellow-200 resize-none size-full focus:outline-none xl:p-4 placeholder:text-gray-500" bind:value={inputText}></textarea>
				</section>
				<button class="h-12 w-full flex justify-center items-center bg-yellow-400 hover:bg-amber-500 transition-colors duration-[250ms]" onclick={ convert }>
					<svg class="w-auto h-1/2 fill-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" color="" viewBox="2 1 20 22"><path d="M0 0h24v24H0z" fill="none"></path><path d="M22 18v-2H8V4h2L7 1 4 4h2v2H2v2h4v8c0 1.1.9 2 2 2h8v2h-2l3 3 3-3h-2v-2h4zM10 8h6v6h2V8c0-1.1-.9-2-2-2h-6v2z"></path></svg>
				</button>
				<section class="flex flex-col flex-1">
					<textarea class="tracking-wider bg-yellow-200 resize-none size-full focus:outline-none xl:p-4 placeholder:text-gray-500" bind:value={outputText}></textarea>
					<select class="w-full h-12 tracking-wider text-black bg-yellow-100 focus:outline-none xl:px-4" disabled={!informations.length && true} bind:value={outputSocialMedia}>
						{#each socialMediaEntries as socialMediaEntry}
							<option>
								{socialMediaEntry}
							</option>
							{:else}
								<option>
									No Account Added
								</option>
						{/each}
					</select>
				</section>
			</div>
			<div class="w-1/4">
				<p class="tracking-wider text-white bg-emerald-500 text-center leading-[3rem] xl:px-4 border-b border-white">
					Accounts Mentioned
				</p>
				<ul>
					{#each nameEntries as nameEntry}
						<li class="tracking-widest text-white bg-teal-500 border-b border-white xl:leading-8 xl:px-4">
							{nameEntry}
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</main>
</div>