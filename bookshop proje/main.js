let bookList = []
let basketList = []
//toggle menu
const toggleModal = () => {
    const basketModal = document.querySelector(".basket__modal");
    basketModal.classList.toggle("active");
};

const getBooks = () => {
    fetch("./products.json")
    .then((res) => res.json())
    .then((books) => (bookList = books))
    .catch((err) => console.log(err));

};
getBooks();
//dinamik yildizlar olusturduk
const createBookStars = (starRate) => {
    let starRateHtml ="";
    for (let i = 1;i <=5;i++){
        if(Math.round(starRate) >= i ){
            starRateHtml +=`
             <i class="bi bi-star-fill active"></i> `;
        } else{
            starRateHtml += ` <i class="bi bi-star-fill"></i>`;
        }
    }
    return starRateHtml;
}

//html olusturduk ve bunun icersiine kitaplarimizi gonderdik
const createBookItemsHtml = () =>{
    const bookListEl = document.querySelector(".book__list");
    let bookListHtml = "";

    bookList.forEach((book,index)=> {
        console.log(book);
      bookListHtml +=`
        <div class="col-5  ${index % 2 == 0 && "offset-2"} my-5">
            <div class="row book__card">
                <div class="col-6">
                    <img src="${book.imgSource}" alt=""
                     class="img-fluid shadow" 
                     width="258px"
                      height="400px">
                </div>
                <div class="col-6 d-flex flex-column justify-content-center gap-4">
                    <div class="book__detail">
                        <span class="fos gray fs-5">${book.author}</span><br>
                        <span class="fs-4 fw-bold">${book.name}/span><br>
                        <span class="book__star-rate">
                         ${createBookStars(book.starRate)}  
                        </span>
                        <span class="gray">1938 reviews</span>
                    </div>
                    <p class="book__description fos gray">
                       ${book.description}
                    </p>
                    <div>
                        <span class="black fw-bold fs-4 me-2">${book.price}TL</span>
                        <span class="fs-4 fw-bold old__price">${book.oldPrice ? ` 
                            <span class="fs-4 fw-bold old__price">${book.oldPrice} TL</span>`:""}</span>
                        <button class="btn__purple" onClick="addBookToBasket(${book.id})">Sepete ekle</button>
                    </div>
                </div>
            </div>
        </div>
      `;
    });
    bookListEl.innerHTML = bookListHtml;

};

const BOOK_TYPES ={
    ALL:"Tumu",
    NOVEL:"Roman",
    CHILDREN:"Cocuk",
    HISTORY:"Tarih",
    FINANCE:"Finans",
    SELFIMPROVEMENT:"Kisisel gelisim",
    SCIENCE:"Bilim",

};
const createBookTypesHtml = () => {
    const filterEle = document.querySelector(".filter");
    let filterHtml = "";
    //filtre turlerini tutacak dizi "all" turuyle baslatilmistir
    let filterTypes = ["ALL"];
   bookList.forEach(book=>{
    //eger filtre turleri dizisinde bu tur bulunmuyorsa ekleme islemi yapar
   if (filterTypes.findIndex((filter) => filter ==  book.type) == -1){
    filterTypes.push(book.type);
   } 
});
   filterTypes.forEach((type,index) =>{
    filterHtml += ` <li onClick="filterBooks (this)" data-types=${type} class="${index == 0 ? "active" : null}" >${BOOK_TYPES[type] || type}</li>`
   })
   
   filterEle.innerHTML = filterHtml
};
const filterBooks = (filterEl) =>{
document.querySelector(".filter .active").classList.remove("active")
filterEl.classList.add("active");
let bookType = filterEl.dataset.types;

getBooks()
if(bookType != "ALL"){
    bookList = bookList.filter((book) => book.type == bookType);
    
}
createBookItemsHtml();
};
const listBasketItems = () => {
    const basketListEl = document.querySelector(".basket__list");
    const basketCountEl = document.querySelector(".basket__count");
    console.log(basketList);
    const totalQuantity = basketList.reduce(
      (total, item) => total + item.quantity,
      0
    );
    basketCountEl.innerHTML = totalQuantity > 0 ? totalQuantity : null;
    const totalPriceEl = document.querySelector(".total__price");
    console.log(totalPriceEl);
    let basketListHtml = "";
    let totalPrice = 0;
    basketList.forEach((item) => {
      //console.log(item);
      totalPrice += item.product.price * item.quantity;
      basketListHtml += `
      <li class="basket__item">
      <img
        src="${item.product.imgSource}"
        alt=""
        width="100"
        height="100"
      />
      <div class="basket__item-info">
        <h3 class="book__name">${item.product.name}</h3>
        <span class="book__price">${item.product.price}tl</span> <br />
        <span class="book__remove" onClick="removeItemBasket(${item.product.id})">Sepetten Kaldır</span>
      </div>
      <div class="book__count">
        <span class="decrease" onClick="decreaseItemToBasket(${item.product.id})">-</span>
        <span class="mx-2">${item.quantity}</span>
        <span class="increase" onClick="increaseItemToBasket(${item.product.id})">+</span>
      </div>
    </li>
      
      `;
    });
    basketListEl.innerHTML = basketListHtml
      ? basketListHtml
      : `<li class="basket__item">Sepette herhangi bir ürün bulunmuyor.Sepete ürün ekleyiniz.</li>`;
    totalPriceEl.innerHTML = totalPrice > 0 ? "Total:" + totalPrice + "tl" : null;
  };
  //sepete urun ekleme
