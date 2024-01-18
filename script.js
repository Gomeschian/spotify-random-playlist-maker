import {
  ranges,
  bookTitles,
  classicalTitles,
  happyBirthdayTitles,
} from "./lists.js";

const CLIENT_ID = "a34e83c02f6e439a891f4c2f6ba197fe";
const REDIRECT_URI =
  "https://gomeschian.github.io/spotify-random-playlist-maker/";
const SCOPES =
  "user-read-private user-read-email user-library-read playlist-read-private playlist-modify-public playlist-modify-private";

const BATCH_SIZE = 100; // 100 is the max songs that can be added at once per Spotify's Web API
let numberOfSongs;
let minimumSongs;
let maximumSongs;
let earliestReleaseYear = 1860;

const searchDelay = 1;
const existingPlaylistTracks = [];
const addedDuringRuntime = [];
const addedSongs = [];

let allQueriesAndTracks = [];
let songsFound = 0;
const trackTitleStringsToExclude = [];

const addedSongsDiv = document.getElementById("added-songs");
const consoleDiv = document.getElementById("console-div");

const audiobooksCheckbox = document.getElementById("audiobooksCheckbox");

const happyBirthdayCheckbox = document.getElementById("happyBirthdayCheckbox");

const classicalCheckbox = document.getElementById("classicalCheckbox");

const eighteenHundredsCheckbox = document.getElementById(
  "eighteenHundredsCheckbox"
);
const nineteenHundredsCheckbox = document.getElementById(
  "nineteenHundredsCheckbox"
);

const isAuthenticated = () => {
  const params = new URLSearchParams(window.location.hash.substring(1));
  return params.has("access_token");
};

