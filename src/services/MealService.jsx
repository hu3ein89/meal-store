import axios from "axios";
const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export const searchMealsByName = async(query) => {
    const response = await axios.get(`${BASE_URL}/search.php?s=${query}`)
    return response.data.meals || []
}
export const listMealsByFirstLetter = async(letter) => {
    const response = await axios.get(`${BASE_URL}/search.php?f=${letter}`)
    return response.data.meals || []
}
export const getMealsByID = async(id) => {
    const response = await axios.get(`${BASE_URL}/search.php?i=${id}`)
    return response.data.meals || [0]
}
export const getRandomMeal = async() => {
    const response = await axios.get(`${BASE_URL}/random.php`)
    return response.data.meals || [0]
}
export const listCategories = async() => {
    const response = await axios.get(`${BASE_URL}/categories.php`)
    return response.data.categories || [0]
}
export const listMealsByIngredients = async(ingredient) => {
    const response = await axios.get(`${BASE_URL}/filter.php?i=${ingredient}`)
    return response.data.meals || []
}