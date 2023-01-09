function isNumeric(str) {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

function formatPhoneNumber(phone, country_code) {
  if (phone.startsWith("+")) {
    return phone;
  }
  if (phone.startsWith("00")) {
    return "+" + phone.slice(2);
  }
  if (phone.startsWith("0")) {
    phone = phone.slice(1);
  }
  return "+" + country_code + phone;
}

function forbidNonNumeric(event) {
  // Get the character that was entered
  const char = event.key;

  // Check if the character is not a digit (0-9)
  if (!/[0-9]/.test(char)) {
    // If it is not a digit, prevent the character from being entered
    event.preventDefault();
  }
}
const form = document.getElementById("countrycode-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  let countrycode = document.getElementById("countrycode").value;
  countrycode = countrycode.replace(/\D/g, "");
  countrycode = parseInt(countrycode);

  localStorage.setItem("countrycode", countrycode);
});

const inputField = document.getElementById("countrycode");
document.getElementById("countrycode").value =
  localStorage.getItem("countrycode");

inputField.addEventListener("input", forbidNonNumeric);

if (navigator.clipboard !== undefined) {
  const country_code = localStorage.getItem("countrycode");
  if (country_code) {
    (async () => {
      try {
        console.log("start");
        const text = await navigator.clipboard.readText();

        let phone = text.trim();
        console.log(`phone is: ${phone}`);
        if (isNumeric(phone)) {
          console.log(`numeric phone: ${phone}`);
          phone = formatPhoneNumber(phone, country_code);
          if (phone !== 0) {
            console.log(`valid phone: ${phone}`);
            const url = `https://wa.me/${phone}`;
            console.log(url);
            window.open(url);
          }
        }
      } catch (err) {
        console.error("Could not read from clipboard", err);
      }
    })();
  }
}
