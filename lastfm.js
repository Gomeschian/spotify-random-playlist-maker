const apiKey = "713e12918e4076ec6539e4e4fd550d94";
const username = "charlesel";

export const fetchScrobbles = async (
  page = 1,
  limit = 200,
  allScrobbles = []
) => {
  try {
    const fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - 1); // Last month
    const fromTimestamp = Math.floor(fromDate.getTime() / 1000);

    const response = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&page=${page}&limit=${limit}&from=${fromTimestamp}`
    );
    const data = await response.json();
    console.log("Fetched data:", data);

    if (data.recenttracks) {
      const scrobbles = data.recenttracks.track.map((track) => ({
        artist: track.artist["#text"],
        trackName: track.name,
        album: track.album["#text"],
      }));
      const totalScrobbles = parseInt(data.recenttracks["@attr"].total, 10);

      console.log(
        `Page ${page}: Fetched ${scrobbles.length} scrobbles. Total Scrobbles: ${totalScrobbles}: `
      );
      allScrobbles.push(...scrobbles);

      if (scrobbles.length > 0 && scrobbles.length < totalScrobbles) {
        // Fetch next page
        console.log("Fetching next page...");
        await fetchScrobbles(page + 1, limit, allScrobbles);
      } else {
        console.log("All scrobbles fetched.");
      }
    } else {
      console.error("Error fetching scrobbles:", data);
    }
  } catch (error) {
    console.error("Error fetching scrobbles:", error);
  }
  console.log("AllScrobbles:", allScrobbles);
  return allScrobbles;
};
