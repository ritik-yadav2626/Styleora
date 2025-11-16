function handleSubmit(event) {
  event.preventDefault(); // stop normal form submit

  // get values
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  // check if all fields filled
  if (name && email && message) {
    alert("Thank you for contacting us!");
    // you can reset form if you want
     location.reload();
  } else {
    // show built-in validation messages
    event.target.reportValidity();
  }

  return false; // stop page reload
}