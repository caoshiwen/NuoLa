import store from './Store';

export default {
  setUserStorage,
  getUserStorage,
  removeUserStorage,
  checkLoginState,
  showTip,
  noLogonStatusCallBack,
}



function setUserStorage(user) {
  localStorage.user = user;
  return localStorage.user;
}

function getUserStorage() {
  return localStorage.user;
}

function removeUserStorage() {
  localStorage.removeItem("user");
}

function checkLoginState() {
  return store.state.user.name;
}

/**
 * tip from element-ui
 * @param {vue this} _this 
 * @param {"warning"/"success"...} type 
 * @param {String} message 
 */
function showTip(_this, type, message) {
  _this.$message({
    message,
    type
  });
}

function noLogonStatusCallBack(_this) {
  _this.$store.commit("removeUser");
  _this.$router.push("/home");
  showTip(_this, "warning", "YOUR LOGON STATUS EXPIRED! PLEASE LOGIN AGAIN!");
}
