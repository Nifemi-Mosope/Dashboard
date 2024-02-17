const { combineReducers } = require("@reduxjs/toolkit");
const storage = require("redux-persist/lib/storage").default;

const kitchenReducer = require("../Features/Kitchen/KitchenSlice").default;
const errorReducer = require("../Features/Error/errorSlice").default.default;

const appReducer = combineReducers({
  kitchen: kitchenReducer,
  error: errorReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "user/setLogout") {
    storage.removeItem("persist:root");
    state = {};
  }
  return appReducer(state, action);
};

module.exports = rootReducer;
