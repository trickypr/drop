import { createStore } from 'redux'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

export enum Actions {
  ADD_FILE = 'ADD_FILE',
  SET_FILE_NAME = 'SET_FILE_NAME',
}

function counterReducer(
  state: { files: File[]; fileName: string } = { files: [], fileName: '' },
  action: { type: Actions; payload?: any }
) {
  switch (action.type) {
    case Actions.ADD_FILE:
      return {
        ...state,
        files: [...state.files, action.payload],
      }
    case Actions.SET_FILE_NAME:
      return {
        ...state,
        fileName: action.payload,
      }
    default:
      return state
  }
}

export let store = createStore(counterReducer)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
