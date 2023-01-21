function isNumeric(str) {
  if (typeof str != "string") return false; // only process strings

  if (str.length < 8) {
    return false;
  }
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

function formatPhoneNumber(phone, country_code) {
  phone = phone.replace(/[^\d+]/g, "");
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

const help = document.getElementById("help-button");
const popup = document.getElementById("popup");
const closeBtn = document.getElementById("closeBtn");

help.addEventListener("click", () => {
  popup.style.display = "block";
});
closeBtn.addEventListener("click", () => {
  popup.style.display = "none";
});
popup.addEventListener("click", () => {
  popup.style.display = "none";
});

const db = new Dexie("phone_countrycodes");
db.version(1).stores({
  countrycodes: `countrycode`,
});
db.open().catch(function (err) {
  console.error(err.stack || err);
});
let arr = await db.countrycodes.toArray();
let country_code;
if (arr && arr.length) {
  country_code = arr[0].countrycode;
  document.getElementById("countrycode").value = country_code;
}
if (navigator.clipboard !== undefined) {
  if (country_code) {
    try {
      navigator.clipboard
        .readText()
        .then((text) => {
          let phone = text.trim();
          phone = formatPhoneNumber(phone, country_code);
          if (isNumeric(phone)) {
            const url = `https://wa.me/${phone}`;
            window.open(url);
          }
        })
        .catch((err) => {
          console.error("Failed to read clipboard: ", err);
        });
    } catch (e) {
      console.log(`This browser doesn't support reading from clipboard ${e}`);
    }
  }
}

const form = document.getElementById("countrycode-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  let countrycode = document.getElementById("countrycode").value;

  if (countrycode.length > 6) {
    let phone = countrycode;
    phone = formatPhoneNumber(phone, country_code);
    if (isNumeric(phone)) {
      const url = `https://wa.me/${phone}`;
      window.open(url);
    }
    return;
  }

  countrycode = countrycode.replace(/\D/g, "");
  countrycode = parseInt(countrycode);
  db.countrycodes.clear().then(function (result) {
    db.countrycodes
      .put({ countrycode: countrycode })
      .then(function () {
        document.getElementById("help-button").style.display = "none";

        document.getElementById("confirmation").style.display = "block";

        setTimeout(function () {
          document.getElementById("confirmation").style.display = "none";
          document.getElementById("help-button").style.display = "block";
        }, 3000);
      })
      .catch(function (error) {
        // This code is called if reject() was called in the Promise constructor, or
        // if an exception was thrown in either constructor or previous then() call.
        console.log(`error: ${error}`);
      });
  });
});
