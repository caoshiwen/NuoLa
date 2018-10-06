import store from './Store';
import Encryption from './Encryption';
import CONST from './CONST';

export default {
  setUserStorage,
  getUserStorage,
  removeUserStorage,
  checkLoginState,
  showTip,
  noLogonStatusCallBack,
  decryptResponse,
  encryptParam,
  cRequest,
  checkPassword,
  checkAccount,
  checkName
}



function setUserStorage(user) {
  sessionStorage.user = user;
  return sessionStorage.user;
}

function getUserStorage() {
  return sessionStorage.user;
}

function removeUserStorage() {
  sessionStorage.removeItem("user");
}

function checkLoginState() {
  return store.state.user.name;
}

function checkPassword(password) {
  return /^[\w_-]{6,18}$/.test(password);
}
function checkAccount(account) {
  return /^[\w_-]{1,18}$/.test(account);
}
function checkName(name) {
  return /^([a-zA-Z0-9\u4e00-\u9fa5\·]{1,10})$/.test(name);
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
  console.log("USER_LOGIN_STATUS_NONE");
  _this.$store.commit("removeUser");
  _this.$router.push("/login");
  showTip(_this, "warning", "YOUR LOGON STATUS EXPIRED! PLEASE LOGIN AGAIN!");
}

/**
 * decrypt response
 * @param {response} res 
 */
function decryptResponse(res) {
  let {
    data: {
      result,
      service_msg,
      service_code
    }
  } = res;
  result = JSON.parse(Encryption.decryptRsa(result));
  service_msg = Encryption.decryptRsa(service_msg);
  service_code = Encryption.decryptRsa(service_code);
  return {
    result,
    service_msg,
    service_code
  }
}
/**
 * encrypt param
 * @param {object} param
 * @returns {object} param
 */
function encryptParam(param) {
  for (let key in param) {
    if (param.hasOwnProperty(key)) {
      param[key] = Encryption.encryptRsa(param[key] + "");
    }
  }
  return param;
}

function cRequest(_this, url, _param, callBack){
  this.loading = true;
  let param = encryptParam({
    ..._param
  });
  _this.$http
  .post(CONST.HOST+url, param, CONST.SESSION_CONFIG_CROS)
  .then(res => {
    let data = decryptResponse(res);
    switch (data.service_code) {
      case CONST.USER_LOGIN_STATUS_NONE:
        noLogonStatusCallBack(_this);
        break;
      case CONST.NO_PERMISSION:
        _this.users_data = [];
        showTip(_this, "warning", "NO PERMISSION!");
        break;
      default:
        callBack(data);
        break;
    }
    _this.loading = false;
  })
  .catch((error) => {
    console.warn(error)
    showTip(_this, "warning", "UNKNOW ERROR!");
    _this.loading = false;
  });
}