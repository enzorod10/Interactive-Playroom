const fetchRandomMovie = async () => {
    console.log('Fetching movie...');
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
        },
    };

    const page = Math.floor(Math.random() * 150) + 1;

    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`,
            options
        );

        const res = await response.json();
        const movies = res.results;

        if (movies.length > 0) {
            // Filter movies to only include titles with letters and spaces
            const validMovies = movies.filter((movie: { title: string; }) =>
                /^[A-Za-z\s]+$/.test(movie.title)
            );

            // Retry if no valid movies found
            if (validMovies.length > 0) {
                const randomMovie = validMovies[Math.floor(Math.random() * validMovies.length)];
                return { theme: 'Movie', answer: randomMovie.title, image: `https://image.tmdb.org/t/p/w500${randomMovie.poster_path}`, height: '225px' };
            } else {
                console.log('No valid movie titles found on this page. Retrying...');
                return fetchRandomMovie(); // Retry by calling the function again
            }
        }
    } catch (error) {
        console.error('Error fetching random movie:', error);
        return null;
    }
};

export default fetchRandomMovie;