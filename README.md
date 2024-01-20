<h1>Spotify Random Track Playlist Maker</h1>

<h2>Overview</h2> Creates or updates an eclectic Spotify playlist by trying random-ish search queries per the Spotify Web API's search endpoint (https://developer.spotify.com/documentation/web-api/reference/search).
<h2>How to run</h2>
<OL>
  <li>Download or clone the repository.</li>
  <li>Sign up for a Spotify Developer account at https://developer.spotify.com/ and create an app.</li>
  <li>Replace the CLIENT_ID and REDIRECT_URI in index.html with your own (if you run e.g. live-server (https://www.npmjs.com/package/live-server) on http://localhost:8080/ no need to replace the REDIRECT_URI as it's set up for that address).</li>
</OL>
<h2>Process</h2> 
<p>Searches all of the logged-in user's playlists, fifty playlists at a time, for a playlist called "Random Tracks From All of Spotify" (public or private). If not found, a public playlist with that name will be created.
</p>

<p>Random search queries will be generated and searched, and valid results will be checked against the selected exclusions and for duplication.
Once a batch of one hundred tracks to be added has been found (or fewer if the user selected a smaller number of tracks to get), the batch is pushed to the playlist on Spotify. This repeats until the total number of tracks desired has been pushed.
</p>
<h2>Methodology</h2>
<p>Each search is randomly one of three types:</p>

<OL>
<LI> By year: a random year between 1860 (year of the oldest
   sound recording that's playable - https://www.firstsounds.org/sounds/scott.php) and the current year.
<LI> By track name AND/OR track first artist name (50-50 chance of using both fields or just one): the query for each will be a random character, from a random UNICODE range (see lists.js) representing a particular character set (e.g. Latin script, Cyrilic, emojis), with a 5% chance that the character is selected from among ALL ranges.
<LI>By year AND either one or both of the fields from 2.</LI>
</OL>

<p>For all types, a random limit and offset of the results will be chosen, and a random result will be chosen from all that returns - when Spotify paginates results, the limit represents the number of results for page while offset gives the page number of results based on that limit (technically one less than the page number cause it starts at 0 offset = first page):
</p>

<UL>

<LI>Limit: 1 to max 50 (Spotify lets it be set to 0, but that would presumably mean no results)</LI>
<LI>Offset: 0 to max 1000. There is an 80% chance that the offset will be 0 (i.e. the first page of results), because all else being equal the relevance of results seems to fall off quickly/results become generic a lot in testing.
There is then a 15% chance of the offset being 1 (second page of results), and 5% chance of being greater. </LI>
</UL>
<p>
These are very arbitrary numbers that can conceivably be improved
</p>

<p>Searches will find anything Spotify considers a track, so possibly noise or spoken word in addition to songs. Podcast episodes and audiobooks as such won't be found, but tracks from audiobooks formatted as albums will. There are optional filters to adjust
the kind of results found (see track title exclusions in lists.js), but none are absolute and other tracks may marginally be affected:
</p>

<UL>
<LI>Fewer Audiobook Chapters (Default/Recommended): Excludes tracks with titles like "Chapter 1" or "Chapter some-number" in a number of different languages. Could exclude songs titles but only if they contain "Chapter" followed immediately by a number.  </LI>

<LI>Fewer Birthday Song Variations (Default/Recommended): Excludes tracks with "Happy Birthday To so-and-so" in their titles. In testing, recordings of the Birthday Song in different styles and with different people's names seem to come up unusually often...
</LI>
<LI>Less Classical: Excludes tracks with "Opus" or some variation in their titles. The exclusion list contains a few other catalog systems for specific composers but they're commented out by default.
</LI>

<LI>Fewer pre-2000 releases: when searching by year, the range of random years for the query will be restricted to the 21st Century until today (songs released earlier can still be added to the playlist from queries that don't include a year field).
</LI>

<LI>Fewer pre-1900 releases: like the above, except only the 19th Century will be excluded from queries. Has no additional effect if you also select Fewer pre-2000 releases, won't help or cause any problems.
</LI>
</UL>

<h2>Guidelines/Troubleshooting</h2>

The page needs to stay open to run, but if you do close it in process the worst that can happen is you'll get fewer songs than you requested, or no songs.

Check the console for progress details.

As noted above, up to 100 songs are searched and added at a time before doing another batch, so the process may partially succeed if interrupted.

If an API limit is hit during running then fewer songs than requested may actually be added - unexplained errors are probably due to hitting API limits (Code 429), check console for details and/or wait a little before trying again.

<h2>
  Considerations/Future</h2>

<UL>
<LI>
All references to track year use Spotify's release_Date field, which is actually part of the track's album field and not the track directly (see search documentation linked at top) and in any case may or may not be the year one naturally associates with the track...
</LI>
<LI>"Random" means Javascript's Math.random()</LI>
<LI>The Spotify for Developers landing page at time of writing says Spotify has 100 million songs (https://developer.spotify.com/) and at most a search can return 50,000 (50,0050?) results per query...
</LI>

<LI>There seems to be some degree of bias toward's the user's account/listening profile...which would be due to Spotify's handling of search queries but could potentially be mitigated further.</LI>
<LI>Conjectureally, MAYBE, later results/offsets of searches may be irrelevant to the query and default to Spotify recommendations based on the user...like what you get when you make a brand new playlist and Spotify recommends tracks to add. </LI>
<LI>Adding additional search fields like album or ISRC may or may not improve quality of results. Year seems the most reliable. Possibly different combinations of two or at most three fields would be good.</LI>
<LI>When selecting random characters for the search query fields, it might be better to select the possible range(s) for ALL fields to be used in the particular query, instead of doing a different selection for each. Unclear if mixing and matching e.g. Kanji artist and Georgian track name will produce relevant results. </LI>
</UL>
