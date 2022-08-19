import { all, put, takeLatest, select } from 'redux-saga/effects'
import {  requestSettings, saveSettings } from '@/api'
import {
  updateCodeMirrorOption,
  loadSettingsSuccess,
  loadSettingsError,
  loadSettings,
  toggleDarkTheme,
  togglePreviewMarkdown,
  toggleSettingsModal,
  updateNotesSortStrategy,
} from '@/slices/settings'
import { SyncAction } from '@/types'
import { getSettings } from '@/selectors'


// Get settings from API
function* fetchSettings() {
  let data
  try {
    data = yield requestSettings()

    yield put(loadSettingsSuccess(data))
  } catch (error) {
    yield put(loadSettingsError())
  }
}

function* syncSettings() {
  try {
    const settings = yield select(getSettings)
    yield saveSettings(settings)
  } catch (error) {}
}

// If any of these functions are dispatched, invoke the appropriate saga
function* settingSaga() {
  yield all([
    takeLatest(loadSettings.type, fetchSettings),
    takeLatest(
      [
        toggleDarkTheme.type,
        togglePreviewMarkdown.type,
        updateCodeMirrorOption.type,
        toggleSettingsModal.type,
        updateNotesSortStrategy.type,
      ],
      syncSettings
    ),
  ])
}

export default settingSaga
