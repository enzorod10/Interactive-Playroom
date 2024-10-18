const fetchRandomActor = async () => {
    console.log('Fetching actor...');
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
            `https://api.themoviedb.org/3/person/popular?include_adult=false&language=en-US&page=${page}`,
            options
        );

        const res = await response.json();
        const actors = res.results;

        if (actors.length > 0) {
            // Filter actors to only include names with letters and spaces
            const validActors = actors.filter((actor: { name: string; }) =>
                /^[A-Za-z\s]+$/.test(actor.name)
            );

            // Retry if no valid actors found
            if (validActors.length > 0) {
                const randomActor = validActors[Math.floor(Math.random() * validActors.length)];
                return { theme: 'Actor', answer: randomActor.name, image: `https://image.tmdb.org/t/p/w500${randomActor.profile_path}`, height: '225px' };
            } else {
                console.log('No valid actor names found. Retrying...');
                return fetchRandomActor(); // Retry by fetching another page
            }
        }
    } catch (error) {
        console.error('Error fetching random actor:', error);
        return null;
    }
};

export default fetchRandomActor;