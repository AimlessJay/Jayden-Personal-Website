const feedbackForm = document.getElementById("feedback_sizer")
const feedBtn = document.getElementById("feedbackBtn")
let hidden = true

function toggle() {
    if (hidden === true) {
      feedbackForm.style.display = "flex"
      hidden = false
    } else {
      feedbackForm.style.display = "none"
      hidden = true
    }
}

const fails = document.getElementById("Failed")
