let device = "all";
let sort = "none";
let searchText = "none";
let product;
const SUBMIT_BUTTON = document.querySelector("#find");

fetch("product.json")
  .then((response) => response.json())
  .then((data) => {
    product = data;
  });

const CATEGORY = document.querySelector("#category");
CATEGORY.addEventListener("change", () => {
  device = CATEGORY.options[CATEGORY.selectedIndex].value;
  console.log(device);
});

const SORTING = document.querySelector("#sort");
SORTING.addEventListener("change", () => {
  sort = SORTING.options[SORTING.selectedIndex].value;
  console.log(sort);
});

const SEARCH = document.querySelector("#search");
SEARCH.addEventListener("change", () => {
  searchText = SEARCH.value;
  console.log(searchText);
});

SUBMIT_BUTTON.addEventListener("click", () => {
  document.querySelector(".group").innerHTML = "";
  let filter = product.filter((obj) => {
    if (device === "all") {
      if (searchText === "none") {
        return product;
      } else {
        return obj.name.toLowerCase().includes(searchText.toLowerCase());
      }
    } else {
      if (searchText === "none") {
        return obj.category === device;
      } else {
        return (
          obj.category === device &&
          obj.name.toLowerCase().includes(searchText.toLowerCase())
        );
      }
    }
  });
  if (filter.length === 0) {
    alert("NO SUCH ELEMENTS! PLEASE SEARCH AGAIN");
  } else {
    if (sort == "ascending") {
      sortAscendingOrder(filter);
    } else if (sort == "descending") {
      sortDscendingOrder(filter);
    }
    for (let i = 0; i < filter.length; i++) {
      createImgBox(
        filter[i].name,
        filter[i].imgsrc,
        filter[i].price,
        filter[i].category
      );
    }
  }
});

function sortAscendingOrder(data) {
  data.sort(function (a, b) {
    if (a.pirce > b.price) {
      return 1;
    }
    if (a.price < b.price) {
      return -1;
    }
    return 0;
  });
}

function sortDscendingOrder(data) {
  data.sort(function (a, b) {
    if (a.pirce < b.price) {
      return 1;
    }
    if (a.price > b.price) {
      return -1;
    }
    return 0;
  });
}

function createImgBox(title, imgsrc, price, alternative) {
  const imgElement = `<div class="imgbox" onclick='changeStyle()'>
                        <img
                          class="Device"
                          src=${imgsrc}
                          alt=${alternative}
                        />
                        <div class="overlay">
                          <div class="text">${title}</div>
                          <div class="price">${price}&#36;</div>
                        </div>
                      </div>`;

  document.querySelector(".group").innerHTML += imgElement;
}

