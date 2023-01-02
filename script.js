const fileInput = document.querySelector(".file-input"),
  filterOptions = document.querySelectorAll(".filter button"),
  filterName = document.querySelector(".filter-info .name"),
  filterSlider = document.querySelector(".slider input"),
  filterValue = document.querySelector(".filter-info .value"),
  rotateOptions = document.querySelectorAll(".rotate button"),
  previewImg = document.querySelector(".preview-img img"),
  resetFilterBtn = document.querySelector(".reset-filter"),
  chooseImgBtn = document.querySelector(".choose-img"),
  saveImgBtn = document.querySelector(".save-img");

let brightness = 100,
  saturation = 100,
  inversion = 0,
  grayscale = 0;

let rotate = 0,
  flipHorizontal = 1,
  flipVertical = 1;

const applyFilters = () => {
  previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal},${flipVertical})`;
  previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
};

const loadImage = () => {
  // getting user selected file
  let file = fileInput.files[0];
  // return if user hasn't selected file
  if (!file) return;
  // passing file url as preview img src
  previewImg.src = URL.createObjectURL(file);
  previewImg.addEventListener("load", () => {
    // clicking reset btn, so the filter value reset if the user select new img

    resetFilterBtn.click();
    document.querySelector(".container").classList.remove("disable");
  });
  console.log(file);
};

filterOptions.forEach((option) => {
  // adding click event listener to all filter buttons
  option.addEventListener("click", () => {
    document.querySelector(".filter .active").classList.remove("active");
    option.classList.add("active");
    filterName.innerText = option.innerText;

    if (option.id === "brightness") {
      filterSlider.max = "200";
      filterSlider.value = brightness;
      filterValue.innerText = `${brightness}%`;
    } else if (option.id === "saturation") {
      filterSlider.max = "200";
      filterSlider.value = saturation;
      filterValue.innerText = `${saturation}%`;
    } else if (option.id === "inversion") {
      filterSlider.max = "100";
      filterSlider.value = inversion;
      filterValue.innerText = `${inversion}%`;
    } else {
      filterSlider.max = "100";
      filterSlider.value = grayscale;
      filterValue.innerText = `${grayscale}%`;
    }
  });
  //console.log(option);
});

const updateFilter = () => {
  filterValue.innerText = `${filterSlider.value}%`;
  //getting selected filter button
  const selectedFilter = document.querySelector(".filter .active");

  if (selectedFilter.id === "brightness") {
    brightness = filterSlider.value;
  } else if (selectedFilter.id === "saturation") {
    saturation = filterSlider.value;
  } else if (selectedFilter.id === "inversion") {
    inversion = filterSlider.value;
  } else {
    grayscale = filterSlider.value;
  }

  applyFilters();
};

rotateOptions.forEach((option) => {
  // adding click event listener to all rotate buttons
  option.addEventListener("click", () => {
    if (option.id === "left") {
      // if clicked btn is left rotate, decrement rotate value by -90

      rotate -= 90;
    } else if (option.id === "right") {
      // if clicked btn is right rotate, ikrement rotate value by +90

      rotate += 90;
    } else if (option.id === "horizontal") {
      // if flipHorizontal value is 1, set this value to 1- else set 1
      flipHorizontal = flipHorizontal === 1 ? -1 : 1;
    } else {
      // if flipHorizontal value is 1, set this value to 1- else set 1
      flipVertical = flipVertical === 1 ? -1 : 1;
    }
    applyFilters();
    // console.log(option);
  });
});

//reset filter

const resetFilter = () => {
  //resetting all variable value to its default value

  (brightness = 100), (saturation = 100), (inversion = 0), (grayscale = 0);

  (rotate = 0), (flipHorizontal = 1), (flipVertical = 1);
  //clickingbightness btn, so the brightness selected by default
  filterOptions[0].click();
  applyFilters();
};

//saveImage

const saveImage = () => {
  // creating canvas element
  const canvas = document.createElement("canvas");
  // canvas.getContext return a drawing context on the canvas
  const ctx = canvas.getContext("2d");
  //setting canvas width to actual image width
  canvas.width = previewImg.width;
  // setting canvas height to actual image height
  // console.log(canvas.width);
  canvas.height = previewImg.height;
  // console.log(canvas.height);
  //applying user selected filters to canavas filter
  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
  //translating canvas from center
  ctx.translate(canvas.width / 2, canvas.height / 2);
  if (rotate !== 0) {
    // if rotate value isn't 0, rotate the canvas

    ctx.rotate((rotate * Math.PI) / 180);
  }
  // flip canvas, - horizontally / vertically -
  ctx.scale(flipHorizontal, flipVertical);
  ctx.drawImage(
    previewImg,
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  );
  //creating <a> element
  const link = document.createElement("a");
  //passing <a> tag download value to "image. jpg"
  link.download = "image.jpg";
  // passing <a> tag href value to canvas data url

  link.href = canvas.toDataURL();
  // clicking <a> tag so the image download

  link.click();
};

fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);
chooseImgBtn.addEventListener("click", () => fileInput.click());
