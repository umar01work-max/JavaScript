const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const form = document.querySelector("form");
const amountInput = document.querySelector(".amount input");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (const select of dropdowns) {
  for (const currCode in countryList) {
    const newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "PKR") {
      newOption.selected = true;
    }
    select.append(newOption);
  }

  select.addEventListener("change", (event) => {
    updateFlag(event.target);
  });
}

const updateExchangeRate = async () => {
  const amount = Number(amountInput.value);
  if (!Number.isFinite(amount) || amount <= 0) {
    msg.innerText = "Enter an amount greater than 0.";
    amountInput.focus();
    return;
  }

  const fromCode = fromCurr.value.toLowerCase();
  const toCode = toCurr.value.toLowerCase();
  const url = `${BASE_URL}/${fromCode}.json`;
  msg.innerText = "Getting exchange rate...";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Exchange-rate request failed (${response.status}).`);
    }

    const data = await response.json();
    const rate = data[fromCode]?.[toCode];
    if (typeof rate !== "number" || !Number.isFinite(rate)) {
      throw new Error(`The rate for ${fromCurr.value} to ${toCurr.value} is unavailable.`);
    }

    const convertedAmount = (amount * rate).toLocaleString(undefined, {
      maximumFractionDigits: 6,
    });
    msg.innerText = `${amount} ${fromCurr.value} = ${convertedAmount} ${toCurr.value}`;
  } catch (error) {
    msg.innerText = "Could not get the exchange rate. Check your internet connection and try again.";
    console.error(error);
  }
};

const updateFlag = (element) => {
  const currCode = element.value;
  const countryCode = countryList[currCode];
  const newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  const img = element.parentElement.querySelector("img");
  img.src = newSrc;
  img.alt = `${countryCode} flag`;
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});