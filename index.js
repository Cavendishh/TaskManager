//Variables defined
var deadlines = document.querySelectorAll('input[type=radio][name="deadline"]')
var options = document.forms.taskForm.taskMenu.options
var filter = document.forms.taskForm
var taskDiv = document.getElementById('finishedTaskDiv')
var taskIndex = 0

//Adding event listeners dynamically to code
deadlines[0].addEventListener('change', displayDeadline)
deadlines[1].addEventListener('change', displayDeadline)
filter.filterLow.addEventListener('change', filterTasks)
filter.filterMedium.addEventListener('change', filterTasks)
filter.filterHigh.addEventListener('change', filterTasks)
filter.filterUnfinished.addEventListener('change', filterUnfinished)
filter.filterFinished.addEventListener('change', filterFinished)
taskDiv.addEventListener('drop', drop)
taskDiv.addEventListener('dragover', allowDrop)

//Activate deadline hiding and refreshing task amount
deadlineDate.style.display = 'none'
refreshAmount()

//Shows error for 3 seconds if note too short
function contentError() {
  var error = document.getElementById('contentError')
  var note = document.getElementById('note')

  error.innerHTML = 'A note must have 10 or more characters'
  error.setAttribute('class', 'alert alert-danger')
  note.style.border = '2px dashed #e6858d'
  setTimeout(function () {
    error.innerHTML = ''
    error.setAttribute('class', '')
    note.style.border = ''
  }, 3000)
}

//Displays deadline
function displayDeadline() {
  if (deadlines[0].checked) {    
    deadlineDate.style.display = 'none'
  } else {
    deadlineDate.style.display = 'inline'
  }
}

//Used for filtering low/medium/high importance tasks
function filterTasks(event) {
  var filters = document.getElementById('taskTable').querySelectorAll(`[class*='${event.target.value}']`)
  if (event.target.checked) {
    for (i = 0; i < filters.length; i++) {
      filters[i].style.display = ''
    }
  } else {
    for (i = 0; i < filters.length; i++) {
      filters[i].style.display = 'none'
    }
  }
}

//Filters finished tasklist
function filterFinished(event) {
  if (event.target.checked) {
    document.getElementById('finishedTaskDiv').style.display = ''
  } else {
    document.getElementById('finishedTaskDiv').style.display = 'none'
  }
}

//Filters unfinished tasklist
function filterUnfinished(event) {
  if (event.target.checked) {
    document.getElementById('unfinishedTaskDiv').style.display = ''
  } else {
    document.getElementById('unfinishedTaskDiv').style.display = 'none'
  }
}

//If note is enough long - add a task to a table - don't refresh on submit
function addTask() {
  if (document.getElementById('note').value.length < 10) {
    contentError()
    return false
  } else {
    //Create table elements
    var row = document.createElement('tr')
    var cell1 = document.createElement('td')
    var cell2 = document.createElement('td')
    var cell3 = document.createElement('td')
    var cell4 = document.createElement('td')
    var cell5 = document.createElement('td')
    var button = document.createElement('button')
    var taskBody = document.getElementsByTagName('tbody')[0]

    //Adding attributes for variable row
    row.classList.add(options[options.selectedIndex].value.toLowerCase())
    //Change background color based on importance
    if (options[options.selectedIndex].value === 'Low') row.classList.add('bgLightGreen')
    if (options[options.selectedIndex].value === 'Medium') row.classList.add('bgLightGolden')
    if (options[options.selectedIndex].value === 'High') row.classList.add('bgLightRed')
    row.id = `task${taskIndex}`
    row.draggable = 'true'
    row.addEventListener('dragstart', drag)

    //Adding contents and event to cells
    cell1.innerHTML = getDateNow('yearMonthDay')
    cell2.innerHTML = options[options.selectedIndex].value
    cell3.innerHTML = note.value
    if (deadlines[1].checked && deadlineDate.value.length > 0) {
      cell4.innerHTML = deadlineDate.value   
    } else {
      cell4.innerHTML = 'No deadline'
    }
    cell5.appendChild(button)
    button.innerHTML = 'Delete'
    button.value = taskIndex
    button.setAttribute('class', 'btn btn-danger')
    button.addEventListener('click', deleteNote)

    //Finish row by adding cells
    row.appendChild(cell1)
    row.appendChild(cell2)
    row.appendChild(cell3)
    row.appendChild(cell4)
    row.appendChild(cell5)
    taskBody.appendChild(row)
    //Increase taskIndex for next id classification, reset note, refresh task amount and prevent page refresh
    taskIndex++
    note.value = ''
    refreshAmount()
    return false
  }
}

//Refreshes the unfinished and finished task amounts
function refreshAmount() {
  document.getElementById('unfinishedAmount').innerHTML = ` (${unfinishedTaskList.querySelectorAll('tr').length})`
  document.getElementById('finishedAmount').innerHTML = ` (${finishedTaskList.querySelectorAll('tr').length})`
}

//Deletes notes by pressing buttons - refresh task amount
function deleteNote() {  
  if (confirm('Are you sure you want to delete this note?')) {    
    var elemenent = document.getElementById(`task${this.value}`)
    elemenent.parentNode.removeChild(elemenent)
  }
  refreshAmount()
}

//Allows finished task to be grabbed
function allowDrop(event) {
  event.preventDefault()
}

//Allows finished task to be dragged
function drag(event) {
  event.dataTransfer.setData("text", event.target.id)
}

//Dropped task will be added to finished task
function drop(event) {
  //Prevent page refresh on drop and define variable data
  event.preventDefault();
  var data = event.dataTransfer.getData("text")

  //Creates table elements for new table
  var row = document.createElement('tr')
  var cellDate = document.createElement('td')
  var cellTime = document.createElement('td')
  var cellFinished = document.createElement('td')
  
  //Adds dates and times to a row
  cellDate.innerHTML = getDateNow('yearMonthDay')
  cellTime.innerHTML = getDateNow('hourMinute')

  //Adds 'finished' image with new atrributes to a row
  var img = document.createElement('img')
  img.src = 'images/finished.png'
  img.setAttribute('width', '50px')
  cellFinished.appendChild(img)

  //Adds finished cells to a row
  row.appendChild(cellDate)
  row.appendChild(cellTime)
  row.appendChild(document.getElementById(data).querySelectorAll('td')[2])
  row.appendChild(document.getElementById(data).querySelectorAll('td')[2])
  row.appendChild(cellFinished)

  row.classList.add('bgLightBlue')
  document.getElementById('finishedTaskList').appendChild(row)
  document.getElementById(data).parentNode.removeChild(document.getElementById(data))
  refreshAmount()
}

//Used for getting realtime date and time
function getDateNow(time) {
  var date = new Date()
  var day = date.getDate()
  var month = date.getMonth()
  var year = date.getFullYear()
  var minute = date.getMinutes()
  var hour = date.getHours()

  //Adds 0s if needed to beginning of day/month, so it is same value as deadline date
  if (day < 10) {
    day = '0' + day
  }
  if (month < 10) {
    month = '0' + month
  }
  
  //Adds 0s if needed to beginning of minute/hour, so it looks like real time
  if (minute < 10) {
    minute = '0' + minute
  }
  if (hour < 10) {
    hour = '0' + hour
  }
  
  //Returns current date and time
  if (time === 'yearMonthDay') {
    return `${year}-${month}-${day}`
  } else if (time === 'hourMinute') {
    return `${hour}:${minute}`
  } else {
    return null
  }
}