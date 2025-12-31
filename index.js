const channel = new Map([
  [1, "BBC"],
  [2, "NBA"],
  [3, "HBO"],
  [4, "National Geographic"],
  [5, "Fox"],
]);
class Electricity {
  constructor(displayElement) {
    this.generalEl = 0;
    this.load = 0;
    this.displayElement = displayElement;
  }
  updateGeneralTextView(){
      if(this.displayElement){
          this.displayElement.textContent=this.generalEl;
      }
  }
  get generalElectricity() {
    return this.generalEl;
  }
  addConsumption(Power) {
    this.generalEl += Power;
    this.changeLoad();
    this.updateGeneralTextView();
    return this.generalEl;

  }
  removeConsumption(Power) {
    this.generalEl -= Power;
    this.changeLoad();
    this.updateGeneralTextView();
    return this.generalEl;
  }
  changeLoad() {
    switch (true) {
      case this.generalEl === 0:
        this.load = 0;
        break;
      case this.generalEl <= 1500:
        this.load = 1;
        break;
      case this.generalEl < 2500:
        this.load = 2;
        break;
      case this.generalEl > 2500:
        this.load = 3;
        break;
    }
  }
  get currentLoad() {
    return this.load;
  }
}
class Device {
  constructor(name, power, room, houseMeter) {
    this.name = name;
    this.power = 0;
    this.room = room;
    this.isOn = false;
    this.basePower=power;
    this.houseMeter = houseMeter;
    this.element = null;
  }
  renderDevice(){
      const div = document.createElement('div');
      div.classList.add('device');
      div.innerHTML = `
            <div class="device__remove">
                <img class="device__remove-icon" src="cross.png" alt="cross icon" />
            </div>
            <div class="device__header">
                <p class="device__name"><strong>${this.name}</strong></p>
                <hr class="device__divider" />
             </div>
            <div class="device__info">
                <p class="device__power">Power: <span class="device__power-value">0</span>W</p>
                <p class="device__room">Room: ${this.room}</p>
            </div>
            <div class="device__status">
                <button class="device__power-button" style="background-color: red;">OFF</button>
            </div>
        `;
      this.element = div;
      const btn = div.querySelector('.device__power-button');
      btn.addEventListener('click', () => {
          this.changeDeviceStatus();
          this.updateView(); // Оновити вигляд саме цієї картки
      });
      return div;
  }
  updateView(){
      if (!this.element) return;
      const powerSpan = this.element.querySelector('.device__power-value');
      const btn = this.element.querySelector('.device__power-button');
      powerSpan.textContent = this.power;
      if (this.isOn) {
          btn.style.backgroundColor = "green";
          btn.textContent = "ON";
      } else {
          btn.style.backgroundColor = "red";
          btn.textContent = "OFF";
      }
  }
  changeDeviceStatus() {
    this.isOn = !this.isOn;
    if (this.isOn) {
        this.power=this.basePower;
      this.houseMeter.addConsumption(this.power);
    } else{
        this.houseMeter.removeConsumption(this.power);
        this.power=0;
    }
    return this.isOn;
  }
  get genElectricity() {
    return this.houseMeter.generalElectricity;
  }
  get currentLoad() {
    return this.houseMeter.currentLoad;
  }
  get currentPower(){
      return this.power;
  }
}
class SmartTv extends Device {
  constructor(name, power, room, houseMeter) {
    //ЧИ ПОТРІБНЕ NAME, чи клас буде називатись цим ім'ям
    super(name, power, room, houseMeter);
    this.volume = 75;
    this.channel = channel.get(1);
  }
  get currentChannel() {
    return this.channel;
  }
  get currentVolume() {
    return this.volume;
  }
  changeVolume(bool) {
    bool ? this.volume++ : this.volume--;
    return this.currentVolume;
  }
  changeChannel(bool) {
    for (let i = 1; i <= channel.size; i++) {
      if (channel.get(i) === this.channel) {
        if (bool) {
          if (i !== channel.size) {
            return (this.channel = channel.get(i + 1));
          } else return (this.channel = channel.get(1));
        } else {
          if (i !== 1) {
            return (this.channel = channel.get(i - 1));
          } else return (this.channel = channel.get(channel.size));
        }
      }
    }
  }
}
class Freezer extends Device {
  constructor(name, power, room, houseMeter) {
    super(name, power, room, houseMeter);
    this.temperature = 5;
    // this.basePower=power;
  }
  get currentTemperature() {
    return this.temperature;
  }
  changeTemperature(value) {
    if (!this.isOn) {
      return this.temperature;
    }
    this.houseMeter.removeConsumption(this.power);
    if (value === 4 || value === 3) {
      this.power = Math.floor(this.power + this.basePower * 0.15);
    } else if (value === 2 || value === 1) {
      this.power = Math.floor(this.power + this.basePower * 0.3);
    } else if (value >= 5) {
      this.power = this.basePower;
    }
    this.houseMeter.addConsumption(this.power);
    return (this.temperature = value);
  }
}
class Lightning extends Device {
    constructor(name, power, room, houseMeter) {
        super(name, power, room, houseMeter);
        this.brightness = 0;
        this.basePower=power;
        // this.btnRef=buttonElement;
    }
    render(){
        const deviceCard = super.renderDevice();
        const brightnessContainer = document.createElement('div');
        brightnessContainer.classList.add('device__details');
        brightnessContainer.innerHTML = `
            <p>Brightness: <span class="bright-val">${this.brightness}</span>%</p>
            <input type="range" class="bright-range" min="0" max="100" value="${this.brightness}">
        `;
        const infoBlock = deviceCard.querySelector('.device__info');
        infoBlock.appendChild(brightnessContainer);
        const range = brightnessContainer.querySelector('.bright-range');
        range.addEventListener('input', (e) => {
            this.changeBrightness(parseInt(e.target.value));
            this.updateView();
        });
        return deviceCard;
    }
    updateView(){
        super.updateView();
        if (!this.element) return;
        const brightSpan = this.element.querySelector('.bright-val');
        const range = this.element.querySelector('.bright-range');

        if (brightSpan) brightSpan.textContent = this.brightness;
        if (range) range.value = this.brightness
    }
    // updateButtonView() {
    //     if (this.btnRef) {
    //         if (this.isOn) {
    //             this.btnRef.style.backgroundColor = "green"; // Або ваш клас для увімкнення
    //             this.btnRef.textContent = "ON"; // Опціонально
    //         } else {
    //             this.btnRef.style.backgroundColor = "red"; // Або ваш клас для вимкнення
    //             this.btnRef.textContent = "OFF"; // Опціонально
    //         }
    //     }
    // }
    get currentBrightness() {
        return this.brightness;
    }
    changeDeviceStatus(){
        if(!this.isOn) {
            if(this.brightness ===0) {
                this.brightness = 1;
            }
            this.power = this.basePower;
            this.power = this.basePower;
            this.isOn = true; // Просто присвоюємо true, так надійніше ніж !this.isOn
            this.houseMeter.addConsumption(this.power);
        } else {
            this.houseMeter.removeConsumption(this.power);
            this.brightness = 0;
            this.power = 0;
            this.isOn = false;
        }
        this.updateView();
        return this.isOn;
    }
    changeBrightness(value) {
        if (this.isOn) {
            if(value===0){
                this.changeDeviceStatus();
            }
            return this.brightness=value;
        } else {
            if(value===0){
                return this.brightness=value;

            }
            this.brightness=value;
            this.changeDeviceStatus()
            return this.brightness;
        }

    }
    get currentStatus(){
        return this.isOn;
    }
}
const generalEl = document.getElementById("general-power-value");
const buttEl= document.getElementsByClassName("device__power-button")[0]
const powerEl = document.getElementsByClassName("device__power-value")[0]
const infoEl = document.getElementsByClassName("device__details-value")[0]
const inputEl= document.getElementsByClassName("device__details-range")[0]

const addDeviceButton = document.getElementById("btn-add-device");
const loginDialog = document.getElementById("modal-dialog");
const closeBtn = document.getElementById("modal-close-btn")
const outputBox = document.querySelector('output');
addDeviceButton.addEventListener('click', () => {
    loginDialog.showModal();
});

closeBtn.addEventListener('click', () => {
    loginDialog.close('cancelled');
});

loginDialog.addEventListener('close', () => {
    outputBox.value = `Dialog result: ${loginDialog.returnValue}`;
});
function addDeviceToPage(deviceObj) {
    const deviceCard = deviceObj.render(); // Створюємо HTML
    document.getElementById("devices").appendChild(deviceCard); // Додаємо в контейнер
}
const myHomeElectricity = new Electricity(generalEl);
const Lamp1 = new Lightning("Lampa", 100, 2, myHomeElectricity);
addDeviceToPage(Lamp1);


// const SamsungTv = new SmartTv("Samsung Tv", 1000, 2, myHomeElectricity);
// const Refrigator = new Freezer("LG", 1500, 3, myHomeElectricity);