const redirectToAuthorization = () => {
  window.location.href = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=${encodeURIComponent(SCOPES)}&response_type=token`;
};
const getRandomYear = () => {
  const currentYear = new Date().getFullYear();
  return (
    Math.floor(Math.random() * (currentYear - earliestReleaseYear + 1)) +
    earliestReleaseYear
  );
};

//80% chance of offset being 0. 15% chance of offset being 1. 5% chance of offset being greater.
const getRandomOffset = () => {
  const randomNumber = Math.random();
  if (randomNumber < 0.8) {
    return 0;
  } else if (randomNumber < 0.95) {
    return 1;
  } else {
    return Math.floor(Math.random() * 999) + 2;
  }
};

const getRandomLimit = () => {
  return Math.floor(Math.random() * 50) + 1;
};

// Generates a random character from the Unicode character set.
const getRandomCharacter = () => {
  // Define multiple ranges

  // 5% chance to select from all sets
  if (Math.random() < 0.05) {
    // Combine all ranges into a single array
    const allRanges = ranges.reduce((acc, range) => {
      for (let i = range.min; i <= range.max; i++) {
        acc.push(i);
      }
      return acc;
    }, []);

    // Randomly select a character code from all sets
    const randomCodePoint =
      allRanges[Math.floor(Math.random() * allRanges.length)];

    return String.fromCodePoint(randomCodePoint);
  } else {
    // Randomly select a range
    const randomRange = ranges[Math.floor(Math.random() * ranges.length)];

    // Randomly select a character code within the chosen range
    const randomCodePoint =
      Math.floor(Math.random() * (randomRange.max - randomRange.min + 1)) +
      randomRange.min;

    return String.fromCodePoint(randomCodePoint);
  }
};

const searchTrackAndAddToPlaylist = async (accessToken, playlistUrl) => {
  const searchCriteria = generateSearchCriteria(); // Generate search criteria for each search
  const { includeYear, randomFields, randomOffset, randomLimit } =
    searchCriteria;

  let queryString = Object.entries(randomFields)
    .map(([key, value]) => `${key}:${value}`)
    .join(" & ");

  const searchQuery = `q=${queryString}&type=track&limit=${randomLimit}&offset=${randomOffset}`;

  const searchUrl = `https://api.spotify.com/v1/search?${searchQuery}`;

  try {
    await new Promise((resolve) => setTimeout(resolve, searchDelay));

    const response = await fetch(searchUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 429) {
      console.error("Too Many Requests: Please try again later.");
      return; // Stop the function execution
    }
    if (!response.ok) {
      throw new Error(`Invalid search query: ${response.statusText}`);
    }

    const data = await response.json();
    const tracks = data.tracks.items;

    if (tracks.length > 0) {
      const randomIndex = Math.floor(Math.random() * tracks.length);

      const track = tracks[randomIndex];
      const trackUri = track.uri;
      const trackName = track.name;
      const trackAlbum = track.album.name;
      const trackArtist = track.artists[0].name;

      // Log details of the query and the track
      const queryDetails = {
        query: searchQuery,
        track: track,
      };
      allQueriesAndTracks.push(queryDetails);

      // Check if the track should be excluded using regular expressions
      const isExcluded = trackTitleStringsToExclude.some((titleRegex) =>
        titleRegex.test(trackName)
      );

      if (isExcluded) {
        logToConsole(`Track excluded for search: ${searchQuery}. Skipping.`);
        return null;
      }

      // Check if the track has already been added during runtime by URI
      const addedDuringRuntimeURIs = addedDuringRuntime.map(
        (track) => track.uri
      );

      if (addedDuringRuntimeURIs.includes(trackUri)) {
        logToConsole(
          `Duplicate track found for search: ${searchQuery}. Skipping.`
        );

        return null;
      }

      //Check if the track has already been added during runtime by name, album, and artist
      const addedDuringRuntimeNames = addedDuringRuntime.map(
        (track) => track.name
      );
      const addedDuringRuntimeAlbums = addedDuringRuntime.map(
        (track) => track.album
      );
      const addedDuringRuntimeArtists = addedDuringRuntime.map(
        (track) => track.artist.split(", ")[0]
      );

      //Normalize added during runtime fields arrays to lowercase, trimmed
      addedDuringRuntimeNames.map((name) => name.toLowerCase().trim());
      addedDuringRuntimeAlbums.map((album) => album.toLowerCase().trim());
      addedDuringRuntimeArtists.map((artist) => artist.toLowerCase().trim());

      if (
        addedDuringRuntimeNames.includes(trackName.toLowerCase().trim()) &&
        addedDuringRuntimeAlbums.includes(trackAlbum.toLowerCase().trim()) &&
        addedDuringRuntimeArtists.includes(trackArtist.toLowerCase().trim())
      ) {
        logToConsole(
          `Duplicate track found for search: ${searchQuery}. Skipping.`
        );
        return null;
      }
      console.log("Existing playlist tracks:", existingPlaylistTracks);
      console.log("Current searched track:", track);
      console.log("Current searched track URI:", trackUri);

      // Check if the track is already in the playlist by URI
      let trackURInPlaylist = false;

      for (let i = 0; i < existingPlaylistTracks.length; i++) {
        const playlistTrack = existingPlaylistTracks[i];

        if (playlistTrack && playlistTrack.uri === trackUri) {
          trackURInPlaylist = true;
          break;
        }
      }

      if (trackURInPlaylist) {
        logToConsole(
          `Duplicate track (already in playlist) for search: ${searchQuery}. Skipping.`
        );
        return null;
      }

      // Check if the track is already in the playlist by name, album, and artist
      let trackMatchInPlaylist = false;

      for (let i = 0; i < existingPlaylistTracks.length; i++) {
        const playlistTrack = existingPlaylistTracks[i];
        if (
          playlistTrack &&
          playlistTrack.name.toLowerCase().trim() ===
            trackName.toLowerCase().trim() &&
          playlistTrack.album.toLowerCase().trim() ===
            trackAlbum.toLowerCase().trim() &&
          playlistTrack.artist.toLowerCase().trim() ===
            trackArtist.toLowerCase().trim()
        ) {
          trackMatchInPlaylist = true;
          break;
        }
      }

      if (trackMatchInPlaylist) {
        logToConsole(
          `Duplicate Track (already in playlist) for search: ${searchQuery}. Skipping.`
        );
        return null;
      }
      logToConsole(`Track found for search: ${searchQuery}`);

      //Push the track to addedSongs array

      addedSongs.push({
        year: track.album.release_date.slice(0, 4),
        album: track.album.name,
        name: track.name,
        artist: track.artists.map((artist) => artist.name).join(", "),
        uri: trackUri,
      });

      addedDuringRuntime.push(...addedSongs);
      songsFound++;

      copyResultsButton.innerText = `Finding random tracks...${songsFound}/${numberOfSongs}`;
      return trackUri;
    } else {
      const errorMessage = `No track found for search: ${searchQuery}`;
      console.error(errorMessage);
      return null;
    }
  } catch (error) {
    const errorMessage = `Error searching for track: ${error.message}`;
    console.error(errorMessage);
  }
};
const generateSearchCriteria = () => {
  const scenario = getRandomScenario();

  if (scenario === "yearOnly") {
    // Scenario C: Search based only on a random year
    const randomOffset = getRandomOffset();
    const randomLimit = getRandomLimit();

    return {
      includeYear: true,
      randomFields: {
        year: getRandomYear(),
      },
      randomOffset,
      randomLimit,
    };
  } else if (scenario === "yearWithCriteria") {
    // Scenario A: Include a random year plus additional criteria
    const randomFieldsCount = getRandomNumberInRange(1, 2); // Choose additional fields
    const randomFields = ["year", ...getRandomFields(randomFieldsCount)];
    const randomOffset = getRandomOffset();
    const randomLimit = getRandomLimit();

    const fieldsWithValues = randomFields.reduce((acc, field) => {
      if (field === "year") {
        acc[field] = getRandomYear();
      } else {
        acc[field] = getRandomCharacter();
      }
      return acc;
    }, {});

    return {
      includeYear: true,
      randomFields: fieldsWithValues,
      randomOffset,
      randomLimit,
    };
  } else {
    // Scenario B: Exclude the year and choose criteria randomly
    const randomFieldsCount = getRandomNumberInRange(1, 2); // Choose fields without the year
    const randomFields = getRandomFields(randomFieldsCount);
    const randomOffset = getRandomOffset();
    const randomLimit = getRandomLimit();

    const fieldsWithValues = randomFields.reduce((acc, field) => {
      acc[field] = getRandomCharacter();
      return acc;
    }, {});

    return {
      includeYear: false,
      randomFields: fieldsWithValues,
      randomOffset,
      randomLimit,
    };
  }
};

