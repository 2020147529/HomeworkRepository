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
  window.removeEventListener("scroll", scroll);
  device = CATEGORY.options[CATEGORY.selectedIndex].value;
  console.log(device);
});

const SORTING = document.querySelector("#sort");
SORTING.addEventListener("change", () => {
  window.removeEventListener("scroll", scroll);
  sort = SORTING.options[SORTING.selectedIndex].value;
  console.log(sort);
});

const SEARCH = document.querySelector("#search");
SEARCH.addEventListener("change", () => {
  window.removeEventListener("scroll", scroll);
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
      filter = filter.sort((a, b) => {
        return a.price - b.price;
      });
    } else if (sort == "descending") {
      filter = filter.sort((a, b) => {
        return b.price - a.price;
      });
    }
    // onscroll function
    // display 4 each element when user scroll and its height + window.inner height is bigger then document's height
    let totalNum = 0;
    function load(loadNum = 4) {
      for (let i = 0; i < loadNum; i++) {
        if (totalNum < filter.length) {
          createImgBox(
            filter[totalNum].name,
            filter[totalNum].imgsrc,
            filter[totalNum].price,
            filter[totalNum].category
          );
          totalNum++;
        }
      }
    }
    // first loading the image and display it
    // we should display items at first without scroll event
    load();
    window.addEventListener("scroll", function scroll() {
      if (
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight
      ) {
        load();
      }
    });
  }
});

function createImgBox(title, imgsrc, price, alternative) {
  const imgElement = `<div class="imgbox">
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
