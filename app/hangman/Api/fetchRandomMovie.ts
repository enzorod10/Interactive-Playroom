const fetchRandomMovie = async () => {
    console.log('check!')
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`
        }
      };

      const page = Math.floor(Math.random() * 500) + 1 

    try {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`, options);

        const res = await response.json()
        const movies = res.results;
        if (movies.length > 0) {
            const randomMovie = movies[Math.floor(Math.random() * movies.length)];
            return randomMovie.title;
        }
    } catch (error) {
        console.error('Error fetching random movie:', error);
        return null;
    }
};

export default fetchRandomMovie;
