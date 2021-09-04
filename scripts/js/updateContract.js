setTimeout(() => {
  const contract = document.querySelector("[name=contract]");

  contract.addEventListener("blur", function (ev) {
    if (ev.target.value !== "") {
      /*fetch(`/checkContract`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contract: ev.target.value }),
      })
        .then((response) => response.json())
        .then((data) => {
          document.querySelector("[name=name]").value = data;
        });*/
      try {
        fetch(`https://api1.poocoin.app/tokens?search=${ev.target.value}`, {
          //mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            document.querySelector("[name=name]").value = data[0]
              ? `${data[0].name} (${data[0].symbol})`
              : "";
          });
      } catch (err) {
        return;
      }
    }
  });
}, 500);