const addBookToBasket = (bookId) => {
    // console.log(bookId);
    let findedBook = bookList.find((book) => book.id == bookId);
    // console.log(findedBook);
    if (findedBook) {
      // sepetteki ürünün zaten var olup olmadığını kontrol ettik
      const basketAlreadyIndex = basketList.findIndex(
        (basket) => basket.product.id == bookId
      );
      // eğer sepet boşsa veya eklenen kitap sepette yoksa
      if (basketAlreadyIndex == -1) {
        let addItem = { quantity: 1, product: findedBook };
        basketList.push(addItem);
      } else {
        // sepette zaten var olan bir kitap ekleniyorsa, miktarını arttır
        basketList[basketAlreadyIndex].quantity += 1;
        // console.log(basketList);
      }
    }
    const btnCheck = document.querySelector(".btnCheck");
    btnCheck.style.display = "block";
    //sepet icerigin guncelle ve goruntule
    listBasketItems();
};
//sepetten urunu kaldirir
const removeItemBasket = (bookId) =>{
  const findIndex =  basketList.findIndex((basket) => basket.product.id == bookId
);
//eger kitap sepet icinde bulunuyorsa
if (findIndex != -1){
    //splice i belirli sayida eleman silmek icin kullandik
    //sepet listesinden kitabi cikar
    basketList.splice(findIndex,1)
}
const btnCheck = document.querySelector(".btnCheck");
    btnCheck.style.display = "none";
//sepet icerigini gunceller
listBasketItems()
}
//sepetteki urunun miktarini azaltma
const decreaseItemToBasket =(bookId) => {
  const findIndex =  basketList.findIndex((basket) => basket.product.id == bookId
);
//eger ki kitap sepet icinde bulunuyorsa
if(findIndex != -1){
    //egerki kitabin miktari 1'den buyukse
    if(basketList [findIndex].quantity != 1){
        basketList[findIndex].quantity -= 1;
    }else{
        removeItemBasket(bookId);
    }
    listBasketItems();
}

//sepet icerigini guncelle
listBasketItems()
}
//sepetteki urunun miktarini cogaltma
const increaseItemToBasket = (bookId) => {
 const findIndex = basketList.findIndex((basket) => basket.product.id == bookId
);
//eger kitap sepet icinde bulunuyorsa
if(findIndex != -1){
    //kitabin miktarini 1 arttir
    basketList[findIndex].quantity += 1;
}
//sepet icerigini guncelledik
listBasketItems()
}




//datanin gelmesini bekledik
setTimeout(() => {
    createBookItemsHtml();
    createBookTypesHtml();

},100);
