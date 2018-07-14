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

//Event listener for the t-shirt colors drop-downs
shirtSelection.addEventListener('change', function (e) {
    const colors = document.getElementById('color').options; //Stores all options from the color dropdown

    //This function lets you declare what options you wish to have displayed by
    //setting a start point point and end point. Everything else is hidden
    function optionDisp(optionStart, optionEnd) {
        displayToggle('#colors-js-puns', ''); //displays the div that contains to color choices

        for (let i = 0; i < colors.length; i++) {
            if (i >= optionStart && i <= optionEnd) {
                colors[i].style.display = '';
                colors[i].disabled = false;
            } else {
                colors[i].style.display = 'none';
                colors[i].disabled = true; //prevents IE users from selecting options
            }
        }

        colors[optionStart].selected = true; //forces selection of the first option argument
    }

    //Conditionals that check which T-Shirt theme is selected and runs to above function with the
    //appropriate options needed to be displayed.
    //If neither T-shirt design is selected from the drop down, the color drop-down is hidden again.
    if (e.target['value'] === 'js puns') {
        optionDisp(0, 2);
    } else if (e.target['value'] === 'heart js') {
        optionDisp(3, 5);
    } else if ((e.target['id'] === 'design') && (e.target.children[0])) {
        displayToggle('#colors-js-puns', 'none');
    }
});


