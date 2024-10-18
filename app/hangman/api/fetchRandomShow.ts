async function fetchRandomShow() {
    console.log('Fetching TV show...');
    const randomPage = Math.floor(Math.random() * 150); // Random page for diversity
    try {
        const response = await fetch(`https://api.tvmaze.com/shows?page=${randomPage}`);
        const shows = await response.json();

        // Filter shows to only include titles with letters and spaces
        const validShows = shows.filter((show: { name: string }) => /^[A-Za-z\s]+$/.test(show.name));

        // Retry if no valid shows found
        if (validShows.length > 0) {
            const randomShow = validShows[Math.floor(Math.random() * validShows.length)];
            return {
                answer: randomShow.name,
                theme: 'TV Show',
                image: randomShow.image ? randomShow.image.medium : null,
                height: randomShow.image ? '210px' : null
            };
        } else {
            console.log('No valid show titles found on this page. Retrying...');
            return fetchRandomShow(); // Retry by calling the function again
        }
    } catch (error) {
        console.error('Error fetching TV show:', error);
        return null;
    }
}


export default fetchRandomShow;