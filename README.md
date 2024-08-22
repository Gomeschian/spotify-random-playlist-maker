# Spotify Random Track Playlist Maker

## Overview
Creates or updates an eclectic Spotify playlist called "Random Tracks from All of Spotify" by trying random-ish search queries per the Spotify Web API's search endpoint ([Spotify API Search Documentation](https://developer.spotify.com/documentation/web-api/reference/search)).

## How to run
1. Download or clone the main branch.
2. Sign up for a Spotify Developer account at [https://developer.spotify.com/](https://developer.spotify.com/) and create an app.
3. Replace the `CLIENT_ID` and `REDIRECT_URI` in `index.html` with your own (if you run e.g. live-server (https://www.npmjs.com/package/live-server) on [http://localhost:8080/](http://localhost:8080/) no need to replace the `REDIRECT_URI` as it's set up for that address).

## Process
Searches all of the logged-in user's playlists, fifty playlists at a time, for a playlist called "Random Tracks from All of Spotify" (public or private). If not found, a public playlist with that name will be created.

Random search queries will be generated and searched, and valid results will be checked against the selected exclusions and for duplication. Once a batch of one hundred tracks to be added has been found (or fewer if the user selected a smaller number of tracks to get), the batch is pushed to the playlist on Spotify. This repeats until the total number of tracks desired has been pushed.

After pushing, the list of added songs' URIs will be added to local storage and excluded during future searches (with local storage of 5 MB, about 62,500 URIs should be storeable).

## Methodology
Each search is randomly one of three types:
1. By year: a random year between 1860 (year of the oldest sound recording that's playable - https://www.firstsounds.org/sounds/scott.php) and the current year.
2. By track name AND/OR track first artist name (50-50 chance of using both fields or just one): the query for each will be a random character, from a random UNICODE range (see `lists.js`) representing a particular character set (e.g., Latin script, Cyrillic, emojis), with a 5% chance that the character is selected from among ALL ranges.
3. By year AND either one or both of the fields from 2.

For all types, a random limit and offset of the results will be chosen, and a random result will be chosen from all that returns. When Spotify paginates results, the limit represents the number of results for the page while offset gives the page number of results based on that limit (technically one less than the page number because it starts at 0 offset = first page).

- Limit: 1 to max 50 (Spotify lets it be set to 0, but that would presumably mean no results).
- Offset: 0 to max 1000. There is an 80% chance that the offset will be 0 (i.e., the first page of results), because all else being equal the relevance of results seems to fall off quickly/results become generic a lot in testing. There is then a 15% chance of the offset being 1 (second page of results), and 5% chance of being greater.

These are very arbitrary numbers that can conceivably be improved.

Searches will find anything Spotify considers a track, so possibly noise or spoken word in addition to songs. Podcast episodes and audiobooks as such won't be found, but tracks from audiobooks formatted as albums will. There are optional filters to adjust the kind of results found (see track title exclusions in `lists.js`), but none are absolute and other tracks may marginally be affected:

- Fewer Audiobook Chapters (Default/Recommended): Excludes tracks with titles like "Chapter 1" or "Chapter some-number" in a number of different languages. Could exclude song titles but only if they contain "Chapter" followed immediately by a number.
- Fewer Birthday Song Variations (Default/Recommended): Excludes tracks with "Happy Birthday To so-and-so" in their titles. In testing, recordings of the Birthday Song in different styles and with different people's names seem to come up unusually often.
- Less Classical: Excludes tracks with "Opus" or some variation in their titles. The exclusion list contains a few other catalog systems for specific composers, but they're commented out by default.
- Fewer pre-2000 releases: when searching by year, the range of random years for the query will be restricted to the 21st Century until today (songs released earlier can still be added to the playlist from queries that don't include a year field).
- Fewer pre-1900 releases: like the above, except only the 19th Century will be excluded from queries. Has no additional effect if you also select Fewer pre-2000 releases, won't help or cause any problems.

## Guidelines/Troubleshooting
The page needs to stay open to run, but if you do close it in process the worst that can happen is you'll get fewer songs than you requested, or no songs.

Check the console for progress details.

As noted above, up to 100 songs are searched and added at a time before doing another batch, so the process may partially succeed if interrupted.

If an API limit is hit during running then fewer songs than requested may actually be added - unexplained errors are probably due to hitting API limits (Code 429), check console for details and/or wait a little before trying again.

## Considerations/Future
- All references to track year use Spotify's `release_Date` field, which is actually part of the track's album field and not the track directly (see [search documentation](https://developer.spotify.com/documentation/web-api/reference/search) linked at the top) and in any case may or may not be the year one naturally associates with the track...
- "Random" means Javascript's `Math.random()`.
- The Spotify for Developers landing page at the time of writing says Spotify has 100 million songs (https://developer.spotify.com/) and at most a search can return 50,000 (50,050?) results per query...
- There seems to be some degree of bias toward the user's account/listening profile, which would be due to Spotify's handling of search queries but could potentially be mitigated further.
- Conjecturally, MAYBE, later results/offsets of searches may be irrelevant to the query and default to Spotify recommendations based on the user...like what you get when you make a brand new playlist and Spotify recommends tracks to add. Early manual search results seem to prefer songs the user has saved and/or listened to (recently?), although other things come up as well.
- Adding additional search fields like album or ISRC may or may not improve the quality of results. Year seems the most reliable. Possibly different combinations of two or at most three fields would be good.
- When selecting random characters for the search query fields, it might be better to select the possible range(s) for ALL fields to be used in the particular query, instead of doing a different selection for each. Unclear if mixing and matching e.g., Kanji artist and Georgian track name will produce relevant results.

![sample](/sample.png)
