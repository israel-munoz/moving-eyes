function eyesControl(element) {
  var control = {element: element};
  var rect = element.getBoundingClientRect();
  control.left = element.querySelector('.left');
  control.right = element.querySelector('.right');
  control.x = rect.x + rect.width / 2;
  control.y = rect.y + rect.height / 2;
  return control;
}
var svg = document.querySelector('svg');
var eyes = eyesControl(svg.querySelector('.eyes'));

/*! Events */
window.addEventListener('mousemove', function (evt) {
  if (eventController() === 'mouse') {
    var x = evt.clientX;
    var y = evt.clientY;
    moveEyes(eyes, x, y);
  }
});

document.querySelectorAll('.event-controller input').forEach(function (input) {
  input.addEventListener('change', eventChange);
});

document.querySelectorAll('form input').forEach(function (input) {
  input.addEventListener('keydown', inputMove);
  input.addEventListener('click', inputMove);
  input.addEventListener('focus', inputFocus);
  input.addEventListener('blur', inputBlur);
});

function inputMove(evt) {
  if (eventController() === 'keyboard') {
    if (evt.target.type === 'password') {
      eyeReset(eyes);
    } else {
      requestAnimationFrame(function () {
        var position = cursorPosition(evt.target);
        moveEyes(eyes, position.x, position.y);
      });
    }
  }
}

function inputFocus(evt) {
  if (evt.target.type === 'password') {
    requestAnimationFrame(function () {
      closeEye(eyes.left);
      closeEye(eyes.right);
    });
  }
}

function inputBlur(evt) {
  if (eventController() === 'keyboard') {
    console.log(evt.target.type);
    if (evt.target.type !== password) {
      openEye(eyes.left);
      openEye(eyes.right);
    }
    requestAnimationFrame(function () {
      if (document.activeElement.tagName !== 'INPUT') {
        eyeReset(eyes);
      }
    });
  }
}

/*! Eyes movement */
function moveEyes(eye, refX, refY) {
  var limit = .5;
  var x = (refX - eye.x) * .01;
  var y = (refY - eye.y) * .01;
  if (x < 0 && x < -limit) { x = -limit; }
  if (x > 0 && x > limit) { x = limit; }
  if (y < 0 && y < -limit) { y = -limit; }
  if (y > 0 && y > limit) { y = limit; }
  eye.left.style.transform = eye.right.style.transform = `translateX(${x}px) translateY(${y}px)`;
}

function closeEye(eye) {
  eye.querySelector('.close').beginElement();
}

function openEye(eye) {
  eye.querySelector('.open').beginElement();
}

function eyeReset(eye) {
  eye.left.style.transform = eye.right.style.transform = '';
}


/*! Get keyboard cursor position.
 *  Creates a temp div element to get current position of cursor based on its content. */
function cursorPosition(input) {
  var position = input.selectionEnd;
  var div = document.createElement('div');
  copyStyles(input, div, {width: 'fit-content', height: 'auto', position: 'absolute', visibility: 'hidden'});
  div.textContent = input.value.substr(0, position);
  document.body.appendChild(div);
  var inputRect = input.getBoundingClientRect();
  var divRect = div.getBoundingClientRect();
  var result = {
    x: inputRect.x + divRect.width,
    y: inputRect.y
  };
  document.body.removeChild(div);
  return result;
}

function copyStyles(src, dest, defaults) {
  var styles = getComputedStyle(src);
  Object.keys(styles).forEach(function (style) {
    dest.style[style] = defaults[style] || styles[style];
  });
}

/*! Event controllers (mouse or keyboard) functions */
function eventChange() {
  eyeReset(eyes);
}

function eventController() {
  var current = document.querySelector('.event-controller input[name=event]:checked');
  return current.value;
}
