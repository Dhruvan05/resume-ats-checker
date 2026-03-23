import React, { createContext, useReducer, useContext } from 'react';

const AnalysisContext = createContext(null);

const initialState = {
  uploadedFile: null,
  resumeId: null,
  selectedRole: 'sde',
  customJd: '',
  analysisResult: null,
  isLoading: false,
  loadingStep: '',
  error: null,
  history: []
};

function analysisReducer(state, action) {
  switch (action.type) {
    case 'SET_FILE': return { ...state, uploadedFile: action.payload };
    case 'SET_RESUME_ID': return { ...state, resumeId: action.payload };
    case 'SET_ROLE': return { ...state, selectedRole: action.payload };
    case 'SET_CUSTOM_JD': return { ...state, customJd: action.payload };
    case 'SET_RESULT': return { ...state, analysisResult: action.payload, isLoading: false, loadingStep: '' };
    case 'SET_LOADING': return { ...state, isLoading: action.payload };
    case 'SET_LOADING_STEP': return { ...state, loadingStep: action.payload, isLoading: true };
    case 'SET_ERROR': return { ...state, error: action.payload, isLoading: false, loadingStep: '' };
    case 'CLEAR_ERROR': return { ...state, error: null };
    case 'SET_HISTORY': return { ...state, history: action.payload };
    case 'RESET': return initialState;
    default: return state;
  }
}

export function AnalysisProvider({ children }) {
  const [state, dispatch] = useReducer(analysisReducer, initialState);

  const setLoadingWithStep = (step) => {
    dispatch({ type: 'SET_LOADING_STEP', payload: step });
  };

  const resetAnalysis = () => dispatch({ type: 'RESET' });

  return (
    <AnalysisContext.Provider value={{ state, dispatch, setLoadingWithStep, resetAnalysis }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) throw new Error("useAnalysis must be used inside AnalysisProvider");
  return context;
};
