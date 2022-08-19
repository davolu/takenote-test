 import { all, fork } from "redux-saga/effects";

//public
import categorySaga from "@/sagas/category";
import authSaga from "@/sagas/auth";
import noteSaga from "@/sagas/note";
import settingSaga from "@/sagas/setting";

 
export default function* rootSaga() {
  yield all([
    fork(categorySaga),
    fork(authSaga),
    fork(noteSaga),
    fork(settingSaga)
  ]);
 

   
}
