//Declare global variables
const jobRoleSelector = document.getElementById('title'); //stores the Job Role Drop Down to a variable
const shirtSelection = document.querySelector('.shirt');

//Function that will change the cursor focus to specific argument
function cursorFocus(field) {
    document.querySelector(field).focus();
}

//Function to toggle if an element is visible or not for more readability.
function displayToggle(element, dispValue) {
    document.querySelector(element).style.display = dispValue;
}

//Actions that take place when the window loads
//The hardcoded 'other job role' field is set to hide until needed
//The curse is set to focus on the first input field of the page
window.addEventListener('load', function () {
    displayToggle('#other-job-role', 'none');
    displayToggle('#colors-js-puns', 'none');
    cursorFocus('#name');
});

//Event listener for the 'job role' drop down that toggle whether the extra input field
//is visible or not.
jobRoleSelector.addEventListener('change', function (e) {
    if (e.target['value'] === 'other') {
        displayToggle('#other-job-role', 'block');
    } else {
        displayToggle('#other-job-role', 'none');
        return false;
    }
});

shirtSelection.addEventListener('change', function (e) {
    const colors = document.getElementById('color').options;

    if (e.target['value'] === 'js puns') {
        displayToggle('#colors-js-puns', '');

        colors[0].style.display = '';
        colors[1].style.display = '';
        colors[2].style.display = '';
        colors[3].style.display = 'none';
        colors[4].style.display = 'none';
        colors[5].style.display = 'none';

        colors[0].selected = true;


    } else if (e.target['value'] === 'heart js') {
        displayToggle('#colors-js-puns', '');


        colors[0].style.display = 'none';
        colors[1].style.display = 'none';
        colors[2].style.display = 'none';
        colors[3].style.display = '';
        colors[4].style.display = '';
        colors[5].style.display = '';

        colors[3].selected = true;


    } else if ((e.target['id'] === 'design') && (e.target.children[0])) {
        displayToggle('#colors-js-puns', 'none');
    }
});


