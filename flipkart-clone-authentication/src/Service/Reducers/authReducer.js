const storedUser = (() => {
  try { return JSON.parse(sessionStorage.getItem("user")); } catch { return null; }
})();

const initialState = {
  user: storedUser || null,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
    case "REGISTER_SUCCESS":
      sessionStorage.setItem("user", JSON.stringify(action.payload));
      return { ...state, user: action.payload, error: null };

    case "LOGOUT":
    case "LOGOUT_SUCCESS":
      sessionStorage.removeItem("user");
      return { ...state, user: null, error: null };

    case "AUTH_ERROR":
      return { ...state, error: action.payload };

    default:
      return state;
  }
};

export default authReducer;
