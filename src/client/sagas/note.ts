import { all, put, takeLatest, select } from 'redux-saga/effects'
import dayjs from 'dayjs'
import axios from 'axios'

import { requestNotes,saveState } from '@/api'
import { loadNotes, loadNotesError, loadNotesSuccess } from '@/slices/note'
import { sync, syncError, syncSuccess } from '@/slices/sync'
 
import { SyncAction } from '@/types'
import { getSettings } from '@/selectors'

const isDemo = process.env.DEMO
// Get notes from API
function* fetchNotes() {
  let data
  try {
    if (isDemo) {
      data = yield requestNotes()
    } else {
      data = (yield axios('/api/sync/notes')).data
    }
    const { notesSortKey } = yield select(getSettings)

    yield put(loadNotesSuccess({ notes: data, sortOrderKey: notesSortKey }))
  } catch (error) {
    yield put(loadNotesError(error.message))
  }
}
function* syncData({ payload }: SyncAction) {
  try {
    if (isDemo) {
      yield saveState(payload)
    } else {
      yield axios.post('/api/sync', payload)
    }
    yield put(syncSuccess(dayjs().format()))
  } catch (error) {
    yield put(syncError(error.message))
  }
}

 

// If any of these functions are dispatched, invoke the appropriate saga
function* noteSaga() {
  yield all([
    takeLatest(loadNotes.type, fetchNotes),
    takeLatest(sync.type, syncData),
  ])
}

export default noteSaga
