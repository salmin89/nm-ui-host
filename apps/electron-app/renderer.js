window.electronAPI.onStdinData((event, data) => {
  const logElement = document.getElementById('out');
  logElement.innerText += `${JSON.stringify(data)}\n`;
});