const apiKey = "91ca1d9af6924a7598504746252210";
const apiRecife = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=Recife&days=7&lang=pt`;

async function recifeInfo () {
    const recifeResp = await fetch(apiRecife);
    const objRecife = await recifeResp.json();

    const tempCel = document.getElementById('temp-cel');
    tempCel.innerHTML = `
    <img src="${objRecife.current.condition.icon}" alt="Icone">
    <h1 class="cel">${objRecife.current.temp_c}°C</h1>`

    document.querySelector('#Chuva').innerHTML = `Chuva: ${objRecife.current.precip_mm}mm`;
    document.querySelector('#Humidade').innerHTML = `Umidade: ${objRecife.current.humidity}%`;
    document.querySelector('#Vento').innerHTML = `Vento: ${objRecife.current.wind_kph} km/h`;
    document.querySelector('#skye-info').innerHTML = objRecife.current.condition.text;
    document.querySelector('#dat').innerHTML = objRecife.location.localtime;
}
recifeInfo();

async function buscaApi () {
    const city = document.getElementById('city_name').value.trim();
    if (!city) {
        alert("Digite o nome de uma cidade");
        return;
    }

    
    const api = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&lang=pt`;

    try {
    
        const respApi = await fetch(api);
        const objApi = await respApi.json();

        console.log(objApi);

        const cityName = document.getElementById('city');
        cityName.innerHTML = objApi.location.name;

        const tempCel = document.getElementById('temp-cel');
        tempCel.innerHTML = `
        <img src="${objApi.current.condition.icon}" alt="Icone">
        <h1 class="cel">${objApi.current.temp_c}°C</h1>`

        document.querySelector('#Chuva').innerHTML = `Chuva: ${objApi.current.precip_mm}mm`;
        document.querySelector('#Humidade').innerHTML = `Umidade: ${objApi.current.humidity}%`;
        document.querySelector('#Vento').innerHTML = `Vento: ${objApi.current.wind_kph} km/h`;
        document.querySelector('#skye-info').innerHTML = objApi.current.condition.text;
        document.querySelector('#dat').innerHTML = objApi.location.localtime;
    }
    catch (error) {
        console.error("Erro ao buscar dados:", error);
        alert("Cidade não encontrada ou erro na API.");
    }
}