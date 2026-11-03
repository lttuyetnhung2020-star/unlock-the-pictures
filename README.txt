UNLOCK THE PICTURES — WORDWALL-STYLE ONLINE GAME

This is a working Node.js + Socket.IO website, not a static slide.

HOW TO RUN LOCALLY
1. Install Node.js 18 or newer.
2. In this folder run: npm install
3. Run: npm start
4. Open http://localhost:3000 on the teacher computer.

HOW TO MAKE IT AVAILABLE ON THE INTERNET (RENDER)
1. Create a GitHub repository and upload all files, preserving public/.
2. On render.com choose New > Web Service > connect the repository.
3. Runtime: Node, build command: npm install, start command: npm start.
4. After deployment open the Render URL on the teacher computer.
5. Click Create teacher room; share each of the 3 group URLs to its iPad.
6. Teacher clicks Start, groups select a word then tap a circle on the map.
7. Teacher clicks CHECK ALL; all 3 iPads receive their scores immediately.

IMPORTANT
- Each team gets its own answer state; 3 teams can play simultaneously.
- Teacher dashboard shows each team's progress and results.
- The word audio button uses the browser's English speech synthesis, not the textbook recording.
- The cave was added to the supplied landscape, because the source image did not show a cave.
- This demo stores game rooms in server memory; restarting the server clears rooms.
- Teacher control is tied to a live connection, not a login system. For classroom use only.
- On Render free tier, the service may sleep after inactivity and require wake-up time.
- Internet hosting is NOT included: deploy to obtain a real public URL.