const getRandomScenario = () => {
  const scenarios = ["yearOnly", "yearWithCriteria", "noYearWithCriteria"];
  return scenarios[Math.floor(Math.random() * scenarios.length)];
};

const getRandomNumberInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const getRandomFields = (count) => {
  const fields = ["track", "artist"];
  const randomFields = [];

  for (let i = 0; i < count; i++) {
    const randomField = fields[Math.floor(Math.random() * fields.length)];
    randomFields.push(randomField);
  }

  return randomFields;
};
const addTracksToPlaylist = async (accessToken, playlistId, numberOfSongs) => {
  logToConsole("Adding songs");
  const playlistUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
  while (addedSongs.length < numberOfSongs) {
    const remainingSongs = numberOfSongs - addedSongs.length;
    const tracksToAdd = Math.min(remainingSongs, BATCH_SIZE);
    const trackBatch = [];

    for (let i = 0; i < tracksToAdd; i++) {
      let trackUri;

      // Continue searching until a valid track is found
      while (!trackUri) {
        const randomYear = getRandomYear();
        trackUri = await searchTrackAndAddToPlaylist(accessToken, playlistUrl);
      }

      trackBatch.push(trackUri);
    }

    // Batch addition of tracks to the playlist
    await addBatchToPlaylist(accessToken, playlistUrl, trackBatch);

    // Introduce a delay between batches to avoid rate limits
    await new Promise((resolve) => setTimeout(resolve, searchDelay));
  }

  // Display added songs information
  addedSongsDiv.classList.remove("hidden");
  displayAddedSongsInfo(addedSongs);
};

const addBatchToPlaylist = async (accessToken, playlistUrl, trackBatch) => {
  copyResultsButton.innerText = `Adding tracks to playlist...`;
  try {
    let retryCount = 0;
    const maxRetries = 3; // Replace with the desired maximum number of retries

    while (retryCount < maxRetries) {
      const addResponse = await fetch(playlistUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uris: trackBatch,
        }),
      });

      if (addResponse.ok) {
        console.log(
          `${trackBatch.length} tracks added to the playlist successfully`
        );
        return; // Exit the function if successful
      } else {
        const errorMessage = `Error adding batch to the playlist: ${addResponse.statusText}`;
        console.error(errorMessage);

        // Increment the retry count and introduce a delay before the next retry
        retryCount++;
        await new Promise((resolve) => setTimeout(resolve, searchDelay * 2));
      }
    }

    console.error(`Max retries exceeded. Failed to add batch to the playlist`);
    // Run an alert or handle the failure case if maximum retries exceeded
  } catch (error) {
    const errorMessage = `Error adding batch to the playlist: ${error.message}`;
    console.error(errorMessage);
    // Run an alert or handle the failure case if an error occurs
  }
};
const displayAddedSongsInfo = (addedSongs) => {
  addedSongsDiv.innerHTML += `<p><strong>Added Songs:</strong></p>`;

  addedSongs.forEach((song, index) => {
    const songNumber = index + 1;
    addedSongsDiv.innerHTML += `<p>${songNumber}. ${song.artist} - ${song.name} | ${song.album}, ${song.year}  (${song.uri})</p>`;
  });

  // Scroll to the bottom to show the latest added songs
  addedSongsDiv.scrollTop = addedSongsDiv.scrollHeight;
};

