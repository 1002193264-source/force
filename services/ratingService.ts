const RATINGS_STORAGE_KEY = 'physicsQuizRatings';

type QuizRatings = Record<string, number>;

/**
 * Retrieves all quiz question ratings from localStorage.
 * @returns {QuizRatings} An object containing question-rating pairs.
 */
export const getRatings = (): QuizRatings => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
        const ratingsJSON = localStorage.getItem(RATINGS_STORAGE_KEY);
        return ratingsJSON ? JSON.parse(ratingsJSON) : {};
    }
    return {};
  } catch (error) {
    console.error("Failed to parse ratings from localStorage", error);
    return {};
  }
};

/**
 * Saves a rating for a specific quiz question to localStorage.
 * @param {string} question - The text of the question to rate.
 * @param {number} rating - The rating value (e.g., 1-5).
 */
export const saveRating = (question: string, rating: number): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
        const allRatings = getRatings();
        allRatings[question] = rating;
        localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(allRatings));
    }
  } catch (error) {
    console.error("Failed to save rating to localStorage", error);
  }
};
