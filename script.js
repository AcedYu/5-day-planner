// Step 1: Render the current day and date with the format: Dayname, Month Day(th)
// Step 2: Check the current time compared to the times on our timeblock table determine if the event is in the past, present, or future.
// Assign classes past, present, or future based on above's determination
// Step 3: Add program ability to save form data onto local storage.

// Grab elements
var dayDisplay = $('#currentDay');
// Grab all of the input fields
var timeEntries = $('.description');
// Grab all saveBtn's
var save = $('.saveBtn');

// generate the current day phrase and add it to the html
var currentDay = moment().format('dddd [, ] MMMM Do');
dayDisplay.text(currentDay);

// Define an array of the scheduled hours on the html. As it turns out moment.js uses a 24 hour time system. Hour 13 equates to 1 PM. This 9 through 17 is the same as 9 AM to 5 PM
var hours = [9, 10, 11, 12, 13, 14, 15, 16, 17];

// containing a list of "past"(s), "present", and "future"(s).
var timeCheck = [];

// Iterate over our hours array and assign value "past", "present" or "future" to each hour value and push it into timeCheck array
for(var i = 0; i < hours.length; i++) {
  var whenCheck = moment().hours(hours[i]).fromNow();
  // I've looked over console logs, if the message does not contain the string: hour, then it's the present hour
  if (whenCheck.indexOf('hour') === -1) {
    timeCheck.push('present');
  }
  // If whenCheck contains the string: ago, then the hour was in the past
  else if (whenCheck.indexOf('ago') !== -1) {
    timeCheck.push('past');
  }
  // Or else the time has not happened yet
  else {
    timeCheck.push('future');
  }
}

// Add the classes in timeCheck to each item sequentially.
// as it turns out in jQuery I can go through my timeEntries as if they are an array
// iterate through the timeEntries array and add the new classes to each one of them it will be in order since the time labels corresponds with my globally defined hours array
for (var i = 0; i < timeEntries.length; i++) {
  timeEntries[i].classList.add(timeCheck[i]);
}

// Entry data will be stored in an object with each key being each hour of time that our table is recording. Example: {9: "recorded event"};
var scheduleData = JSON.parse(localStorage.getItem("schedule"));
if (!scheduleData) {
  scheduleData = {};
}

// Function to display schedule
var renderSchedule = () => {
  timeEntries.each(function(index, node) {
    if (scheduleData[index + 9]) {
      node.setAttribute('value', scheduleData[index + 9]);
    }
  });
}
// initialize render schedule immediately
renderSchedule();

save.on('click', function(event) {
  // turn the event target into something we can use with jQuery
  var target = $(event.target);
  // grab the name and value of the form next to the button
  var key = target.siblings().eq(1).attr('name');
  var val = target.siblings().eq(1).val();
  saveEntry(key, val);
  // No need to render schedule here because the data in the form is still there
});

// Saves entry to the object and then to local storage
var saveEntry = (key, value) => {
  scheduleData[key] = value;
  localStorage.setItem("schedule", JSON.stringify(scheduleData));
}