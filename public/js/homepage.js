const setRemindersButton = document.getElementById("setRemindersBtn");

if (setRemindersButton) {
  setRemindersButton.addEventListener("click", function () {
    window.location.href = "/reminders";
  });
}