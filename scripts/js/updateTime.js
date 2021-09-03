setTimeout(() => {
  window.location.reload();
}, 1000 * 60);

setTimeout(() => {
  const cbox = document.querySelectorAll(".delete-btn");

  for (let i = 0; i < cbox.length; i++) {
    cbox[i].addEventListener("click", function (ev) {
      const r = confirm("Are you sure?");
      if (r == true) {
        fetch(`delete`, {
          method: "POST",
          body: JSON.stringify({ id: ev.target.id }),
        })
          .then((response) => response.json())
          .then((data) => {
            alert("Delete successfully");
            window.location.reload();
          });
      }
    });
  }
}, 500);
