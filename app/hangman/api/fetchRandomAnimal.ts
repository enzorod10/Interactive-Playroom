// Function to normalize strings by removing accents (same as for countries)
const removeAccents = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const fetchRandomAnimal = async () => {
    try {
        const response = await fetch('https://animalapi.com/animals'); // Example API endpoint
        const data = await response.json();

        // Randomly select an animal
        const randomAnimal = data[Math.floor(Math.random() * data.length)];

        const animalName = randomAnimal.name;  // Animal name from the API

        return {
            answer: removeAccents(animalName.toUpperCase()),  // Normalize and convert to uppercase
            theme: 'Animal',
            image: randomAnimal.image || null,  // Use animal image if available
            height: null,
        };
    } catch (error) {
        console.error('Error fetching animal:', error);
        return null;
    }
};

export default fetchRandomAnimal;