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

function createToolTips() {
    const allInputs = document.querySelectorAll('INPUT');
    const afterActivities = activitiesSelection.nextElementSibling;

    for (let i = 0; i < allInputs.length; i++) {
        if (allInputs[i]['type'] === 'text' || allInputs[i]['type'] === 'email') {
            allInputs[i].insertAdjacentHTML('afterend', '<span class="tooltip">Test</span>');
        }
    }

    afterActivities.insertAdjacentHTML('afterend', '<span class="tooltip">Test</span>');
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


});

//Event Listener that toggles the DIVs containiner Paypal and Bitcoin info on and off depend
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
        paymentSelection.children[1].selected = 'true';
    }

});

//Handles submit and validation
form.addEventListener('submit', function (e) {
    const nameField = document.querySelector('#name')
    const name = nameField.value;
    const emailField = document.querySelector('#mail');
    const email = emailField.value;
    const paymentMethod = document.querySelectorAll('#payment > option');
    const cvv = document.querySelector('#cvv');
    const creditcard = document.querySelector('#cc-num');



    function validateActivities() {
        const activities = document.querySelectorAll('.activities > label > input');
        for (let i = 0; i < activities.length; i++) {
            if (activities[i]['checked']) {
                return true;
                break;
            }
        }
    }

    if (name.length === 0) {
        nameField.classList.add('error-blank');
        nameField.placeholder = 'Please enter your name';
        e.preventDefault();
    }

    if (email.length === 0) {
        emailField.classList.add('error-blank');
        emailField.placeholder = 'Please enter your email to continue';
        e.preventDefault();
    }

    if (!validateActivities()) {
        activitiesSelection.classList.add('error-blank');
        e.preventDefault();
    }

    if (paymentMethod[1].selected) {
        if (isNaN(zipCodeField.value) || zipCodeField.value.length < 5) {
            zipCodeField.classList.add('error-blank');
            e.preventDefault();
        }
        if (isNaN(cvv.value) || cvv.value.length < 3) {
            cvv.classList.add('error-blank');
            e.preventDefault();
        }
        if (isNaN(creditcard.value) || creditcard.value.length < 13) {
            creditcard.classList.add('error-blank');
            e.preventDefault();
        }

    }





});

form.addEventListener('keyup', function (e) {
    const value = e.target.value;
    const field = e.target;
    if (value.length > 0) {
        field.classList.remove('error-blank');
        field.placeholder = '';
    }
});


paymentSelection.addEventListener('input', function (e) {
    let fieldValue = e.target.value;

    //Prevents invalid characters from being entered in the credit card payment section.
    if ((e.target['id'] === 'zip') || (e.target['id'] === 'cvv') || (e.target['id'] === 'cc-num')) {
        const regex = /\D+/g;
        const isInvalidInput = regex.test(fieldValue);
        if (isInvalidInput) {
            const cleanedValue = fieldValue.replace(regex, '');
            e.target.value = cleanedValue;
        }
    }

    //Credit card length live check
    if (e.target['id'] === 'cc-num' && fieldValue.length < 13) {
        console.log('Please enter a 13 to 16 digit credit card number');
    }

    //Zip code length live check
    if (e.target['id'] === 'zip' && fieldValue.length < 5) {
        console.log('Please enter a 5 digit zip code');
    }

    //CVV code length live check
    if (e.target['id'] === 'cvv' && fieldValue.length < 3) {
        console.log('Please enter a 3 digit CVV code');
    }


});