const getPlaylistTracks = async (accessToken, playlistTracksUrl) => {
  const tracksPerPage = 100; // Spotify API returns up to 100 tracks per request
  copyResultsButton.innerText = `Reading playlist tracks...`;
  logToConsole("Reading playlist tracks...");
  try {
    let offset = 0;
    let hasNextPage = true;

    while (hasNextPage) {
      const response = await fetch(
        `${playlistTracksUrl}?offset=${offset}&limit=${tracksPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error fetching playlist tracks: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      const currentTracks = data.items.map((item) => ({
        name: item.track.name,
        album: item.track.album.name,
        artist: item.track.artists[0].name,
        uri: item.track.uri,
      }));
      if (currentTracks.length > 0) {
        existingPlaylistTracks.push(...currentTracks);
        offset += tracksPerPage;
      } else {
        hasNextPage = false;
      }
    }

    console.log("Existing Playlist Tracks:", existingPlaylistTracks);

    return existingPlaylistTracks;
  } catch (error) {
    console.error("Error fetching existing playlist tracks:", error);
    throw error;
  }
};

const searchPlaylist = async (accessToken, playlistName) => {
  let offset = 0;
  let playlist = null;
  logToConsole("Getting playlist...");
  try {
    while (!playlist) {
      const searchUrl = `https://api.spotify.com/v1/me/playlists?limit=50&offset=${offset}`;

      logToConsole(`Searching for playlists at offset ${offset}`);
      const response = await fetch(searchUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("Received response:", response);

      if (!response.ok) {
        throw new Error(
          "Error fetching playlists: " +
            response.status +
            " " +
            response.statusText
        );
      }

      const data = await response.json();
      console.log("Received JSON data:", data);

      // Add this line to log the playlists found
      console.log("Playlists found:", data.items);

      playlist = data.items.find((item) => item.name === playlistName);

      if (!playlist && data.next) {
        offset += 50;
        await new Promise((resolve) => setTimeout(resolve, searchDelay / 2));
      } else if (!playlist) {
        // If playlist is still not found and there are no more results
        playlist = await createPlaylist(accessToken, playlistName);
        logToConsole("Playlist not found, creating a new one.");
      } else {
        break;
      }
    }

    if (playlist) {
      // Fetch and store the playlist tracks once
      console.log("Found playlist:", playlist);
      await getPlaylistTracks(accessToken, playlist.tracks.href);
    }

    return playlist;
  } catch (error) {
    console.error("Error searching playlist:", error);
    alert("An error occurred while searching for the playlist: " + error);
    logToConsole("An error occurred while searching for the playlist");

    throw error;
  }
};

const createPlaylist = async (accessToken) => {
  const createPlaylistUrl = "https://api.spotify.com/v1/me/playlists";

  const response = await fetch(createPlaylistUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Random Songs from All of Spotify",
      public: true,
    }),
  });

  const data = await response.json();
  return data;
};

