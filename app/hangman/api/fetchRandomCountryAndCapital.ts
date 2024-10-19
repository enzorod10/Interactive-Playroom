// Function to normalize strings by removing accents
const removeAccentsAndSpecialChars = (str: string) => {
    // Remove accents first
    const normalizedStr = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    // Remove any special characters except spaces and letters
    return normalizedStr.replace(/[^a-zA-Z\s]/g, '');
};

const fetchRandomCountryAndCapital = async () => {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();

        // Filter out countries without a capital
        const countriesWithCapitals = data.filter((country: { capital: string | unknown[]; }) => country.capital && country.capital.length > 0);

        // Randomly select a country
        const randomCountry = countriesWithCapitals[Math.floor(Math.random() * countriesWithCapitals.length)];

        const country = randomCountry.name.common; // Country name
        const capital = randomCountry.capital[0];  // Capital name

        // Normalize the answer to remove accents
        const isCapital = Math.random() > 0.5;
        const answer = isCapital ? capital : country;

        return {
            answer: removeAccentsAndSpecialChars(answer.toUpperCase()),
            theme: isCapital ? 'Capital' : 'Country',
            image: randomCountry.flags?.svg || null, 
            height: randomCountry.flags?.svg && '100px',
        };
    } catch (error) {
        console.error('Error fetching country and capital:', error);
        return null;
    }
};

export default fetchRandomCountryAndCapital;