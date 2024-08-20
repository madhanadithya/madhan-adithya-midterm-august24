const initialState = {
  user: null,
  error: null,
  loading: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
    case 'REGISTER_REQUEST':
      return { ...state, loading: true };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return { ...state, user: action.payload, loading: false, error: null };
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
      return { ...state, user: null, loading: false, error: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      return state;
  }
};

export default authReducer;
