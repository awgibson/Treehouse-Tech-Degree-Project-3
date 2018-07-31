//Declare global variables
const jobRoleSelector = document.getElementById('title'); //stores the Job Role Drop Down to a variable
const shirtSelection = document.querySelector('.shirt');
const activitiesSelection = document.querySelector('.activities');
const paymentSelection = document.querySelector('#payment').parentElement;
const zipCodeField = document.querySelector('#zip');
const form = document.querySelector('FORM');

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
    const payment = document.querySelector('#payment').parentElement;
    const div = document.createElement('div');
    const p = document.createElement('p');
    const span = document.createElement('span');

    span.innerText = '0';
    p.textContent = 'Your Total Cost $ ';
    p.appendChild(span);
    div.appendChild(p);
    div.className = 'total-wrapper';
    form.insertBefore(div, payment);

    updateTotalCost(0);
}

//Updates the total cost by converting the text already present to an integer then adding the value passed
//to the function.
function updateTotalCost(cost) {
    const price = document.querySelector('.total-wrapper span');
    const currentTotal = parseInt(price.innerText);
    price.innerText = currentTotal + cost;
}

//Defaults for payment section are setup in this function.
//Credit card is the default selected payment method.
//Hides paypal and bitcoin messages and assign a classname for easier access
function paymentSectionIntial() {
    const creditCardOption = paymentSelection.querySelectorAll('#payment > option');
    const payPalDiv = paymentSelection.querySelector('.credit-card').nextElementSibling;
    const bitcoinDiv = paymentSelection.querySelector('.credit-card').nextElementSibling.nextElementSibling;
    const zipCode = paymentSelection.querySelector('#zip');
    const creditCardNumber = paymentSelection.querySelector('#cc-num');
    const ccv = paymentSelection.querySelector('#cvv');


    payPalDiv.className = 'paypal-msg';
    bitcoinDiv.className = 'bitcoin-msg';
    displayToggle('.paypal-msg', 'none');
    displayToggle('.bitcoin-msg', 'none');
    creditCardOption[1].selected = true;
    creditCardNumber.maxLength = '16';
    zipCode.maxLength = '5';
    ccv.maxLength = '3';
}

//Places tool tips that will appear with error messages
function createToolTips() {
    const afterEmail = document.querySelector('#mail');
    const afterActivities = activitiesSelection.nextElementSibling;

    afterEmail.insertAdjacentHTML('afterend', '<span class="tooltip"></span>');
    afterActivities.insertAdjacentHTML('afterend', '<span class="tooltip"></span>');
}

//Function that will display or disable the tooltip with error message
function tooltip(message, field, display) {
    const tooltip = field.nextElementSibling;
    tooltip.style.display = display;
    tooltip.innerText = message;

}

//Validates email address. I used the RFC 5322 standard validation RegEx after researching online the best way to handle this
function validEmail(email) {
    const rfc5322Validation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return rfc5322Validation.test(email);
}

//Actions that take place when the window loads
//The hardcoded 'other job role' field is set to hide until needed
//The cursor is set to focus on the first input field of the page
window.addEventListener('load', function () {
    displayToggle('#other-job-role', 'none');
    displayToggle('#colors-js-puns', 'none');
    createTotalCost();
    cursorFocus('#name');
    paymentSectionIntial();
    createToolTips();
});

