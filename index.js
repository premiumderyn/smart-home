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
      this.isMasterSwitchOn = true;
  }
  updateGeneralTextView(){
      if(this.displayElement){
          this.displayElement.textContent=this.generalEl +"W";
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
    this.updateLoadColor();
  }
  updateLoadColor(){
      switch(true){
          case this.load === 0:
              this.displayElement.style.color = "black";
              break;
          case this.load === 1:
              this.displayElement.style.color = "#4FC765";
              break;
          case this.load === 2:
              this.displayElement.style.color = "#D97706";
              break;
          case this.load === 3:
              this.displayElement.style.color = "#EF4A4A";
              break;
      }
  }
  get currentLoad() {
    return this.load;
  }
  setMasterSwitch(status) {
      this.isMasterSwitchOn = status;
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
      const deleteBtn = div.querySelector(".device__remove-icon");

      const btn = div.querySelector('.device__power-button');
      btn.addEventListener('click', () => {
          this.changeDeviceStatus();
          this.updateView();

      });
      deleteBtn.addEventListener('click', () => {
      this.deleteDevice(div)
      })

      return div;
  }
  deleteDevice(el){
      if (this.isOn) {
          this.houseMeter.removeConsumption(this.power);
      }
      const index = allDevices.indexOf(this);
      if (index > -1) {
          console.log(allDevices.splice(index, 1)); // Вирізаємо його з масиву
      }
          this.element.remove();
          el=null;
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
      if (!this.isOn && !this.houseMeter.isMasterSwitchOn) {
          alert("NO POWER! TURN ON ELECTRICITY.");
          return this.isOn;
      }
    this.isOn = !this.isOn;
    if (this.isOn) {
        this.power=this.basePower;
      this.houseMeter.addConsumption(this.power);
    } else{
        this.houseMeter.removeConsumption(this.power);
        this.power=0;
    }
    this.updateView();
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
  turnOffDevice(){
      if(this.isOn) {
          this.changeDeviceStatus();
      } else return this.isOn;
  }
  // turnOnDevice(){
  //     if(!this.isOn){
  //         this.changeDeviceStatus();
  //     }else return this.isOn;
  // }
}
class SmartTv extends Device {
  constructor(name, power, room, houseMeter) {
    //ЧИ ПОТРІБНЕ NAME, чи клас буде називатись цим ім'ям
    super(name, power, room, houseMeter);
    this.volume = 0;
    this.channel = channel.get(1);
  }
  get currentChannel() {
    return this.channel;
  }
  get currentVolume() {
    return this.volume;
  }
  changeVolume(bool) {
      if(!this.isOn){
          return this.currentVolume
      }
      if((this.volume ===100 && bool===true) || (this.volume===0 && bool===false)){
          return this.currentVolume

      }

    bool ? this.volume++ : this.volume--;
    return this.currentVolume;
  }
  changeChannel(bool) {
      if(!this.isOn) return this.channel;
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
  render(){
        const deviceCard = super.renderDevice();
        const functionalContainer = document.createElement('div');
      functionalContainer.classList.add('device__details');
        functionalContainer.innerHTML = `
            <p>Volume: <span class="volume-val">${this.volume}</span></p>
            <button type="button" class="btn-volume-down">-</button>
            <button type="button" class="btn-volume-up">+</button>
            <p class="current-channel">Device is turned off</p>
            <button type="button" class="btn-channel-prev">PREV</button>
            <button type="button" class="btn-channel-next">NEXT</button>
        `;
        const infoBlock = deviceCard.querySelector('.device__info');
        infoBlock.appendChild(functionalContainer);
        const volumeDown = functionalContainer.querySelector('.btn-volume-down');
        const volumeUp = functionalContainer.querySelector('.btn-volume-up');
        const prevChannel = functionalContainer.querySelector('.btn-channel-prev');
        const nextChannel = functionalContainer.querySelector('.btn-channel-next');
        volumeDown.addEventListener('click', () => {
            this.changeVolume(false);
            this.updateView();
        });
        volumeUp.addEventListener('click', () => {
            this.changeVolume(true);
            this.updateView();
        })
        prevChannel.addEventListener('click', () => {
            this.changeChannel(false);
            this.updateView();
        })
        nextChannel.addEventListener('click', () => {
            this.changeChannel(true);
            this.updateView();

        })
      return deviceCard;

      };

    updateView(){
        super.updateView();
        if (!this.element) return;
        const VolumeSpan = this.element.querySelector('.volume-val');
        const channelPrg=this.element.querySelector('.current-channel');

        if (VolumeSpan) VolumeSpan.textContent = this.volume;
        if(channelPrg && this.isOn) {
            channelPrg.textContent = this.channel;
        } else channelPrg.textContent = "Device is turned off";
    }
    changeDeviceStatus(){
      super.changeDeviceStatus();
      if(!this.isOn){
          this.volume=0;
          this.channel=channel.get(1);
      }
      this.updateView()
    }
}
class Freezer extends Device {
  constructor(name, power, room, houseMeter) {
    super(name, power, room, houseMeter);
    this.temperature = 5;
    this.basePower=power;
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
      this.power = Math.floor(this.basePower + this.basePower * 0.15);
    } else if (value === 2 || value === 1) {
      this.power = Math.floor(this.basePower + this.basePower * 0.3);
    } else if (value >= 5) {
      this.power = this.basePower;
    }
    this.houseMeter.addConsumption(this.power);
    return (this.temperature = value);
  }
  render(){
        const deviceCard = super.renderDevice();
        const TemperatureContainer = document.createElement('div');
        TemperatureContainer.classList.add('device__details');
        TemperatureContainer.innerHTML = `
            <p>Temperature: <span class="temp-val">${this.temperature}</span>°C</p>
            <input type="range" class="temp-range" min="1" max="8" value="${this.temperature}">
        `;
        const infoBlock = deviceCard.querySelector('.device__info');
        infoBlock.appendChild(TemperatureContainer);
        const range = TemperatureContainer.querySelector('.temp-range');
        range.addEventListener('input', (e) => {
            this.changeTemperature(parseInt(e.target.value));
            this.updateView();
        });
        return deviceCard;
  }
  updateView(){
        super.updateView();
        if (!this.element) return;
        const TempSpan = this.element.querySelector('.temp-val');
        const range = this.element.querySelector('.temp-range');

        if (TempSpan) TempSpan.textContent = this.temperature;
        if (range) range.value = this.temperature
  }
  changeDeviceStatus(){
        super.changeDeviceStatus();
        if(!this.isOn){
            this.temperature=5;
        }
        this.updateView()

  }
}
class Lightning extends Device {
    constructor(name, power, room, houseMeter) {
        super(name, power, room, houseMeter);
        this.brightness = 0;
        this.basePower=power;
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
    get currentBrightness() {
        return this.brightness;
    }
    changeDeviceStatus(){
        if (!this.isOn && !this.houseMeter.isMasterSwitchOn) {
            alert("NO POWER! TURN ON ELECTRICITY.");
            return this.isOn;
        }
        if(!this.isOn) {
            if(this.brightness ===0) {
                this.brightness = 1;
            }
            this.isOn = true;
            this.power = this.changePower();
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
        if(!this.houseMeter.isMasterSwitchOn) return
        if (!this.isOn) {
                this.brightness = value;
                if (value > 0) {
                    this.changeDeviceStatus();
                }
                return this.brightness;

        }
        this.houseMeter.removeConsumption(this.power);

        this.brightness = value;
        if (this.brightness === 0) {
            this.power = 0;
            this.isOn = false;
            this.updateView();
            return 0;
        }
        this.power = this.changePower();
        this.houseMeter.addConsumption(this.power);
        this.updateView();
        return this.brightness;

    }
    changePower(){
        return Math.floor(this.basePower*(this.brightness/100));
    }
    get currentStatus(){
        return this.isOn;
    }
}
const checkboxButton = document.getElementById('electricity-checkbox');
const generalEl = document.getElementById("general-power-value");
const addDeviceButton = document.getElementById("btn-add-device");
const loginDialog = document.getElementById("modal-dialog");
const closeBtn = document.getElementById("modal-close-btn")
const outputBox = document.querySelector('output');
const allDevices = [];
const myHomeElectricity = new Electricity(generalEl, checkboxButton);
const addDeviceForm = document.getElementById("save-device-btn");
const deviceName = document.getElementById("device-name-input");
const devicePower = document.getElementById("device-power-input");
const deviceRoom = document.getElementById("device-room-input");
const deviceType = document.getElementById("device-type-input");

addDeviceButton.addEventListener('click', () => {
    loginDialog.showModal();
});

closeBtn.addEventListener('click', () => {
    loginDialog.close('cancelled');
});

// loginDialog.addEventListener('close', () => {
//     outputBox.value = `Dialog result: ${loginDialog.returnValue}`;
// });
function addDeviceToPage(deviceObj) {
    allDevices.push(deviceObj);
    const deviceCard = deviceObj.render(); // Створюємо HTML
    document.getElementById("devices").appendChild(deviceCard); // Додаємо в контейнер
}
addDeviceForm.addEventListener('click', function(event) {
    event.preventDefault();
    const name = deviceName.value;
    const power = parseInt(devicePower.value);
    const room = parseInt(deviceRoom.value);
    const type = deviceType.value;
    let newDevice;
    switch (type) {
        case "Light":
            newDevice = new Lightning(name, power, room, myHomeElectricity);
            break;
        case "TV":
            newDevice = new SmartTv(name, power, room, myHomeElectricity);
            break;
        case "Freezer":
            newDevice = new Freezer(name, power, room, myHomeElectricity);
            break;
    }
    addDeviceToPage(newDevice);
    loginDialog.close();
    addDeviceForm.reset();

})
const generalElectricity = document.getElementById("electricity-checkbox");
generalElectricity.addEventListener('change', (e) => {
    if (!e.target.checked) {
        myHomeElectricity.setMasterSwitch(false);
        for(let i=0; i<allDevices.length; i++) {
            const device = allDevices[i];
            // allDevices[i].turnOffDevice();
            if (device.isOn) {
                device.changeDeviceStatus();
            }
        }
    } else{
        myHomeElectricity.setMasterSwitch(true);
    }
})
// const Lamp1 = new Lightning("Lampa", 100, 2, myHomeElectricity);
// // addDeviceToPage(Lamp1);
// const Lamp2 = new Lightning("Bulb", 200, 1, myHomeElectricity);
// addDeviceToPage(Lamp2);
// addDeviceToPage(new Lightning("Lamp", 100, 2, myHomeElectricity));
// addDeviceToPage(new Lightning("Lamp1", 1500, 2, myHomeElectricity));
// addDeviceToPage(new Lightning("Lamp2", 1000, 3, myHomeElectricity));

// const SamsungTv = new SmartTv("Samsung Tv", 1000, 2, myHomeElectricity);
// const Refrigator = new Freezer("LG", 1500, 3, myHomeElectricity);

SAMSUNG = new SmartTv("Samsung Tv", 1000, 2, myHomeElectricity);
addDeviceToPage(SAMSUNG);

