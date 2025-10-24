async function buscaApi () {
    const cityInput = document.getElementById('city_name');
    const city = cityInput.value.trim();

    if (!city) {
        alert("Digite o nome de uma cidade!");
        return;
    }

    const url = `https://api.weatherapi.com/v1/current.json?key=91ca1d9af6924a7598504746252210&q=${city}&lang=pt`;

    try {
        const resp = await fetch(url);
        const obj = await resp.json();

        console.log(obj);

        const cityElement = document.getElementsByClassName("city")[0];
        cityElement.innerHTML = obj.location.name;

        document.querySelector(".cel").innerHTML = `${obj.current.temp_c}°C`;
        document.querySelector(".Chuva").innerHTML = `Chuva: ${obj.current.precip_mm}mm`;
        document.querySelector(".Humidade").innerHTML = `Umidade: ${obj.current.humidity}%`;
        document.querySelector(".Vento").innerHTML = `Vento: ${obj.current.wind_kph} km/h`;
        document.querySelector(".skye-info").innerHTML = obj.current.condition.text;
        document.querySelector(".dat").innerHTML = obj.location.localtime;

        } catch (error) {
        console.error("Erro ao buscar dados:", error);
        alert("Cidade não encontrada ou erro na API.");
    }
}
document.querySelector(".btn-topo button").addEventListener("click", buscaApi);