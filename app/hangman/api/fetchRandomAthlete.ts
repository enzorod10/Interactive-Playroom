const fetchRandomFavoriteAthlete = async () => {
    console.log('Fetching favorite athlete...');

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
        },
    };

    try {
        // Step 1: Fetch favorite athletes
        const response = await fetch('https://www.thesportsdb.com/api/v1/json/3/searchloves.php?u=zag', options);
        const res = await response.json();
        const favorites = res.players;

        if (!favorites || favorites.length === 0) {
            console.warn('No favorites found');
            return null;
        }

        // Step 2: Filter to only include players
        const playerFavorites = favorites.filter((fav: { idPlayer: string; }) => fav.idPlayer);

        if (playerFavorites.length === 0) {
            console.warn('No favorite players found');
            return null;
        }

        let validPlayer = null;
        while (!validPlayer) {
            // Step 3: Pick a random player
            const randomFavorite = playerFavorites[Math.floor(Math.random() * playerFavorites.length)];

            // Step 4: Fetch player details
            const playerResponse = await fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${randomFavorite.idPlayer}`, options);
            const playerRes = await playerResponse.json();
            const playerDetails = playerRes.players[0]; // The player object

            if (playerDetails && playerDetails.strPlayer) {
                const playerName = playerDetails.strPlayer;

                // Step 5: Validate the player's name (only letters and spaces)
                if (/^[A-Za-z\s]+$/.test(playerName)) {
                    validPlayer = { theme: 'Athlete', answer: playerName, image: playerDetails.strThumb, height: '150px' };
                } else {
                    console.warn(`Invalid player name: ${playerName}. Retrying...`);
                }
            } else {
                console.warn('Player details not found. Retrying...');
            }
        }

        return validPlayer;
    } catch (error) {
        console.error('Error fetching favorite athlete:', error);
        return null;
    }
};

export default fetchRandomFavoriteAthlete;