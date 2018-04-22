import './normalize.css';
import './style.css';
import './alert.css';
import axios from 'axios';
import Alert, { CLASS_DANGER } from './alert';

const POST_URL = POST || 'https://localhost:3000/';
const INPUT_ID = 'file_input';
const SUBMIT_ID = 'file_submit';
const FILE_NAME_INPUT_ID = 'file_name';
const FILE_DROP_AREA = 'file_drop_area';
const FILE_DROP_AREA_FILENAME = 'file_drop_area_filename';
const FORM_CONTAINER_ID = 'form_container';

const ACTIVE_CLASS = 'is-active';
const LOADING_CLASS = 'is_loading';

const FILE_INNER_DESCRIPTION_DEFAULT = 'Arrastra Archivos aquí';

function uploadDocumentRequest({ file, name }) {
  let data = new FormData();
  data.append('file', file);
  data.append('name', name);
  return new Promise((resolve, reject) => {
    axios
      .post(POST_URL, data, { responseType: 'arraybuffer' })
      .then(data => {
        downloadFile(data, name);
        return resolve();
      })
      .catch(() => {
        return reject();
      });
  });
}

function handleFileChange({ files, num_reg }) {
  const file = files[0];
  return new Promise((resolve, reject) => {
    uploadDocumentRequest({ file, name: num_reg })
      .then(resolve, reject)
      .catch(reject);
  });
}

function disableElement(element) {
  element.disabled = true;
}

function enableElement(element) {
  element.disabled = false;
}

function downloadFile(response, fileName) {
  // It is necessary to create a new blob object with mime-type explicitly set
  // otherwise only Chrome works like it should
  var newBlob = new Blob([response.data], { type: 'application/pdf' });

  // IE doesn't allow using a blob object directly as link href
  // instead it is necessary to use msSaveOrOpenBlob
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(newBlob);
    return;
  }

  // For other browsers:
  // Create a link pointing to the ObjectURL containing the blob.
  const data = window.URL.createObjectURL(newBlob);
  var link = document.createElement('a');
  link.href = data;
  link.download = fileName;
  link.click();
  setTimeout(() => {
    // For Firefox it is necessary to delay revoking the ObjectURL
    window.URL.revokeObjectURL(data);
  }, 100);
}

function removeFiles(input, input_text, descriptionElement) {
  input.value = '';
  input_text.value = '';
  descriptionElement.innerText = FILE_INNER_DESCRIPTION_DEFAULT;
}

function init() {
  const alert = new Alert();

  const input = document.getElementById(INPUT_ID);
  const submit = document.getElementById(SUBMIT_ID);
  const file_name_input = document.getElementById(FILE_NAME_INPUT_ID);
  const file_drop_area = document.getElementById(FILE_DROP_AREA);
  const file_name = document.getElementById(FILE_DROP_AREA_FILENAME);
  const form_container = document.getElementById(FORM_CONTAINER_ID);

  let _files;

  input.addEventListener('change', () => {
    if (input.files.length > 0) {
      _files = input.files;
      file_name.innerText = _files[0].name;
      enableElement(submit);
    } else {
      removeFiles(input, file_name_input, file_name);
      disableElement(submit);
    }
    removeActiveClassFileDropArea();
  });

  submit.addEventListener('click', () => {
    isLoading();
    alert.dissmiss();
    handleFileChange({ files: _files, num_reg: file_name_input.value })
      .then(
        () => {
          removeFiles(input, file_name_input, file_name);
          disableElement(submit);
        },
        () => {
          alert.dispatch('Se ha producido un error', CLASS_DANGER);
        }
      )
      .catch(() => {
        alert.dispatch('Se ha producido un error', CLASS_DANGER);
      })
      .then(() => {
        notLoading();
      });
  });

  const addActiveClassFileDropArea = () => file_drop_area.classList.add(ACTIVE_CLASS);
  const removeActiveClassFileDropArea = () => file_drop_area.classList.remove(ACTIVE_CLASS);
  const isLoading = () => form_container.classList.add(LOADING_CLASS);
  const notLoading = () => form_container.classList.remove(LOADING_CLASS);

  file_drop_area.addEventListener('dragenter', addActiveClassFileDropArea);
  file_drop_area.addEventListener('focus', addActiveClassFileDropArea);
  file_drop_area.addEventListener('click', addActiveClassFileDropArea);
  file_drop_area.addEventListener('dragleave', removeActiveClassFileDropArea);
  file_drop_area.addEventListener('blur', removeActiveClassFileDropArea);
  file_drop_area.addEventListener('drop', removeActiveClassFileDropArea);
}

document.addEventListener('DOMContentLoaded', init);
