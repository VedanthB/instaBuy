export const adminDashboardReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };

    case "FETCH_SUCCESS":
      return { ...state, loading: false, summary: payload, error: "" };

    case "FETCH_FAIL":
      return { ...state, loading: false, error: payload };
    default:
      return state;
  }
};
