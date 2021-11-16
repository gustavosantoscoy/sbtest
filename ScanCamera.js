'use strict';

const constraints = window.constraints = {
  audio: false,
  video: true
};

const video = document.querySelector('video');
video.height = 480;

const canvas = window.canvas = document.querySelector('canvas');
canvas.width = 640;
canvas.height = 480;
var pdf = null;
var iframe = document.querySelector('iframe');
const uploadButton = document.querySelector('#uploadPdf');

const button = document.querySelector('#takePicture');
button.onclick = function() {

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
 

  if(pdf == null)
  {
      pdf = new jsPDF("l", "px", [video.videoWidth,video.videoHeight]);
  }

  var imgData = canvas.toDataURL("image/jpeg", 1.0);
  pdf.addImage(imgData, 'JPEG', 0, 0,video.videoWidth,video.videoHeight,'','NONE');

  var blob = pdf.output('blob')
  var newurl = window.URL.createObjectURL(blob);
  iframe.src = newurl;

  pdf.addPage();

};

 

 

function handleSuccess(stream) {

  const videoTracks = stream.getVideoTracks();
  console.log('Got stream with constraints:', constraints);
  console.log('Using video device: ${videoTracks[0].label}');
  window.stream = stream; // make variable available to browser console
  video.srcObject = stream;
  
}

 

function handleError(error) {

  if (error.name === 'ConstraintNotSatisfiedError') {
    const v = constraints.video;
    errorMsg('The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.');

  } else if (error.name === 'PermissionDeniedError') {
    errorMsg('Permissions have not been granted to use your camera' +
      ', you need to allow the page access to your device in ' +
      'order for the demo to work.');
  }

  errorMsg('Camera Device error: ${error.name}', error);

}

 

function errorMsg(msg, error) {

  const errorElement = document.querySelector('#errorMsg');
  errorElement.innerHTML += '<p>${msg}</p>';
  if (typeof error !== 'undefined') {
    console.error(error);
  }

}

 

async function init(e) {

  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
    e.target.disabled = true;
	e.target.style.display = 'none';
	button.style.display = 'block';
	iframe.style.display = 'block';
	uploadButton.style.display = 'block';
  } catch (e) {
    handleError(e);
  }
}

document.querySelector('#showVideo').addEventListener('click', e => init(e));
document.querySelector('#uploadPdf').addEventListener('click', e => uploadPdf(e));
 


function uploadPdf(e)
{
     
      $.post( "/",{
         "dataObject" : pdf.output('datauristring')
     }).done(function(data) {

		alert("File has been uploaded successfully");

});

}