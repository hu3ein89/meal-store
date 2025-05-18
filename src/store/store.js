import {configureStore} from '@reduxjs/toolkit'
import authReducer from '../slices/AuthorizeSlice'
import cartReducer from '../slices/Cartslice'
import mealReducer from '../slices/MealSlice'
import uiReducer from '../slices/UiSlice.jsx'

const store = configureStore ({
    reducer : {
        ui:uiReducer,
        auth:authReducer,
        cart:cartReducer,
        meals:mealReducer
    }
})
export default store