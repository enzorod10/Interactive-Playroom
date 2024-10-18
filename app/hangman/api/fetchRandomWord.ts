const fetchRandomWord = async () => {
    try {
        const response = await fetch('https://random-word-api.herokuapp.com/word');
        const [randomWord] = await response.json();
        return { theme: 'Word', answer: randomWord, image: null, height: null };
    } catch (error) {
        console.error('Error fetching random word:', error);
        return null;
    }
};

export default fetchRandomWord;