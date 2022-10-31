export const adminEditUserReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };

    case "FETCH_SUCCESS":
      return { ...state, loading: false, error: "" };

    case "FETCH_FAIL":
      return { ...state, loading: false, error: payload };

    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true, errorUpdate: "" };

    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, errorUpdate: "" };

    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false, errorUpdate: payload };

    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };

    case "UPLOAD_SUCCESS":
      return {
        ...state,
        loadingUpload: false,
        errorUpload: "",
      };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: payload };

    default:
      return state;
  }
};
