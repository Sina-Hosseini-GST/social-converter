import React, { useState, useEffect, useRef } from 'react'

const App = () => {

  const myRef = useRef([]);

  let [informations, setInformations] = useState([]);

  let socialMediaEntries =
    [
      ...new Set(
        informations.flatMap(information =>
          information.accounts.map(account => account.socialMedia)
        )
      )
    ];

  let [nameEntries, setNameEntries] = useState([]);

  let [name, setName] = useState('');
  let [socialMedia, setSocialMedia] = useState('');
  let [userName, setUserName] = useState('');

  const defaultSocialMedia = 'Select Account If Added';

  let [inputText, setInputText] = useState('');
  let [inputSocialMedia, setInputSocialMedia] = useState(defaultSocialMedia);
  let [outputText, setOutputText] = useState('');
  let [outputSocialMedia, setOutputSocialMedia] = useState(defaultSocialMedia);

  useEffect(() => {
    const localStorageInformations = JSON.parse(localStorage.getItem('informations'));
    if (localStorageInformations.length) {
      setInformations(localStorageInformations)
    }
  }, []);

  let entryIndex = - 1;

  const addEntry = (event) => {
    event.preventDefault();

    if (name && socialMedia && userName) {
      entryIndex++;

      setName(name.trim());
      setSocialMedia(socialMedia.trim());
      setUserName(userName.trim());

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
            const newInformations = informations;

            newInformations[i].accounts.push({
              socialMedia,
              userName
            });

            setInformations(newInformations);
          }

          flag = false;
        }
      }

      if (flag) {
        setInformations(
          [
            ...informations,
            {
              name,
              accounts: [
                {
                  socialMedia,
                  userName
                }
              ]
            }
          ]
        );
      }

      if (entryIndex === 0) {
        setInputSocialMedia(socialMedia)
        setOutputSocialMedia(socialMedia)
      }

      setName('')
      setSocialMedia('')
      setUserName('')
    }
    else {
      alert('empty!');
    }
  };

  const convert = () => {
    const space = ' ';
    let newNameEntries = [];
    let newOutputText = '';
    let flag = true;

    if (inputText) {
      for (let i = 0; i < inputText.split(space).length; i++) {
        let outerFlag = true;
        const outerWord = inputText.split(space)[i];
        newOutputText += outerWord + space;
        for (let j = 0; j < informations.length; j++) {
          const outerInformation = informations[j];          
          for (let k = 0; k < outerInformation.accounts.length; k++) {
            const outerAccount = outerInformation.accounts[k];
            if (outerWord[0] === '@') {
              if (outerAccount.userName === outerWord && outerAccount.socialMedia === inputSocialMedia) {
                outerFlag = false;

                let outputTextDuplicate = newOutputText;
                newOutputText = '';

                for (let l = 0; l < outputTextDuplicate.split(space).length - 2; l++) {
                  newOutputText += outputTextDuplicate.split(space)[l] + space;
                }

                if (newNameEntries.indexOf(outerInformation.name) === -1) {
                  newNameEntries.push(outerInformation.name);
                }

                loop: for (let l = 0; l < inputText.split(space).length; l++) {
                  let innerFlag = true;
                  for (let m = 0; m < informations.length; m++) {
                    const information = informations[m];
                    for (let n = 0; n < information.accounts.length; n++) {
                      const account = information.accounts[n];
                      if (information.name === outerInformation.name && account.socialMedia === outputSocialMedia) {
                        innerFlag = false;
                        newOutputText += `<span class='font-bold underline underline-offset-2'>${account.userName}</span>` + space;
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
          flag = false;
        }
      }

      if (flag) {
        setOutputText(newOutputText.trim());
        setNameEntries(newNameEntries);
      }
      else {
        setOutputText('');
        setNameEntries([]);
      }
    } else {
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
        setInformations(JSON.parse(result))
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
      setInformations([])
    }
  };

  const alertSocialMediaDuplicates = (informationIndex, accountIndex, event) => {
    const socialMediaDuplicate = informations[informationIndex].accounts[accountIndex].socialMedia.trim();

    let flag = true;
    const accounts = informations[informationIndex].accounts;
    for (let i = 0; i < accounts.length; i++) {
      const oldSocialMedia = accounts[i].socialMedia;
      if (oldSocialMedia === socialMediaDuplicate && i !== accountIndex) {
        alert(`${oldSocialMedia ? oldSocialMedia : 'empty'} account already added for ${informations[informationIndex].name}!`);
        event.target.classList.remove('bg-green-200');
        event.target.classList.add('bg-[red]');
        flag = false;
      }
    }

    if (flag) {
      // ul tag
      for (let i = 0; i < event.target.parentElement.parentElement.parentElement.children.length; i++) {
        event.target.parentElement.parentElement.parentElement.children[i].children[0].children[0].classList.remove('bg-[red]', 'bg-[orangered]');
        event.target.parentElement.parentElement.parentElement.children[i].children[0].children[0].classList.add('bg-green-200');
      }
    }

    if (!socialMediaDuplicate) {
      alert('empty!');
      event.target.classList.remove('bg-green-200');
      event.target.classList.add('bg-[orangered]');
    }
  };

  return (
    <>
      <div className="xl:max-w-[80rem] mx-auto flex flex-col xl:gap-3 xl:py-3 h-screen">
        <header>
          <form className="flex flex-col xl:gap-3" onSubmit={(event) => addEntry(event)}>
            <div className="flex h-12 xl:gap-3">
              <input type="text" placeholder="Give the account a name (e.g., Sina)" className="flex-1 focus:outline-none bg-stone-100 focus:bg-white transition-colors duration-[250ms] xl:px-3 tracking-wider placeholder:text-gray-500 border border-gray-400 focus:border-black rounded" onChange={(event) => setName(event.target.value)} value={name} />
              <input type="text" placeholder="Social media (e.g., Instagram)" className="flex-1 focus:outline-none bg-stone-100 focus:bg-white transition-colors duration-[250ms] xl:px-3 tracking-wider placeholder:text-gray-500 border border-gray-400 focus:border-black rounded" onChange={(event) => setSocialMedia(event.target.value)} value={socialMedia} />
              <input type="text" placeholder="@username (e.g., @sinaGST)" className="flex-1 focus:outline-none bg-stone-100 focus:bg-white transition-colors duration-[250ms] xl:px-3 tracking-wider placeholder:text-gray-500 border border-gray-400 focus:border-black rounded" onChange={(event) => setUserName(event.target.value)} value={userName} />
            </div>
            <button type="submit" className="h-12 w-full flex justify-center items-center bg-stone-600 hover:bg-stone-700 transition-colors duration-[250ms] rounded">
              <svg className="w-auto h-1/2 fill-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" color="" viewBox="5 5 14 14"><path d="M0 0h24v24H0z" fill="none"></path><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>
            </button>
          </form>
        </header>

        <main className="flex flex-1 overflow-hidden xl:gap-3">
          <section className="flex flex-col w-1/4 xl:gap-3">
            <div className="flex tracking-widest xl:gap-3">
              <button className="w-1/2 bg-green-600 text-white transition-colors duration-[250ms] hover:bg-green-700 text-center h-12 rounded flex justify-center xl:gap-2 items-center" onClick={exportInformations}>
                <svg className="w-auto h-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" color="" viewBox="3 3 18 18"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                <span>
                  Export
                </span>
              </button>
              <label className="w-1/2 bg-green-600 text-white transition-colors duration-[250ms] hover:bg-green-700 text-center h-12 rounded flex justify-center xl:gap-2 items-center cursor-pointer">
                <input type="file" className="hidden" onChange={(event) => importInformations(event)} />
                <svg className="w-auto h-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" color="" viewBox="3 3 18 18"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                <span>
                  Import
                </span>
              </label>
            </div>
            <h1 className="tracking-wider bg-white border text-black border-black text-center leading-[3rem] rounded">
              Accounts Added
            </h1>
            <div className="flex flex-col flex-1 overflow-auto tracking-widest xl:gap-3">
              {informations.length > 0 ? informations.map((information, i) => (
                <div className="text-black" key={i}>
                  <div className="sticky top-0 flex overflow-hidden border-b border-white rounded-tl">
                    <div className="flex items-center justify-center w-10 font-bold text-white bg-green-400 border-r border-white aspect-square shrink-0">
                      <span className="-rotate-45">
                        {i + 1}
                      </span>
                    </div>
                    <input placeholder="Give the account a name (e.g., Sina)" className="z-10 w-full font-bold bg-green-200 xl:leading-10 xl:px-3 focus:outline-none placeholder:text-gray-100" onChange={(event) => {
                      const newInformations = [...informations];
                      newInformations[i].name = event.target.value;
                      setInformations(newInformations);
                    }
                    } value={information.name} />
                  </div>
                  <ul className="text-xs">
                    {information.accounts.map((account, j) => (
                      <li className="flex border-b border-white xl:leading-8" key={j}>
                        <div className="flex flex-1">
                          <input placeholder="Social media (e.g., Instagram)" className="w-1/2 transition-colors duration-[250ms] border-r border-white bg-green-200 xl:px-3 focus:outline-none placeholder:text-gray-100" onChange={(event) => {
                            const newInformations = [...informations];
                            newInformations[i].accounts[j].socialMedia = event.target.value;
                            setInformations(newInformations);
                          }
                          } value={account.socialMedia} onBlur={(event) => alertSocialMediaDuplicates(i, j, event)} />
                          <input placeholder="@username (e.g., @sinaGST)" className="w-1/2 bg-green-200 border-r border-white xl:px-3 focus:outline-none placeholder:text-gray-100" onChange={(event) => {
                            const newInformations = [...informations];
                            newInformations[i].accounts[j].userName = event.target.value;
                            setInformations(newInformations);
                          }
                          } value={account.userName} />
                        </div>
                        <button className="size-8 flex justify-center items-center bg-green-300 hover:bg-green-400 transition-colors duration-[250ms]" onClick={() => {
                          if (confirm(`Delete ${information.name}'s ${account.socialMedia} account?`)) {
                            const newInformations = [...informations];
                            newInformations[i].accounts.splice(j, 1);
                            if (!newInformations[i].accounts.length) {
                              newInformations.splice(i, 1);
                            }
                            setInformations(newInformations)
                          }
                        }}>
                          <svg className="w-auto h-1/2 fill-gray-900" xmlns="http://www.w3.org/2000/svg" fill="currentColor" color="" viewBox="5 3 14 18"><path d="M0 0h24v24H0z" fill="none"></path><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button className="flex items-center justify-center w-full h-10 transition-colors duration-[250ms] bg-green-300 hover:bg-green-400" onClick={() => {
                    if (confirm(`Delete all ${informations[i].name} accounts?`)) {
                      const newInformations = [...informations];
                      newInformations.splice(i, 1);
                      setInformations(newInformations);
                    }
                  }}>
                    <svg className="w-auto h-1/2 fill-gray-900" xmlns="http://www.w3.org/2000/svg" fill="currentColor" color="" viewBox="5 3 14 18"><path d="M0 0h24v24H0z" fill="none"></path><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
                  </button>
                </div>
              )) : (
                <p className="font-bold leading-[3rem] border border-gray-500 h-full flex justify-center items-center rounded text-gray-500">
                  No Accounts Added
                </p>
              )}
            </div>
            {informations.length > 0 && (
              <button className="h-12 mt-auto w-full flex xl:gap-2 justify-center items-center bg-green-600 text-white hover:bg-green-700 transition-colors duration-[250ms] rounded tracking-widest" onClick={deleteEntries}>
                <svg className="w-auto h-1/2 fill-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" color="" viewBox="5 3 14 18"><path d="M0 0h24v24H0z" fill="none"></path><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
                <span>
                  Delete All Accounts
                </span>
              </button>
            )}
          </section>
          <section className="flex flex-col flex-1 xl:gap-3">
            <div className="flex flex-col flex-1 overflow-hidden border border-gray-400 rounded focus-within:border-black">
              <select className="w-full h-12 tracking-wider text-black bg-sky-300 focus:outline-none xl:px-3" onChange={(event) => {
                setInputSocialMedia(event.target.value)
              }
              } value={inputSocialMedia}>
                <option className="text-[red]">
                  {defaultSocialMedia}
                </option>
                {socialMediaEntries.map((socialMediaEntry, index) => (
                  <option key={index}>
                    {socialMediaEntry}
                  </option>
                ))}
              </select>
              <textarea className="tracking-widest resize-none bg-sky-100 size-full focus:outline-none xl:p-3 placeholder:text-slate-500 focus:bg-white transition-colors duration-[250ms]" onChange={(event) => {
                setInputText(event.target.value)
              }
              } value={inputText} placeholder="Your message!"></textarea>
            </div>
            <button className="h-12 w-full flex justify-center items-center bg-sky-500 hover:bg-sky-600 transition-colors duration-[250ms] rounded" onClick={convert}>
              <svg className="w-auto h-1/2 fill-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" color="" viewBox="2 1 20 22"><path d="M0 0h24v24H0z" fill="none"></path><path d="M22 18v-2H8V4h2L7 1 4 4h2v2H2v2h4v8c0 1.1.9 2 2 2h8v2h-2l3 3 3-3h-2v-2h4zM10 8h6v6h2V8c0-1.1-.9-2-2-2h-6v2z"></path></svg>
            </button>
            <div className="flex flex-col flex-1 overflow-hidden border border-gray-400 rounded focus-within:border-black">
              <p className="tracking-widest bg-sky-100 size-full xl:p-3" dangerouslySetInnerHTML={{__html: outputText}} />
              <select className="w-full h-12 tracking-wider text-black bg-sky-300 focus:outline-none xl:px-3" onChange={(event) => {
                setOutputSocialMedia(event.target.value)
              }} value={outputSocialMedia}>
                <option className="text-[red]">
                  {defaultSocialMedia}
                </option>
                {socialMediaEntries.map((socialMediaEntry, index) => (
                  <option key={index}>
                    {socialMediaEntry}
                  </option>
                ))}
              </select>
            </div>
          </section>
          <section className="flex flex-col w-1/4 xl:gap-3">
            <h1 className="tracking-wider bg-white border text-black border-black text-center leading-[3rem] rounded">
              Accounts Mentioned
            </h1>
            <ul className="flex flex-col xl:gap-3">
              {nameEntries.map((nameEntry, index) => (
                <li key={index} className="tracking-widest text-white bg-green-800 rounded xl:leading-10 xl:px-3">
                  {nameEntry}
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>
    </>
  )
}

export default App
