export const orderReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };

    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: payload, error: "" };

    case "FETCH_FAIL":
      return { ...state, loading: false, error: payload };

    case "PAY_REQUEST":
      return { ...state, loadingPay: true };

    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };

    case "PAY_FAIL":
      return { ...state, loadingPay: false, errorPay: payload };

    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false, errorPay: "" };

    case "DELIVER_REQUEST":
      return { ...state, loadingDeliver: true };

    case "DELIVER_SUCCESS":
      return { ...state, loadingDeliver: false, successDeliver: true };

    case "DELIVER_FAIL":
      return { ...state, loadingDeliver: false, errorDeliver: payload };

    case "DELIVER_RESET":
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
        errorDeliver: "",
      };
    default:
      return state;
  }
};
