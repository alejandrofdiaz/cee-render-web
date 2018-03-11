const ALERT_ID = 'alert';
const ALERT_TEXT_ID = 'alert__text';
const ALERT_CLOSE_ID = 'alert__close';
const CLASS_INFO = 'info';
const CLASS_DANGER = 'danger';
const CLASS_WARNING = 'warning';

const DEFAULT_MSG = 'Ha habido un error';

class Alert {
  constructor(ID = ALERT_ID) {
    console.log(ID);
    this._el = document.getElementById(ID);
    this._close = document.getElementById(ALERT_CLOSE_ID);
    this._text = document.getElementById(ALERT_TEXT_ID);
    this._close.addEventListener('click', this.dissmiss.bind(this));

    this.dissmiss();
  }

  dissmiss() {
    this._el.style.display = 'none';
  }

  show() {
    this._el.style.display = 'block';
  }

  setContent(msg = DEFAULT_MSG) {
    this._text.innerText = String(msg);
  }

  setClass(className = CLASS_INFO) {
    this._el.className = ['alert',className].join(' ');
  }

  dispatch(msg, className) {
    this.setClass(className);
    this.setContent(msg);
    this.show();
  }
}

export default Alert;
export { CLASS_DANGER, CLASS_INFO, CLASS_WARNING };
