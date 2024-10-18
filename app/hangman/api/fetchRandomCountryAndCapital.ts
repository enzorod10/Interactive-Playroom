// Function to normalize strings by removing accents
const removeAccents = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
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
            answer: removeAccents(answer.toUpperCase()),
            theme: isCapital ? 'Capital City' : 'Country',
            image: randomCountry.flags?.svg || null, 
            height: '90px',
        };
    } catch (error) {
        console.error('Error fetching country and capital:', error);
        return null;
    }
};

export default fetchRandomCountryAndCapital;