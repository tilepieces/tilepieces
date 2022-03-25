function download(filename, blobURL) {
  var element = document.createElement('a');
  element.setAttribute('href', blobURL);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  window.URL.revokeObjectURL(blobURL);
}