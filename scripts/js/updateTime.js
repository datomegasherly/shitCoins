setTimeout(() => {
  window.location.reload();
}, 1000 * 60);

setTimeout(() => {
  const cbox = document.querySelectorAll(".delete-btn");
  const ebox = document.querySelectorAll(".edit-btn");
  const searchBtn = document.querySelector(".search_button");

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
  for (let i = 0; i < ebox.length; i++) {
    ebox[i].addEventListener("click", function (ev) {
      window.location.pathname = `/create/${ev.target.id}`;
      return;
    });
  }
  searchBtn.addEventListener("click", function (ev) {
    const search = document.querySelector("input[name=search]").value;
    if (search === "") {
      window.location.pathname = `/`;
      return;
    }
    window.location.pathname = `/search/${search}`;
  });
}, 500);
