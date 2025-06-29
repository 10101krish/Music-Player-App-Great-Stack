let ncsTracks = []; // Declare an array to hold the JSON data

async function loadTracks() {
    const res = await fetch('./ncs_music.json');
    const data = await res.json();
    ncsTracks = data;
}

export async function getTracks() {
    if (ncsTracks.length == 0)
        await loadTracks();
    return ncsTracks;
}

