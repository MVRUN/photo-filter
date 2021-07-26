const fullScreenBtn = document.querySelector('.fullscreen');
const inputs = document.querySelectorAll('.filters input');
const resetBtn = document.querySelector('.btn-reset');
const loadBtn = document.querySelector('.btn-load input');
const nextBtn = document.querySelector('.btn-next');
const saveBtn = document.querySelector('.btn-save');
const image = document.querySelector('.editor img');
const allBtn = document.querySelectorAll('.btn');
let countImage = 1;
let timeOfDay;
let obj = {
  blur: '0px',
  invert: '0%',
  sepia: '0%',
  saturate: '100%',
  hue: '0deg'
}
//Скачивание картинки картинки//////////////////////////////////////////////////////////////////////////////////////
function savePicture() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext('2d');
    const img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.src = image.src;
    img.addEventListener('load', () => {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      context.filter = `blur(${obj.blur}) invert(${obj.invert}) sepia(${obj.sepia}) saturate(${obj.saturate}) hue-rotate(${obj.hue})`;
      context.drawImage(img, 0, 0);

      const dataURL = canvas.toDataURL("image/png");
      let link = document.createElement("a");
      link.download = "image.png";
      link.href = dataURL;
      link.click();
      link.delete;
      });
}
saveBtn.addEventListener("click", savePicture);
saveBtn.addEventListener("click", function () {
    allBtn.forEach(btn => btn.classList.remove('btn-active'));
    saveBtn.classList.add('btn-active');
   } 
);
//Загрузка следующей картинки//////////////////////////////////////////////////////////////////////////////////////
function nextPicture() {
    //Определение времени суток
    let date = new Date
    let time = date.getHours();
    if(time >= 6 && time <=11) {
        timeOfDay = "morning";
    }
    else if (time >= 12 && time <=17) {
        timeOfDay = "day";
    }
    else if (time >= 18 && time <=23) {
        timeOfDay = "evening";
    }
    else if (time >= 0 && time <=5) {
        timeOfDay = "night";
    }
    //Замена картинок согласно времени суток и номера
    if(countImage < 10) {
        image.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/0${countImage}.jpg`;
    }
    else {
        image.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${countImage}.jpg`;
        if(countImage === 20) {
            countImage = 0;
        }
    }
    countImage++;
    allBtn.forEach(btn => btn.classList.remove('btn-active'));
    nextBtn.classList.add('btn-active')
}
nextBtn.addEventListener("click", nextPicture);
//Смена полноэкранного режима и стиля кнопки///////////////////////////////////////////////////////////////
const toggleFullScreen = (event) => {
    if (document.fullscreenElement === null) {
        event.target.classList.add('openfullscreen');
        document.documentElement.requestFullscreen();
    }
    else {
        event.target.classList.remove('openfullscreen');
        document.exitFullscreen();
    }
}
fullScreenBtn.addEventListener('click', toggleFullScreen);
//Работа с  фильтрами/////////////////////////////////////////////////////////////////////////////////////////////
function handleUpdate() {
    const suffix = this.dataset.sizing;
    document.documentElement.style.setProperty(`--${this.name}`,this.value + suffix);
    this.closest("label").querySelector('output').innerHTML = this.value;
    for(key in obj) {
        if(key === this.name) {
            obj[key] = document.documentElement.style.getPropertyValue(`--${this.name}`);
        }
    }
}
inputs.forEach(input => input.addEventListener("mousemove", handleUpdate));
inputs.forEach(input => input.addEventListener("change", handleUpdate));
//Сброс фильтров///////////////////////////////////////////////////////////////////////////////////////////////////
function resetFilters() {
    inputs.forEach(input => {
        input.value = 0;
        if(input.name === "saturate") {input.value = 100};
        document.documentElement.style.removeProperty(`--${input.name}`);//Удаление эффектов с фотогорафии(удаление стилей с рута)
        input.closest("label").querySelector('output').innerHTML = input.value;//сброс до стартовых value полей значений фильтров
        for(key in obj) {
            if(key === input.name) {
                obj[key] = input.value + input.dataset.sizing;
            }
        }
    })
    allBtn.forEach(btn => btn.classList.remove('btn-active'));
    resetBtn.classList.add('btn-active')  
}
resetBtn.addEventListener("click", resetFilters);
//Загрузка картинки
function loadPicture() {
    let reader = new FileReader();
    reader.readAsDataURL(this.files[0]);
    reader.onload = function() {
        image.src = reader.result;
    }
    this.value = '';
}
loadBtn.addEventListener("change", loadPicture);
loadBtn.addEventListener("click", function () {
     allBtn.forEach(btn => btn.classList.remove('btn-active'));
     loadBtn.closest('label').classList.add('btn-active');
});