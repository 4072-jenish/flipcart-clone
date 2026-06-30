const initialState = {
  all: [],
  filtered: [],
  category: "",
  priceRange: [],
  searchKeyword: "",
};

const applyAllFilters = (products, { category, priceRange, searchKeyword }) => {
  const kw = (searchKeyword || "").toLowerCase().trim();
  return products.filter((p) => {
    const matchKw =
      !kw ||
      (p.name || "").toLowerCase().includes(kw) ||
      (p.category || "").toLowerCase().includes(kw) ||
      (p.description || "").toLowerCase().includes(kw);
    const matchCat = !category || p.category === category;
    const price = Number(p.price);
    const matchPrice =
      !priceRange || priceRange.length === 0 ||
      (price >= priceRange[0] && price <= priceRange[1]);
    return matchKw && matchCat && matchPrice;
  });
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_PRODUCTS": {
      const filters = { category: state.category, priceRange: state.priceRange, searchKeyword: state.searchKeyword };
      return {
        ...state,
        all: action.payload,
        filtered: applyAllFilters(action.payload, filters),
      };
    }

    case "FILTER_BY_CATEGORY": {
      const next = { ...state, category: action.payload };
      return { ...next, filtered: applyAllFilters(state.all, next) };
    }

    case "FILTER_BY_PRICE": {
      const next = { ...state, priceRange: action.payload };
      return { ...next, filtered: applyAllFilters(state.all, next) };
    }

    case "SEARCH_BY_NAME": {
      const next = { ...state, searchKeyword: action.payload };
      return { ...next, filtered: applyAllFilters(state.all, next) };
    }

    case "DELETE_PRODUCT": {
      const updatedAll = state.all.filter((p) => p.id !== action.payload);
      return {
        ...state,
        all: updatedAll,
        filtered: applyAllFilters(updatedAll, state),
      };
    }

    default:
      return state;
  }
};

export default productReducer;
