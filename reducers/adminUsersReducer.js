export const adminUsersReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };

    case "FETCH_SUCCESS":
      return { ...state, loading: false, users: payload, error: "" };

    case "FETCH_FAIL":
      return { ...state, loading: false, error: payload };

    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true };

    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };

    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };

    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };

    default:
      return state;
  }
};
