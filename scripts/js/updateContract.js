setTimeout(() => {
  const contract = document.querySelector("[name=contract]");

  contract.addEventListener("blur", function (ev) {
    if (ev.target.value !== "") {
      fetch(`/checkContract`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contract: ev.target.value }),
      })
        .then((response) => response.json())
        .then((data) => {
          document.querySelector("[name=name]").value = data;
        });
    }
  });
}, 500);
