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
      }

      showInit(finalGroup);
    }

    showInit(data);
    document.querySelector("#find").onclick = selectCategory;

    function showInit(product) {
      finalGroup = product;
      for (let i = 0; i < 4; i++) {
        if (i < product.length) {
          const IMGBOX = document.createElement("div");
          const IMG = document.createElement("img");

          IMGBOX.setAttribute("class", "imgbox");
          IMG.setAttribute("class", "Device");
          IMG.src = product[i].product_image;
          IMG.alt = product[i].product_title;

          IMGBOX.addEventListener("click", newpage);

          group.appendChild(IMGBOX);
          IMGBOX.appendChild(IMG);
        }
        function newpage() {
          window.location.href = "./product/:" + product[i].product_id;
        }
      }
    }
    window.onscroll = function scroll() {
      if (
        window.scrollY + window.innerHeight >=
        document.body.offsetHeight
        // document.documentElement.scrollHeight
      ) {
        let showedItemNum = document.querySelector(".group").childElementCount;
        let newProduct = finalGroup.slice(showedItemNum);
        for (let i = 0; i < 4; i++) {
          if (i < newProduct.length) {
            const IMGBOX = document.createElement("div");
            const IMG = document.createElement("img");

            IMGBOX.setAttribute("class", "imgbox");
            IMG.setAttribute("class", "Device");
            IMG.src = newProduct[i].product_image;
            IMG.alt = newProduct[i].product_title;

            IMGBOX.addEventListener("click", newpage);

            document.querySelector(".group").appendChild(IMGBOX);
            IMGBOX.appendChild(IMG);
          }
          // When click the product, then it will linking to page which introduce detail baout the product.
          function newpage() {
            window.location.href = "./product/:" + newProduct[i].product_id;
          }
        }
      }
    };
  }
}