//Main script
const createPlaylistAndAddTracks = async () => {
  if (!isAuthenticated()) {
    redirectToAuthorization();
    return;
  }

  //Set number of songs to get
  const numberOfSongsBox = document.getElementById("numberOfSongsBox");
  numberOfSongs = parseInt(numberOfSongsBox.value);
  minimumSongs = parseInt(numberOfSongsBox.min);
  maximumSongs = parseInt(numberOfSongsBox.max);

  //Run alert and exit if number of songs desired is not within the allowed range
  if (numberOfSongs < minimumSongs || numberOfSongs > maximumSongs) {
    alert(
      "Please choose a number of songs between " +
        minimumSongs +
        " and " +
        maximumSongs
    );
    return;
  }

  const params = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = params.get("access_token");

  //clear existing track tracking arrays
  existingPlaylistTracks.splice(0, existingPlaylistTracks.length);
  addedDuringRuntime.splice(0, addedDuringRuntime.length);
  addedSongs.splice(0, addedSongs.length);

  document.getElementById("createPlaylistAndAddTracksButton").disabled = true;

  // Disable the boxes
  numberOfSongsBox.disabled = true;
  audiobooksCheckbox.disabled = true;
  happyBirthdayCheckbox.disabled = true;
  classicalCheckbox.disabled = true;
  eighteenHundredsCheckbox.disabled = true;
  nineteenHundredsCheckbox.disabled = true;

  await compileExclusions();

  songsFound = 0;
  const copyResultsButton = document.getElementById("copyResultsButton");
  copyResultsButton.innerText = "Finding/creating playlist...";

  try {
    const playlist = await searchPlaylist(
      accessToken,
      "Random Songs from All of Spotify"
    );
    const playlistId = playlist
      ? playlist.id
      : (await createPlaylist(accessToken)).id;

    await addTracksToPlaylist(accessToken, playlistId, numberOfSongs);

    // Success: Update HTML elements
    document.getElementById("copyResultsButton").innerText =
      "Results (click to copy to clipboard)";
  } catch (error) {
    console.error("An error occurred:", error);
    alert("An error occurred: " + error.message);

    // Error: Update HTML elements
    document.getElementById("copyResultsButton").innerText =
      "Error occurred. Please try again.";
  } finally {
    // Enable the button and boxes
    document.getElementById(
      "createPlaylistAndAddTracksButton"
    ).disabled = false;
    numberOfSongsBox.disabled = false;
    audiobooksCheckbox.disabled = false;
    happyBirthdayCheckbox.disabled = false;
    classicalCheckbox.disabled = false;
    eighteenHundredsCheckbox.disabled = false;
    nineteenHundredsCheckbox.disabled = false;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.getElementById("loginButton");

  if (loginButton) {
    loginButton.addEventListener("click", () => {
      redirectToAuthorization();
    });
  } else {
    console.error('Button with id "loginButton" not found.');
  }
});

const updateLoginStatus = () => {
  const loginButton = document.getElementById("loginButton");
  const buttonsContainer = document.getElementById("buttons-container");

  if (loginButton && buttonsContainer) {
    if (isAuthenticated()) {
      // User is logged in
      loginButton.innerText = "Logged In";
      loginButton.disabled = true; // Optionally disable the button
      buttonsContainer.classList.remove("hidden");
    } else {
      // User is not logged in
      loginButton.innerText = "Log In to Spotify";
      loginButton.disabled = false;
      buttonsContainer.classList.add("hidden");
    }
  }
};

updateLoginStatus();

const button = document.getElementById("createPlaylistAndAddTracksButton");
if (button) {
  button.addEventListener("click", createPlaylistAndAddTracks);
} else {
  console.error('Button with id "createPlaylistAndAddTracksButton" not found.');
}

//See which checkboxes are checked and update exclusions accordingly
const compileExclusions = () => {
  if (eighteenHundredsCheckbox.checked) {
    earliestReleaseYear = 1900;
  }
  if (nineteenHundredsCheckbox.checked) {
    earliestReleaseYear = 2000;
  }
  if (audiobooksCheckbox.checked) {
    const audiobookPatterns = bookTitles.map((title) => new RegExp(title, "i"));
    trackTitleStringsToExclude.push(...audiobookPatterns);
  }
  if (happyBirthdayCheckbox.checked) {
    const happyBirthdayPatterns = happyBirthdayTitles.map(
      (title) => new RegExp(title, "i")
    );
    trackTitleStringsToExclude.push(...happyBirthdayPatterns);
  }
  if (classicalCheckbox.checked) {
    const classicalPatterns = classicalTitles.map(
      (title) => new RegExp(title, "i")
    );
    trackTitleStringsToExclude.push(...classicalPatterns);
  }
  return;
};

const logToConsole = (message) => {
  console.log(message); // Log to the browser console
  consoleDiv.innerHTML += `<p>${message}</p>`;
};
const logAllQueriesAndTracks = () => {
  console.log("All Queries and Tracks:");

  // Convert allQueriesAndTracks to JSON format
  const jsonFormat = JSON.stringify(allQueriesAndTracks, null, 2);
};
// Copy results to clipboard when the button is clicked
const copyResultsButton = document.getElementById("copyResultsButton");
copyResultsButton.addEventListener("click", () => {
  const addedSongsDiv = document.getElementById("added-songs");
  const textToCopy = addedSongsDiv.innerText;

  const tempTextarea = document.createElement("textarea");
  tempTextarea.value = textToCopy;
  document.body.appendChild(tempTextarea);
  tempTextarea.select();
  document.execCommand("copy");
  document.body.removeChild(tempTextarea);
});
