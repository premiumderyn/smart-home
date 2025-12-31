const channel = new Map([
    [1, "BBC"],
    [2, "NBA"],
    [3, "HBO"],
    [4, "National Geographic"],
    [5, "Fox"]
]);
class Electricity {
    constructor(){
        this.generalEl=0;
        this.load =0;
    }
    get generalElectricity(){
        return this.generalEl
    }
    addConsumption(Power){
        this.generalEl += Power;
        this.changeLoad()
        return this.generalEl;
    }
    removeConsumption(Power){
        this.generalEl -= Power;
        this.changeLoad()
        return this.generalEl;

    }
    changeLoad(){
        switch(true){
            case (this.generalEl===0):
                this.load = 0;
                break;
            case (this.generalEl<=1500):
                this.load = 1;
                break;
            case(this.generalEl<2500):
                this.load = 2;
                break;
            case(this.generalEl>2500):
                this.load = 3;
                break;
        }
    }
    get currentLoad(){
        return this.load;
    }
}
class Device {
    constructor(name, power, room, houseMeter){
        this.name = name;
        this.power = power;
        this.room = room;
        this.isOn = false;
        this.houseMeter = houseMeter;
    }
    get devicePower(){
        return this.power;
    }
    changeDeviceStatus(){
        this.isOn = !this.isOn;
        if(this.isOn){
            this.houseMeter.addConsumption(this.power)
        }
        else this.houseMeter.removeConsumption(this.power)
        return this.isOn;
    }
    get genElectricity() {
        return this.houseMeter.generalElectricity;
    }
    get currentLoad() {
        return this.houseMeter.currentLoad;
    }

}
class SmartTv extends Device{
    constructor(name, power, room, houseMeter){ //ЧИ ПОТРІБНЕ NAME, чи клас буде називатись цим ім'ям
        super(name, power, room, houseMeter);
        this.volume= 75;
        this.channel = channel.get(1);
    }
    get currentChannel(){
        return this.channel;
    }
    get currentVolume(){
        return this.volume;
    }
    changeVolume(bool){
         bool ? this.volume++ : this.volume--;
         return this.currentVolume
    }
    changeChannel(bool){
        for(let i=1; i<=channel.size; i++){
                if(channel.get(i)===this.channel){
                        if(bool){
                            if(i!==channel.size){
                                return this.channel = channel.get(i+1);
                            }else return this.channel = channel.get(1);
                        }else {
                            if(i!==1) {
                                return this.channel = channel.get(i-1)
                            } else return this.channel = channel.get(channel.size);
                        }
                }
        }
    }
}
class Freezer extends Device{
    constructor(name, power, room, houseMeter){
        super(name, power, room, houseMeter);
        this.temperature = 5;
    }
    get currentTemperature(){
        return this.temperature;
    }
    changeTemperature(value){
        if(this.isOn){
            return this.temperature = value;
        } return this.temperature;

    }
}
const myHomeElectricity = new Electricity();

// const SamsungTv = new Device("Samsung Tv", 1000, 2); // isOn?
const SamsungTv=new SmartTv("Samsung Tv",1000, 2, myHomeElectricity);
console.log(SamsungTv.currentChannel)
console.log(SamsungTv.genElectricity);

console.log(SamsungTv.changeDeviceStatus())
console.log(SamsungTv.genElectricity);
console.log(SamsungTv.currentLoad);

console.log(SamsungTv.genElectricity);
console.log(SamsungTv.currentLoad);
console.log(SamsungTv.changeVolume(false))
console.log(SamsungTv.changeChannel(true));

const Refrigator = new Freezer("LG", 1500, 3, myHomeElectricity)
console.log(Refrigator.changeTemperature(-15));
console.log(Refrigator.changeDeviceStatus());
console.log(Refrigator.changeTemperature(-15));
console.log(Refrigator.genElectricity);
// console.log(Refrigator.changeDeviceStatus());
console.log(Refrigator.genElectricity);
console.log(SamsungTv.currentLoad);
// console.log(SamsungTv.changeDeviceStatus())
console.log(myHomeElectricity.generalElectricity)

// console.log(Device.genElectricity);
// console.log(Device.removeConsumption(Device.currentPower));
// console.log(SamsungTv.addConsumption(SamsungTv.devicePower))
