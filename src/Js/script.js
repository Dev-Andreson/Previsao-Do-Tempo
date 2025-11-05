const date = new Date().toISOString().split('T')[0].split('-').reverse().slice(0, 2).join('/');
const apiKey = "91ca1d9af6924a7598504746252210";
const apiRecife = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=Recife&days=7&lang=pt`;

async function recifeInfo () {
    const recifeResp = await fetch(apiRecife);
    const objRecife = await recifeResp.json();

    const tempCel = document.getElementById('temp-cel');
    tempCel.innerHTML = `
    <img src="${objRecife.current.condition.icon}" alt="Icone">
    <h1 class="cel">${objRecife.current.temp_c}°C</h1>`

    document.querySelector('#Chuva').innerHTML = `Chuva: ${objRecife.forecast.forecastday[0].day.daily_chance_of_rain}%`;
    document.querySelector('#Humidade').innerHTML = `Umidade: ${objRecife.current.humidity}%`;
    document.querySelector('#Vento').innerHTML = `Vento: ${objRecife.current.wind_kph} km/h`;
    document.querySelector('#skye-info').innerHTML = objRecife.current.condition.text;
    document.querySelector('#dat').innerHTML = objRecife.location.localtime;

    /* TDC Start */
    document.querySelector('#tdc').innerHTML = `
    <i class="bi bi-star"></i>
    <h1>Previsão do tempo Hoje {${date}} ${objRecife.location.name} </h1>
    <i class="bi bi-geo-alt-fill"></i>`
    
    /* L-E Start */
    document.querySelector('#txt-l-e').innerHTML = `
    <h1>${objRecife.current.condition.text}</h1>
    <p>${objRecife.forecast.forecastday[0].day.condition.text}</p>`;
    document.querySelector('#temperatura').innerHTML = `
    <h1>Temperatura </h1>
    <p><span class"max-temp"><i class="bi bi-chevron-down"></i></span> ${objRecife.forecast.forecastday[0].day.maxtemp_c}'°C'  <span class="min-temp"><i class="bi bi-chevron-up"></i></span>${objRecife.forecast.forecastday[0].day.mintemp_c} </p>`
    document.querySelector('#chuva-indice').innerHTML = `
    <h1>Chuva</h1>
    <p>${objRecife.forecast.forecastday[0].day.daily_chance_of_rain}%</p>`
    document.querySelector('#vento-indice').innerHTML = `
    <h1>Vento</h1>
    <p>${objRecife.current.wind_kph} km/h</p>`
    document.querySelector('#umidade-indice').innerHTML = `
    <h1>Umidade</h1>
    <p>${objRecife.current.humidity}%</p>`
    /* L-E End */

    /* L-D Start */
    document.querySelector('#icon-manha').innerHTML = `
    <img src="${objRecife.forecast.forecastday[0].hour[9].condition.icon}" alt="Icone">
    <p>Manhã</p>`
    document.querySelector('#icon-tarde').innerHTML = `
    <img src="${objRecife.forecast.forecastday[0].hour[21].condition.icon}" alt="Icone">
    <p>Tarde</p>`
    document.querySelector('#icon-noite').innerHTML = `
    <img src="${objRecife.forecast.forecastday[0].hour[21].condition.icon}" alt="Icone">
    <p>Noite</p>`
    /* L-D End */

    /* TDC End */

    /* Noticas Start*/
    document.querySelector(".card").innerHTML = `
    <a href="https://www.climatempo.com.br/busca?q=${encodeURIComponent("Recife")}">Saiba mais em ClimaTempo.com</a>`
    document.querySelector(".card-1").innerHTML = `
    <a href="https://g1.globo.com/busca?q=${encodeURIComponent("Previsão do tempo em Recife")}">Saiba mais em G1.com</a>`
    document.querySelector(".card-2").innerHTML = `
    <a href="https://www.google.com/search?q=${encodeURIComponent("Noticias do tempo em Recife")}">Saiba mais no google.com</a>`

    mostrarPrevisao(objRecife);
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
        document.querySelector('#tdc').innerHTML = `
        <i class="bi bi-star"></i>
        <h1>Previsão do tempo Hoje {${date}} ${objApi.location.name} </h1>
        <i class="bi bi-geo-alt-fill"></i>`

        document.querySelector(".card").innerHTML = `
        <a href="https://www.climatempo.com.br/busca?q=${encodeURIComponent(city)}">Saiba mais em ClimaTempo.com</a>`
        document.querySelector(".card-1").innerHTML = `
        <a href="https://g1.globo.com/busca?q=${encodeURIComponent('Previsão do tempo em ' + city)}">Saiba mais em G1.com</a>`
        document.querySelector(".card-2").innerHTML = `
        <a href="https://www.google.com/search?q=${encodeURIComponent('Noticias do tempo em ' + city)}">Saiba mais no google.com</a>`


        mostrarPrevisao(objApi);
    }
    catch (error) {
        console.error("Erro ao buscar dados:", error);
        alert("Cidade não encontrada ou erro na API.");
    }
}

function mostrarPrevisao(objApi) {
    const diasSemana = document.getElementById("dias-semana");
    diasSemana.innerHTML = "";

    const hoje = new Date().toISOString().split('T')[0];
    const dias = objApi.forecast.forecastday.filter(day => day.date >= hoje);

    dias.forEach(day => {
        const data = new Date(day.date);

        const opcoes = { weekday: 'long'};
        let dataFormatada = data.toLocaleDateString('pt-BR', opcoes);

        dataFormatada = dataFormatada
            .replace('-feira', '')
            .replace('feira', '')
            .replace(/^\p{L}/u, c => c.toUpperCase());

        const card = document.createElement("div");
        card.classList.add("forecast-card");

        card.innerHTML = `
            <p class="forecast-date">${dataFormatada}</p>
            <img src="${day.day.condition.icon}" alt="${day.day.condition.text}">
            <p class="forecast-temp">${day.day.maxtemp_c}°C</p>
        `;

        diasSemana.appendChild(card);
    });
}
