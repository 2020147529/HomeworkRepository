// get data from product.db in json file format.
let db = JSON.parse(document.getElementById("dbdata").value);

// After loading page initializing function started
document.addEventListener(
  "DOMContentLoaded",
  () => {
    start(db);
  },
  false
);

function start(data) {
  var product = data;
  init(data);
  function init(product) {
    const category = document.querySelector("#category");
    const searchTerm = document.querySelector("#searchTerm");
    const searchBtn = document.querySelector("#find");
    const group = document.querySelector(".group");
    const sorting = document.querySelector("#sort");

    let lastCategory = category.value;
    let lastSearch = "";
    let lastSorting = sorting.value;

    let categoryGroup;
    let finalGroup;

    finalGroup = product;

    categoryGroup = [];
    finalGroup = [];

    searchBtn.addEventListener("click", selectCategory);

    // Select cateogry of the option selected by <select> element
    function selectCategory() {
      lastCategory = category.value;
      lastSearch = searchTerm.value.trim();
      lastSorting = sorting.value;
      if (category.value === "All") {
        categoryGroup = product;
        selectproduct();
      } else {
        const lowerCaseType = category.value.toLowerCase();

        categoryGroup = product.filter(
          (product) => product.product_category === lowerCaseType
        );
        selectproduct();
      }
    }

    function selectproduct() {
      if (searchTerm.value.trim() === "") {
        finalGroup = categoryGroup;
      } else {
        // filtered products by using user input from text field
        finalGroup = categoryGroup.filter((product) => {
          return product.product_title
            .toLowerCase()
            .includes(lowerCaseSearchTerm);
        });
      }

      sortingproduct();
    }

    // Sorting product
    function sortingproduct() {
      let totalNum = 0;
      if (sorting.value !== "") {
        if (lastSorting === "ascending") {
          finalGroup = finalGroup.sort((a, b) => {
            return a.product_price - b.product_price;
          });
        } else if (lastSorting == "descending") {
          finalGroup = finalGroup.sort((a, b) => {
            return b.product_price - a.product_price;
          });
        }
      }

      // remove all elements searched before
      while (group.firstChild) {
        group.removeChild(group.firstChild);
      }

      // There is no element of final filtered array.
      if (finalGroup.length === 0) {
        const para = document.createElement("p");
        para.setAttribute("class", "noresult");
        para.textContent = "No results to display!";
        group.appendChild(para);
        // for each product we want to display, pass its product object to fetchBlob()
      } else {
        load();
        overlayStyleChange();
        // infinite scroll
        window.addEventListener("scroll", function scroll() {
          if (
            window.scrollY + window.innerHeight >=
            document.documentElement.scrollHeight
          ) {
            load();
            overlayStyleChange();
          }
        });

        function load(loadNum = 4) {
          for (let i = 0; i < loadNum; i++) {
            if (totalNum < finalGroup.length) {
              createImgBox(
                finalGroup[totalNum].product_title,
                finalGroup[totalNum].product_image,
                finalGroup[totalNum].product_price,
                finalGroup[totalNum].product_category
              );
              totalNum++;
            }
          }
        }
      }
      // first loading the image and display it
      // we should display items at first without scroll event
    }

    function fetchBlob(product) {
      // construct the URL path to the image file from the product.image property
      const url = `${product.product_image}`;
      // Use fetch to fetch the image, and convert the resulting response to a blob
      // Again, if any errors occur we report them in the console.
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
          }
          return response.blob();
        })
        .then((blob) => showProduct(blob, product))
        .then(() => overlayStyleChange())
        .catch((err) => console.error(`Fetch problem: ${err.message}`));
    }

    function showProduct(blob, product) {
      // Convert the blob to an object URL — this is basically an temporary internal URL
      // that points to an object stored inside the browser
      const objectURL = URL.createObjectURL(blob);
      // create <section>, <h2>, <p>, and <img> elements
      createImgBox(
        product.product_title,
        objectURL,
        product.product_price,
        product.product_category
      );
    }

    // Creating image element zone
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
      group.innerHTML += imgElement;
    }

    function overlayStyleChange() {
      const OVERLAYS = document.querySelectorAll(".overlay");
      OVERLAYS.forEach((overlay) => {
        overlay.addEventListener("click", function click() {
          overlay.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
          overlay.style.fontSize = "14px";
          overlay.style.opacity = "1";
          overlay.style.color = "#ffc300";
        });
      });
    }
  }
}
