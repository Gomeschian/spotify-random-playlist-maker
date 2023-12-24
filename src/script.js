const clientId = "889e212caa4f452bac0b1374e663afdf";
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

if (!code) {
    redirectToAuthCodeFlow(clientId);
} else {
    getAccessToken(clientId, code)
        .then(async (accessToken) => {
            const profile = await fetchProfile(accessToken);
            populateUI(profile);
            await shuffleUserQueue(accessToken);
        })
        .catch((error) => console.error("Error getting access token:", error));
}

export async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://localhost:5173/callback");
    params.append("scope", "user-read-private user-read-email playlist-read-private user-read-playback-state user-modify-playback-state");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length) {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

export async function getAccessToken(clientId, code) {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://localhost:5173/callback");
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
    });

    const { access_token } = await result.json();
    return access_token;
}

export async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });

    return await result.json();
}

export async function shuffleUserQueue(accessToken) {
    const deviceId = await getDeviceId(accessToken);

    if (deviceId) {
        const currentQueue = await fetchUserQueue(accessToken, deviceId);
        fisherYatesShuffle(currentQueue);
        await replaceUserQueue(accessToken, deviceId, currentQueue);

        console.log("Queue shuffled successfully!");
    } else {
        console.error("No active devices found. Please start playback on a device first.");
    }
}

async function fetchUserQueue(accessToken, deviceId) {
    const result = await fetch(`https://api.spotify.com/v1/me/player/queue?device_id=${deviceId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    const queue = await result.json();
    return queue.tracks.map((track) => track.uri);
}

async function replaceUserQueue(accessToken, deviceId, newQueue) {
    await fetch(`https://api.spotify.com/v1/me/player/queue?device_id=${deviceId}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris: newQueue }),
    });
}

function fisherYatesShuffle(arr) {
    let n = arr.length;
    for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

async function getDeviceId(accessToken) {
    const result = await fetch("https://api.spotify.com/v1/me/player/devices", {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    const devices = await result.json();
    const activeDevice = devices.devices.find((device) => device.is_active);

    return activeDevice ? activeDevice.id : null;
}

export function populateUI(profile) {
    document.getElementById("displayName").innerText = profile.display_name;
    if (profile.images[0]) {
        const profileImage = new Image(200, 200);
        profileImage.src = profile.images[0].url;
        document.getElementById("avatar").appendChild(profileImage);
    }
    document.getElementById("id").innerText = profile.id;
    document.getElementById("email").innerText = profile.email;
    document.getElementById("uri").innerText = profile.uri;
    document.getElementById("uri").setAttribute("href", profile.external_urls.spotify);
    document.getElementById("url").innerText = profile.href;
    document.getElementById("url").setAttribute("href", profile.href);
    document.getElementById("imgUrl").innerText = profile.images[0]?.url ?? "(no profile image)";
}
