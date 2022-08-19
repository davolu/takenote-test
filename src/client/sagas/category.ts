import { all, put, takeLatest, select } from 'redux-saga/effects'
import axios from 'axios'
import { requestCategories } from '@/api'
import { loadCategories, loadCategoriesError, loadCategoriesSuccess } from '@/slices/category'


const isDemo = process.env.DEMO

// Get categories from API
function* fetchCategories() {
  let data
  try {
    if (isDemo) {
      data = yield requestCategories()
    } else {
      data = (yield axios('/api/sync/categories')).data
    }
    yield put(loadCategoriesSuccess(data))
  } catch (error) {
    yield put(loadCategoriesError(error.message))
  }
}

 
// If any of these functions are dispatched, invoke the appropriate saga
function* categorySaga() {
  yield all([
    takeLatest(loadCategories.type, fetchCategories),
  ])
}

export default categorySaga
