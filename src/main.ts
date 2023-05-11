import './style.css'

async function getVideo(key: string, address: string) {
  const response = await fetch(`https://aerialview.googleapis.com/v1beta/videos?address=${encodeURIComponent(address)}&key=${key}`);
  return response.json();
}

async function renderVideo(key: string, address: string) {
  const response = await fetch(`https://aerialview.googleapis.com/v1beta/videos:renderVideo?key=${key}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ address: address }),
  });
  return response.json();
}

async function getVideoClickHandler() {
  const apiKeyElem = document.getElementById('apikey')! as HTMLInputElement;
  const addrElem = document.getElementById('address')! as HTMLInputElement;

  const apiKey = apiKeyElem.value;
  const address = addrElem.value;

  const response = await getVideo(apiKey, address);

  if (response.state === 'ACTIVE') {
    document.getElementById('response')!.innerHTML = `
    Video ID: ${response.metadata.videoId}
    Duration: ${response.metadata.duration}
    <table class="table-auto">
      <thead>
      <tr>
        <th>Resource</th>
        <th>Preview</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>IMAGE.landscapeUri</td><td><img src="${response.uris.IMAGE.landscapeUri}"/></td></tr>
      <tr><td>IMAGE.portraitUri</td><td><img src="${response.uris.IMAGE.portraitUri}"/></td></tr>
      <tr><td>MP4_HIGH.landscapeUri</td><td><video src="${response.uris.MP4_HIGH.landscapeUri}" controls/></td></tr>
      <tr><td>MP4_HIGH.portraitUri</td><td><video src="${response.uris.MP4_HIGH.portraitUri}" controls/></td></tr>
      <tr><td>MP4_MEDIUM.landscapeUri</td><td><video src="${response.uris.MP4_MEDIUM.landscapeUri}" controls/></td></tr>
      <tr><td>MP4_MEDIUM.portraitUri</td><td><video src="${response.uris.MP4_MEDIUM.portraitUri}" controls/></td></tr>
      <tr><td>MP4_LOW.landscapeUri</td><td><video src="${response.uris.MP4_LOW.landscapeUri}" controls/></td></tr>
      <tr><td>MP4_LOW.portraitUri</td><td><video src="${response.uris.MP4_LOW.portraitUri}" controls/></td></tr>
    </tbody>
    </table>
    `
  } else if (response.state === 'PROCESSING') {
    document.getElementById('response')!.innerHTML = `Processing Video ID: ${response.metadata.videoId}`;
  } else {
    document.getElementById('response')!.innerHTML = `HTTP ${response.error.code} - ${response.error.status}. ${response.error.message}`;
    if (response.error.code === 404) {
      document.getElementById('renderVideo')?.classList.remove('hidden');
    }
  }
}

async function renderVideoClickHandler() {
  const apiKeyElem = document.getElementById('apikey')! as HTMLInputElement;
  const addrElem = document.getElementById('address')! as HTMLInputElement;

  const apiKey = apiKeyElem.value;
  const address = addrElem.value;

  const response = await renderVideo(apiKey, address);
  if (response.state === 'PROCESSING') {
    document.getElementById('response')!.innerHTML = `Processing Video ID: ${response.metadata.videoId}`;
  } else {
    console.log(response);
  }
}


document.getElementById('getVideo')!.addEventListener('click', getVideoClickHandler);
document.getElementById('renderVideo')!.addEventListener('click', renderVideoClickHandler);
