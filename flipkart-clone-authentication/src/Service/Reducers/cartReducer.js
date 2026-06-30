const cartReducer = (state = [], action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const exists = state.find((i) => i.id === action.payload.id);
      if (exists) {
        return state.map((i) =>
          i.id === action.payload.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
        );
      }
      return [...state, { ...action.payload, quantity: action.payload.quantity || 1 }];
    }

    case "INCREASE_QUANTITY":
      return state.map((item) =>
        item.id === action.payload
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      );

    case "DECREASE_QUANTITY":
      return state
        .map((item) => {
          if (item.id === action.payload) {
            const newQty = (item.quantity || 1) - 1;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);

    case "REMOVE_FROM_CART":
      return state.filter((item) => item.id !== action.payload);

    case "SET_CART":
      return action.payload;

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
};

export default cartReducer;