//Event listener for the 'job role' drop down that toggle whether the extra input field
//is visible or not.
jobRoleSelector.addEventListener('change', function (e) {
    if (e.target['value'] === 'other') {
        displayToggle('#other-job-role', 'block');
    } else {
        displayToggle('#other-job-role', 'none');
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

    //Clears error styling if not activities are selected
    activitiesSelection.classList.remove('error-blank');
    tooltip('', activitiesSelection.nextElementSibling, '');



});

//Event Listener that toggles the Paypal and Bitcoin info on and off depending
//on what payment method is selected
paymentSelection.addEventListener('change', function (e) {
    const paymentSelection = document.querySelector('#payment');

    if (paymentSelection['value'] === 'paypal') {
        displayToggle('.paypal-msg', '');
        displayToggle('.bitcoin-msg', 'none');
        displayToggle('.credit-card', 'none');
    } else if (paymentSelection['value'] === 'bitcoin') {
        displayToggle('.bitcoin-msg', '');
        displayToggle('.paypal-msg', 'none');
        displayToggle('.credit-card', 'none');
    }
    else {
        displayToggle('.paypal-msg', 'none');
        displayToggle('.bitcoin-msg', 'none');
        displayToggle('.credit-card', '');
        paymentSelection.children[1].selected = 'true'; //Credit card is set as default even if 'Select Payment Method' is selected
    }

});

//Handles validation on submit
form.addEventListener('submit', function (e) {
    const nameField = document.querySelector('#name')
    const name = nameField.value;
    const emailField = document.querySelector('#mail');
    const email = emailField.value;
    const paymentMethod = document.querySelectorAll('#payment > option');
    const cvv = document.querySelector('#cvv');
    const creditcard = document.querySelector('#cc-num');


    //Function to handle checking if at least 1 activity is selected
    function validateActivities() {
        const activities = document.querySelectorAll('.activities > label > input');
        for (let i = 0; i < activities.length; i++) {
            if (activities[i]['checked']) {
                return true;
                break;
            }
        }
    }

    //Function that places cursor focus on first error if it is an input field
    function focusOnError() {
        const inputErrors = document.querySelectorAll('input.error-blank').length;
        if (inputErrors !== 0) {
            cursorFocus('input.error-blank');
        }
    }

    //Checks if name field is blank on submit
    if (name.length === 0) {
        nameField.classList.add('error-blank');
        nameField.placeholder = 'Please enter your name';
        e.preventDefault();
    }
    //Checks if email field is a vaild email address
    //Error message 1 of 2 for email on submit for exceeds expectations
    if (!validEmail(emailField.value)) {
        emailField.classList.add('error-blank');
        emailField.placeholder = 'Invalid email address';
        e.preventDefault();
    }
    //Checks if email field is blank on submit and provides a different error message
    //Error message 2 of 2 for email on submit for exceeds expectations
    if (email.length === 0) {
        emailField.classList.add('error-blank');
        emailField.placeholder = 'Please enter your email';
        e.preventDefault();
    }
    //Checks if activities have at least 1 activity selected
    if (!validateActivities()) {
        activitiesSelection.classList.add('error-blank');
        tooltip('Please select at least 1 activity', activitiesSelection.nextElementSibling, 'block');
        e.preventDefault();
    }

    //Conditions that are handled if credit card is payment method
    if (paymentMethod[1].selected) {
        //Checks if zip code is blank or less than 5 digits on submit
        if (isNaN(zipCodeField.value) || zipCodeField.value.length < 5) {
            zipCodeField.classList.add('error-blank');
            zipCodeField.placeholder = '5 Digits Needed';
            e.preventDefault();
        }
        //Checks if CVV is blank of less than 3 digits
        if (isNaN(cvv.value) || cvv.value.length < 3) {
            cvv.classList.add('error-blank');
            cvv.placeholder = '3 Digits Needed';
            e.preventDefault();
        }
        //Checks if cred card field is blank of less than 13 digits
        if (isNaN(creditcard.value) || creditcard.value.length < 13) {
            creditcard.classList.add('error-blank');
            creditcard.placeholder = 'Credit card required (13+ digits)';
            e.preventDefault();
        }
    }

    focusOnError();
});



//Event listener to handle live typing
form.addEventListener('input', function (e) {
    const field = e.target;
    const fieldValue = e.target.value;

    //Clears error class from text input fields on keystroke
    if (fieldValue.length > 0) {
        field.classList.remove('error-blank');
        field.placeholder = '';
    }

    //Prevents invalid characters from being entered in the credit card payment section.
    //I chose to prevent invalid input instead of provide an error message for these fields
    if ((e.target['id'] === 'zip') || (e.target['id'] === 'cvv') || (e.target['id'] === 'cc-num')) {
        const regex = /\D+/g;
        const isInvalidInput = regex.test(fieldValue);
        if (isInvalidInput) {
            const cleanedValue = fieldValue.replace(regex, '');
            e.target.value = cleanedValue;
        }
    }

    //Email validation live check
    //2 different error messages are provided below the email field if invalid
    //Errors appear before submit button is pressed
    if (e.target['id'] === 'mail' && !validEmail(fieldValue)) {
        tooltip('Please enter a valid email address', e.target, 'block');
    }
    if (e.target['id'] === 'mail' && fieldValue.length === 0) {
        tooltip('Email cannot be blank', e.target, 'block');
    }
    if (e.target['id'] === 'mail' && fieldValue.length !== 0 && validEmail(fieldValue)) {
        tooltip('', e.target, '');
    }

});











