let device;
const rangeInput = document.getElementById('rangeInput');
const rangeValue = document.getElementById('rangeValue');
const connectButton = document.getElementById('connectButton');

// レンジスライダーの値を更新
rangeInput.addEventListener('input', () => {
    rangeValue.textContent = rangeInput.value;
    if (device) {
        sendValueToArduino(rangeInput.value);
    }
});

// Arduinoに値を送信
async function sendValueToArduino(value) {
    if (!device) return;
    const encoder = new TextEncoder();
    const data = encoder.encode(value + '\n');
    await device.transferOut(4, data);
}

// WebUSBでArduinoに接続
connectButton.addEventListener('click', async () => {
    try {
        device = await navigator.usb.requestDevice({ filters: [{ vendorId: 0x2341 }] });
        await device.open();
        await device.selectConfiguration(1);
        await device.claimInterface(2);
        console.log('Connected to Arduino');
    } catch (error) {
        console.error('There was an error connecting to the device:', error);
    }
});
