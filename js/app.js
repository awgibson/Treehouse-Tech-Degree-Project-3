//Declare global variables
const jobRoleSelector = document.getElementById('title'); //stores the Job Role Drop Down to a variable
const shirtSelection = document.querySelector('.shirt');
const activitiesSelection = document.querySelector('.activities');

//Function that will change the cursor focus to specific argument
function cursorFocus(field) {
    document.querySelector(field).focus();
}

//Function to toggle if an element is visible or not for more readability.
function displayToggle(element, dispValue) {
    document.querySelector(element).style.display = dispValue;
}

//Creates elements to display the current price the customer will need to pay and calls the updateTotalCost function initially.
function createTotalCost() {
    const form = document.getElementsByTagName('FORM');
    const payment = document.querySelector('#payment').parentElement;
    const div = document.createElement('div');
    const p = document.createElement('p');
    const span = document.createElement('span');

    span.innerText = '0';
    p.textContent = 'Your Total Cost $ ';
    p.appendChild(span);
    div.appendChild(p);
    div.className = 'total-wrapper';
    form[0].insertBefore(div, payment);

    updateTotalCost(0);
}

//Updates the total cost by converting the text already present to an integer then adding the value passed
//to the function.
function updateTotalCost(cost) {
    const price = document.querySelector('.total-wrapper span');
    const currentTotal = parseInt(price.innerText);
    price.innerText = currentTotal + cost;
}

//Actions that take place when the window loads
//The hardcoded 'other job role' field is set to hide until needed
//The curse is set to focus on the first input field of the page
window.addEventListener('load', function () {
    displayToggle('#other-job-role', 'none');
    displayToggle('#colors-js-puns', 'none');
    createTotalCost();
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

//Event listener that handles the check boxes associated with registering for activities.
activitiesSelection.addEventListener('change', function (e) {
    const activities = activitiesSelection.children; //Selects all the input/labels


    //Function looks at the text within the labels and seperates the data to use in a compare function.
    function seperateInfo(element, i) {
        let stringToBreak = '';

        //How the data is pulled had to be done slightly different from the e.target and the elements
        //within the register for activities form field.
        //Regular expressions are used to seperate the strings by removing white space and the '$'
        if (element === e.target) {
            stringToBreak = element.nextSibling.textContent.split(/[\s$]/);
        } else {
            stringToBreak = element[i].innerText.split(/[\s$]/);
        }
        //Subtracting from then end of the arrays prove to be the most consistent way to locate the data.
        //Store all the values in an object for easy access and reasability.
        const info = {
            day: stringToBreak[stringToBreak.length - 4],
            time: stringToBreak[stringToBreak.length - 3],
            price: parseInt(stringToBreak[stringToBreak.length - 1])
        };
        return info;
    }

    //This function creates variables used to compare what is selected against other activity options
    //If the day and time match and the name attributes are not equal, the element is disabled.
    //the 'value' parameter is used to alternate the check box between a disabled and enabled state.
    //The label's font color is styled a darker color to help disguish what is disabled as well.
    function compareFields(value) {
        for (let i = 1; i < activities.length; i++) {
            let selectedDay = seperateInfo(e.target).day;
            let compareDay = seperateInfo(activities, i).day;
            let selectedTime = seperateInfo(e.target).time;
            let compareTime = seperateInfo(activities, i).time;

            if ((selectedDay === compareDay) && (selectedTime === compareTime) && (activities[i].firstElementChild['name'] !== e.target['name'])) {
                activities[i].firstElementChild.disabled = value;
                if (value) {
                    activities[i].style.color = 'gray';
                }
                else {
                    activities[i].style.color = '';
                }
            }
        }
    }

    //Two conditionals trigger the functions above in slightly different depending if the check box is checked
    //or unchecked. A checked box will compare the fields and disable matching activities while adding the price
    //to the subtotal box on screen.
    //If a box is unchecked, the opposite occurs.
    if (e.target['type'] === 'checkbox' && e.target['checked']) {
        compareFields(true);
        updateTotalCost(seperateInfo(e.target).price);
    }

    if (e.target['type'] === 'checkbox' && !e.target['checked']) {
        compareFields(false);
        updateTotalCost(seperateInfo(e.target).price * -1);

    }

});

