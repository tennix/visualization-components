// in src/sagas/index.js
import { all } from 'redux-saga/effects'
import { watchFetchLabels, watchFetchLabelsStores } from './labels'
import { watchFetchClusterStatus } from './cluster'
import { watchFetchMembers } from './members'
import { watchFetchStores, watchFetchStore } from './stores'
import {
  watchFetchRegions,
  watchFetchRegionById,
  watchFetchRegionByKey,
} from './regions'

export default function* rootSaga() {
  yield all([
    watchFetchClusterStatus(),
    watchFetchLabels(),
    watchFetchLabelsStores(),
    watchFetchMembers(),
    watchFetchStores(),
    watchFetchStore(),
    watchFetchRegions(),
    watchFetchRegionById(),
    watchFetchRegionByKey(),
  ])
}
