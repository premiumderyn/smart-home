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
  updateGeneralTextView() {
    if (this.displayElement) {
      this.displayElement.textContent = this.generalEl + "W";
    }
  }
  get generalElectricity() {
    return this.generalEl;
  }
  addConsumption(Power) {
    this.generalEl += Power;
    if (this.generalEl >= 4000) {
      toggleGlobalElectricity(false);
      generalElectricity.checked = false;
      alert("⚠️ WARNING: Overload! System shut down for safety.");
    }
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
  updateLoadColor() {
    switch (true) {
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
    this.basePower = power;
    this.houseMeter = houseMeter;
    this.element = null;
    this.htmlView = true;
  }
  renderDevice() {
    const div = document.createElement("div");
    div.classList.add("device");
    div.innerHTML = `
            <div class="device__remove">
                <img class="device__remove-icon" src="cross.png" alt="cross icon" />
            </div>
            <div class="device__header">
                <p class="device__name"><span>${this.name}</span></p>
                <hr class="device__divider" />
             </div>
            <div class="device__info">
                <p class="device__power">Power:<span class="device__power-content"> <span class="device__power-value">0</span>W</span></p>
                <p class="device__room">Room: ${this.room}</p>
            </div>
            <div class="device__status">
                <button class="device__power-button" style="background-color: red;">OFF</button>
            </div>
        `;
    this.element = div;
    const deleteBtn = div.querySelector(".device__remove-icon");

    const btn = div.querySelector(".device__power-button");
    btn.addEventListener("click", () => {
      this.changeDeviceStatus();
      this.updateView();
    });
    deleteBtn.addEventListener("click", () => {
      this.deleteDevice(div);
    });

    return div;
  }
  deleteDeviceHtml() {
    if (this.element) {
      this.element.remove();
    }
    this.htmlView = false;
  }
  deleteDevice(el) {
    if (this.isOn) {
      this.houseMeter.removeConsumption(this.power);
    }
    const index = allDevices.indexOf(this);
    if (index > -1) {
      console.log(allDevices.splice(index, 1));
    }
    this.element.remove();
    el = null;
    saveSystemState();
  }
  updateView() {
    if (!this.element) return;
    const deviceBorder = this.element;
    const powerSpan = this.element.querySelector(".device__power-value");
    const btn = this.element.querySelector(".device__power-button");
    powerSpan.textContent = this.power;
    if (this.isOn) {
      btn.style.backgroundColor = "green";
      btn.textContent = "ON";
      deviceBorder.style.borderColor = "#4FC765";
    } else {
      btn.style.backgroundColor = "red";
      btn.textContent = "OFF";
      deviceBorder.style.borderColor = "#848080";
    }
  }
  changeDeviceStatus() {
    if (!this.isOn && !this.houseMeter.isMasterSwitchOn) {
      alert("NO POWER! TURN ON ELECTRICITY.");
      return this.isOn;
    }
    this.isOn = !this.isOn;
    if (this.isOn) {
      this.power = this.basePower;
      this.houseMeter.addConsumption(this.power);
    } else {
      this.houseMeter.removeConsumption(this.power);
      this.power = 0;
    }
    this.updateView();
    saveSystemState();
    return this.isOn;
  }
  get viewHtmlStatus() {
    return this.htmlView;
  }
  changeHtmlStatus() {
    return (this.htmlView = !this.htmlView);
  }
  get deviceRoom() {
    return this.room;
  }
}
class SmartTv extends Device {
  constructor(name, power, room, houseMeter) {
    super(name, power, room, houseMeter);
    this.volume = 0;
    this.channel = channel.get(1);
  }
  get currentVolume() {
    return this.volume;
  }
  changeVolume(bool) {
    if (!this.isOn) {
      return this.currentVolume;
    }
    if (
      (this.volume === 100 && bool === true) ||
      (this.volume === 0 && bool === false)
    ) {
      return this.currentVolume;
    }

    bool ? this.volume++ : this.volume--;
    saveSystemState();
    return this.currentVolume;
  }
  changeChannel(bool) {
    if (!this.isOn) return this.channel;

    for (let i = 1; i <= channel.size; i++) {
      if (channel.get(i) === this.channel) {
        if (bool) {
          if (i !== channel.size) {
            this.channel = channel.get(i + 1);
          } else {
            this.channel = channel.get(1);
          }
        } else {
          if (i !== 1) {
            this.channel = channel.get(i - 1);
          } else {
            this.channel = channel.get(channel.size);
          }
        }
        saveSystemState();
        return this.channel;
      }
    }
    return this.channel;
  }
  render() {
    const deviceCard = super.renderDevice();
    const functionalContainer = document.createElement("div");
    functionalContainer.classList.add("device__details");
    functionalContainer.innerHTML = `
            <div class="device__details-content">
            <p>Volume: <span class="volume-val">${this.volume}</span></p>
            <div class="device__details-btn">
            <button type="button" class="btn-volume-down">-</button>
            <button type="button" class="btn-volume-up">+</button>
            </div>
            </div>
            <p class="current-channel">Device is turned off</p>
            <div class="device__details-control">
            <button type="button" class="btn-channel-prev">PREV</button>
            <button type="button" class="btn-channel-next">NEXT</button>
            </div>
        `;
    const infoBlock = deviceCard.querySelector(".device__info");
    infoBlock.appendChild(functionalContainer);
    const volumeDown = functionalContainer.querySelector(".btn-volume-down");
    const volumeUp = functionalContainer.querySelector(".btn-volume-up");
    const prevChannel = functionalContainer.querySelector(".btn-channel-prev");
    const nextChannel = functionalContainer.querySelector(".btn-channel-next");
    volumeDown.addEventListener("click", () => {
      this.changeVolume(false);
      this.updateView();
    });
    volumeUp.addEventListener("click", () => {
      this.changeVolume(true);
      this.updateView();
    });
    prevChannel.addEventListener("click", () => {
      this.changeChannel(false);
      this.updateView();
    });
    nextChannel.addEventListener("click", () => {
      this.changeChannel(true);
      this.updateView();
    });
    return deviceCard;
  }
  updateView() {
    super.updateView();
    if (!this.element) return;
    const VolumeSpan = this.element.querySelector(".volume-val");
    const channelPrg = this.element.querySelector(".current-channel");

    if (VolumeSpan) VolumeSpan.textContent = this.volume;
    if (channelPrg && this.isOn) {
      channelPrg.textContent = this.channel;
    } else channelPrg.textContent = "Device is turned off";
  }
  changeDeviceStatus() {
    super.changeDeviceStatus();
    if (!this.isOn) {
      this.volume = 0;
      this.channel = channel.get(1);
    }
    this.updateView();
  }
}
class Freezer extends Device {
  constructor(name, power, room, houseMeter) {
    super(name, power, room, houseMeter);
    this.temperature = 5;
    this.basePower = power;
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
    this.temperature = value;
    saveSystemState();
    return this.temperature;
  }
  render() {
    const deviceCard = super.renderDevice();
    const TemperatureContainer = document.createElement("div");
    TemperatureContainer.classList.add("device__details");
    TemperatureContainer.innerHTML = `
            <p>Temperature: <span class="temp-val">${this.temperature}</span>°C</p>
            <input type="range" class="temp-range" min="1" max="8" value="${this.temperature}">
        `;
    const infoBlock = deviceCard.querySelector(".device__info");
    infoBlock.appendChild(TemperatureContainer);
    const range = TemperatureContainer.querySelector(".temp-range");
    range.addEventListener("input", (e) => {
      this.changeTemperature(parseInt(e.target.value));
      this.updateView();
    });
    return deviceCard;
  }
  updateView() {
    super.updateView();
    if (!this.element) return;
    const TempSpan = this.element.querySelector(".temp-val");
    const range = this.element.querySelector(".temp-range");

    if (TempSpan) TempSpan.textContent = this.temperature;
    if (range) range.value = this.temperature;
  }
  changeDeviceStatus() {
    super.changeDeviceStatus();
    if (!this.isOn) {
      this.temperature = 5;
    }
    this.updateView();
  }
}
class Lightning extends Device {
  constructor(name, power, room, houseMeter) {
    super(name, power, room, houseMeter);
    this.brightness = 0;
    this.basePower = power;
  }
  render() {
    const deviceCard = super.renderDevice();
    const brightnessContainer = document.createElement("div");
    brightnessContainer.classList.add("device__details");
    brightnessContainer.innerHTML = `
            <p>Brightness: <span class="bright-val">${this.brightness}</span>%</p>
            <input type="range" class="bright-range" min="0" max="100" value="${this.brightness}">
        `;
    const infoBlock = deviceCard.querySelector(".device__info");
    infoBlock.appendChild(brightnessContainer);
    const range = brightnessContainer.querySelector(".bright-range");
    range.addEventListener("input", (e) => {
      this.changeBrightness(parseInt(e.target.value));
      this.updateView();
    });
    return deviceCard;
  }
  updateView() {
    super.updateView();
    if (!this.element) return;
    const brightSpan = this.element.querySelector(".bright-val");
    const range = this.element.querySelector(".bright-range");

    if (brightSpan) brightSpan.textContent = this.brightness;
    if (range) range.value = this.brightness;
  }
  changeDeviceStatus() {
    if (!this.isOn && !this.houseMeter.isMasterSwitchOn) {
      alert("NO POWER! TURN ON ELECTRICITY.");
      return this.isOn;
    }
    if (!this.isOn) {
      if (this.brightness === 0) {
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
    saveSystemState();
    return this.isOn;
  }
  changeBrightness(value) {
    if (!this.houseMeter.isMasterSwitchOn) return;
    if (!this.isOn) {
      this.brightness = value;
      if (value > 0) {
        this.changeDeviceStatus();
      }
      saveSystemState();
      return this.brightness;
    }
    this.houseMeter.removeConsumption(this.power);

    this.brightness = value;
    if (this.brightness === 0) {
      this.power = 0;
      this.isOn = false;
      this.updateView();
      saveSystemState();
      return 0;
    }
    this.power = this.changePower();
    this.houseMeter.addConsumption(this.power);
    this.updateView();
    saveSystemState();
    return this.brightness;
  }
  changePower() {
    return Math.floor(this.basePower * (this.brightness / 100));
  }
  get currentStatus() {
    return this.isOn;
  }
}
const checkboxButton = document.getElementById("electricity-checkbox");
const generalEl = document.getElementById("general-power-value");
const realForm = document.getElementById("add-device-form");
const addDeviceButton = document.getElementById("btn-add-device");
const loginDialog = document.getElementById("modal-dialog");
const closeBtn = document.getElementById("modal-close-btn");
const allDevices = [];
const myHomeElectricity = new Electricity(generalEl, checkboxButton);
const saveBtn = document.getElementById("save-device-btn");
const deviceName = document.getElementById("device-name-input");
const devicePower = document.getElementById("device-power-input");
const deviceRoom = document.getElementById("device-room-input");
const deviceType = document.getElementById("device-type-input");
const deviceRoomSorting = document.getElementById("room-select");
deviceRoomSorting.addEventListener("input", (e) => {
  const selectedRoom = parseInt(e.target.value);
  filterDevices(selectedRoom);
  localStorage.setItem("activeRoomFilter", selectedRoom);
});
function filterDevices(roomNum) {
  for (let i = 0; i < allDevices.length; i++) {
    const device = allDevices[i];
    const shouldBeVisible = roomNum === 0 || device.deviceRoom === roomNum;
    if (shouldBeVisible && device.viewHtmlStatus === false) {
      device.changeHtmlStatus();
      returnDeviceToPage2(device);
    } else if (!shouldBeVisible && device.viewHtmlStatus === true) {
      device.deleteDeviceHtml();
    }
  }
}
addDeviceButton.addEventListener("click", () => {
  loginDialog.showModal();
});

closeBtn.addEventListener("click", () => {
  loginDialog.close("cancelled");
});
function addDeviceToPage(deviceObj) {
  allDevices.push(deviceObj);
  const deviceCard = deviceObj.render();
  document.getElementById("devices").appendChild(deviceCard);
}
function returnDeviceToPage2(deviceObj) {
  const deviceCard = deviceObj.render();
  document.getElementById("devices").appendChild(deviceCard);
  deviceObj.updateView();
}
saveBtn.addEventListener("click", function (event) {
  event.preventDefault();
  if (!realForm.reportValidity()) {
    return;
  }
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
  saveSystemState();
  loginDialog.close();
  const savedFilter = parseInt(localStorage.getItem("activeRoomFilter")) || 0;
  deviceRoomSorting.value = savedFilter;
  filterDevices(savedFilter);
  if (realForm) {
    realForm.reset();
  }
});
const generalElectricity = document.getElementById("electricity-checkbox");
function toggleGlobalElectricity(isEnabled) {
  if (!isEnabled) {
    myHomeElectricity.setMasterSwitch(false);

    for (let i = 0; i < allDevices.length; i++) {
      const device = allDevices[i];
      if (device.isOn) {
        device.changeDeviceStatus();
      }
    }
  } else {
    myHomeElectricity.setMasterSwitch(true);
  }
  saveSystemState();
}
generalElectricity.addEventListener("change", (e) => {
  toggleGlobalElectricity(e.target.checked);
});
const floorPlanBtn = document.querySelector(".floor-plan-btn");
const floorDialog = document.getElementById("floor-plan-dialog");
const closeFloorBtn = document.getElementById("close-floor-plan");

const btnFloorPlan = document.getElementById("btn-floor-plan");

if (btnFloorPlan) {
  btnFloorPlan.addEventListener("click", () => {
    updateFloorPlanData();
    floorDialog.showModal();
  });
}

closeFloorBtn.addEventListener("click", () => {
  floorDialog.close();
});
function updateFloorPlanData() {
  const roomStats = {
    1: { power: 0, hasLightOn: false },
    2: { power: 0, hasLightOn: false },
    3: { power: 0, hasLightOn: false },
  };
  allDevices.forEach((device) => {
    if (roomStats[device.deviceRoom]) {
      roomStats[device.deviceRoom].power += device.power;
      if (device.isOn) {
        roomStats[device.deviceRoom].hasLightOn = true;
      }
    }
  });
  for (let i = 1; i <= 3; i++) {
    const zone = document.getElementById(`zone-room-${i}`);
    const textPower = document.getElementById(`power-room-${i}`);
    if (textPower) {
      textPower.textContent = `${roomStats[i].power} W`;
    }
    if (zone) {
      if (roomStats[i].hasLightOn) {
        zone.classList.add("active");
      } else {
        zone.classList.remove("active");
      }
    }
  }
}
window.toggleRoomLights = function (roomNumber) {
  let anyDeviceOn = false;

  allDevices.forEach((device) => {
    if (device.deviceRoom === roomNumber && device.isOn) {
      anyDeviceOn = true;
    }
  });
  const targetState = !anyDeviceOn;
  allDevices.forEach((device) => {
    if (device.deviceRoom === roomNumber) {
      if (device.isOn !== targetState) {
        device.changeDeviceStatus();
      }
    }
  });

  updateFloorPlanData();
};
function saveSystemState() {
  const devicesData = allDevices.map((device) => {
    return {
      classType: device.constructor.name,
      name: device.name,
      basePower: device.basePower,
      room: device.room,

      isOn: device.isOn,
      volume: device.volume || 0,
      temperature: device.temperature || 0,
      brightness: device.brightness || 0,
      channelName: device.channel,
    };
  });

  localStorage.setItem("mySmartHome_Devices", JSON.stringify(devicesData));
  localStorage.setItem(
    "mySmartHome_MasterSwitch",
    myHomeElectricity.isMasterSwitchOn
  );
}
function loadSystemState() {
  const savedMasterSwitch = localStorage.getItem("mySmartHome_MasterSwitch");
  if (savedMasterSwitch !== null) {
    const isMsgOn = savedMasterSwitch === "true";
    myHomeElectricity.setMasterSwitch(isMsgOn);
    const checkbox = document.getElementById("electricity-checkbox");
    if (checkbox) checkbox.checked = isMsgOn;
  }

  const savedData = localStorage.getItem("mySmartHome_Devices");
  if (!savedData) return false;
  const parsedData = JSON.parse(savedData);

  document.getElementById("devices").innerHTML = "";
  allDevices.length = 0;

  parsedData.forEach((item) => {
    let newDevice;

    switch (item.classType) {
      case "SmartTv":
        newDevice = new SmartTv(
          item.name,
          item.basePower,
          item.room,
          myHomeElectricity
        );
        newDevice.volume = item.volume;
        break;
      case "Freezer":
        newDevice = new Freezer(
          item.name,
          item.basePower,
          item.room,
          myHomeElectricity
        );
        newDevice.temperature = item.temperature;
        break;
      case "Lightning":
        newDevice = new Lightning(
          item.name,
          item.basePower,
          item.room,
          myHomeElectricity
        );
        newDevice.brightness = item.brightness;
        break;
      default:
        newDevice = new Device(
          item.name,
          item.basePower,
          item.room,
          myHomeElectricity
        );
        break;
    }
    newDevice.isOn = item.isOn;
    if (newDevice.isOn) {
      if (item.classType === "Lightning") {
        newDevice.power = Math.floor(
          newDevice.basePower * (newDevice.brightness / 100)
        );
      } else if (item.classType === "Freezer") {
        newDevice.power = newDevice.basePower;
      } else {
        newDevice.power = newDevice.basePower;
      }
      myHomeElectricity.generalEl += newDevice.power;
    }
    addDeviceToPage(newDevice);
    newDevice.updateView();
  });
  myHomeElectricity.changeLoad();
  myHomeElectricity.updateGeneralTextView();
  return true;
}
const isLoaded = loadSystemState();

if (!isLoaded) {
  const Light = new Lightning("Bulb", 100, 1, myHomeElectricity);
  const LG = new Freezer("LG", 100, 3, myHomeElectricity);
  const Samsung = new SmartTv("Samsung", 400, 2, myHomeElectricity);
  addDeviceToPage(Light);
  addDeviceToPage(LG);
  addDeviceToPage(Samsung);
  saveSystemState();
}
const waterCheckbox = document.getElementById('water-checkbox');
const STORAGE_KEY = 'waterValveStatus';
const savedState = localStorage.getItem(STORAGE_KEY);
if (savedState === 'true') {
    waterCheckbox.checked = true;
}
waterCheckbox.addEventListener('change', function() {
    localStorage.setItem(STORAGE_KEY, this.checked);
});
