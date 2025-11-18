// Chave da API do WeatherAPI
const apiKey = "91ca1d9af6924a7598504746252210";

// Variável global para armazenar os dados do tempo
let weatherData = null;

// Função para buscar dados da API
async function buscaApi() {
    const cityInput = document.getElementById('city_name').value.trim() || 'Recife';

    try {
        const resp = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityInput}&days=7&lang=pt`);
        const obj = await resp.json();

        if (obj.error) {
            alert('Cidade não encontrada. Verifique o nome e tente novamente.')
            return;
        }

        // Salvar dados globalmente
        weatherData = obj;

        document.querySelector('.txt-noticia-g1').innerHTML = `
        <p>Saiba mais em <a href="https://g1.globo.com/busca?q=previsão%20do%20tempo%20${cityInput}" target="_blank">www.G1.com</a></p>`;
        document.querySelector('.txt-noticia-google').innerHTML = `
        <p>Saiba mais em <a href="https://www.google.com/search?q=previsão%20do%20tempo%20${cityInput}" target="_blank">www.Google.com</a></p>`;
        document.querySelector('.txt-noticia-youtube').innerHTML = `
        <p>Saiba mais em <a href="https://www.youtube.com/results?search_query=previsão%20do%20tempo%20${cityInput}" target="_blank">www.youtube.com</a></p>`;
        
        updateWeatherInfo(obj);
        showTemperature();
        updateDayCards(obj);
        updateIndicesCards(obj);
    }
    catch (error) {
        console.error('Erro ao buscar dados:' , error);
        alert('Erro ao buscar dados da cidade. Tente novamente');
    }
}

// Funções para atualizar a interface com os dados da API
function updateWeatherInfo(obj) {
    const current = obj.current;
    const location = obj.location;
    const forecast = obj.forecast.forecastday[0];
    
    // Atualizar título principal
    document.querySelector('.local-txt h1').textContent = `Previsão do tempo Hoje ${formatDate(location.localtime)} ${location.name} (${location.region})`;
    
    // Descrição do tempo
    document.querySelector('.temp-txt h1').textContent = `Hoje será parecido com ontem`;
    document.querySelector('.temp-txt p').textContent = current.condition.text;
    
    // Atualizar índices principais
    const tempIndices = document.querySelector('.temp-indices');
    tempIndices.innerHTML = `
        <div class="chuva">
            <h3>Chuva</h3>
            <div class="value">${forecast.day.daily_chance_of_rain}%</div>
        </div>
        <div class="vento">
            <h3>Vento</h3>
            <div class="value">${current.wind_kph} km/h</div>
        </div>
        <div class="umidade">
            <h3>Umidade</h3>
            <div class="value">${current.humidity}%</div>
        </div>
        <div class="sol">
            <h3>Sol</h3>
            <div class="value">${forecast.astro.sunrise} - ${forecast.astro.sunset}</div>
        </div>
    `;
}

// Função para mostrar temperatura
function showTemperature() {
    if (!weatherData) return;
    
    const hourlyData = weatherData.forecast.forecastday[0].hour;
    const grafico = document.querySelector('.grafico');
    
    let hourlyHTML = `
        <div class="hourly-forecast" style="display: flex; justify-content: space-between; align-items: end; height: 200px; padding: 20px 0; gap: 10px;">
    `;
    
    hourlyData.filter((_, index) => index % 3 === 0).forEach(hour => {
        const hourTime = new Date(hour.time).getHours();
        const temp = Math.round(hour.temp_c);
        const height = Math.max(((temp - 20) / 15) * 100, 30);
        const iconUrl = hour.condition.icon.startsWith('//') ? 'https:' + hour.condition.icon : hour.condition.icon;
        const condition = hour.condition.text;
        
        hourlyHTML += `
            <div class="hour-item" style="display: flex; flex-direction: column; align-items: center; justify-content: end; height: 100%; flex: 1;">
                <div style="margin-bottom: 10px; text-align: center;">
                    <img src="${iconUrl}" alt="${condition}" style="width: 32px; height: 32px;">
                </div>
                <div style="background: #ff6b6b; width: 100%; max-width: 40px; height: ${height}px; border-radius: 5px; margin-bottom: 10px;"></div>
                <span style="font-size: 12px; margin-bottom: 5px;">${hourTime}h</span>
                <span style="font-weight: bold; font-size: 14px;">${temp}°</span>
            </div>
        `;
    });
    
    hourlyHTML += `</div>`;
    grafico.innerHTML = hourlyHTML;
}

// Função para mostrar chuva
function showRain() {
    if (!weatherData) return;
    
    const hourlyData = weatherData.forecast.forecastday[0].hour;
    const grafico = document.querySelector('.grafico');
    
    let hourlyHTML = `
        <div class="hourly-forecast" style="display: flex; justify-content: space-between; align-items: end; height: 200px; padding: 20px 0; gap: 10px;">
    `;
    
    hourlyData.filter((_, index) => index % 3 === 0).forEach(hour => {
        const hourTime = new Date(hour.time).getHours();
        const rain = hour.chance_of_rain;
        const height = Math.max((rain / 100) * 150, 30);
        const iconUrl = hour.condition.icon.startsWith('//') ? 'https:' + hour.condition.icon : hour.condition.icon;
        const condition = hour.condition.text;
        
        hourlyHTML += `
            <div class="hour-item" style="display: flex; flex-direction: column; align-items: center; justify-content: end; height: 100%; flex: 1;">
                <div style="margin-bottom: 10px; text-align: center;">
                    <img src="${iconUrl}" alt="${condition}" style="width: 32px; height: 32px;">
                </div>
                <div style="background: #4dabf7; width: 100%; max-width: 40px; height: ${height}px; border-radius: 5px; margin-bottom: 10px;"></div>
                <span style="font-size: 12px; margin-bottom: 5px;">${hourTime}h</span>
                <span style="font-weight: bold; font-size: 14px;">${rain}%</span>
            </div>
        `;
    });
    
    hourlyHTML += `</div>`;
    grafico.innerHTML = hourlyHTML;
}

// Função para mostrar vento
function showWind() {
    if (!weatherData) return;
    
    const hourlyData = weatherData.forecast.forecastday[0].hour;
    const grafico = document.querySelector('.grafico');
    
    let hourlyHTML = `
        <div class="hourly-forecast" style="display: flex; justify-content: space-between; align-items: end; height: 200px; padding: 20px 0; gap: 10px;">
    `;
    
    hourlyData.filter((_, index) => index % 3 === 0).forEach(hour => {
        const hourTime = new Date(hour.time).getHours();
        const wind = Math.round(hour.wind_kph);
        const height = Math.max((wind / 50) * 150, 30);
        const iconUrl = hour.condition.icon.startsWith('//') ? 'https:' + hour.condition.icon : hour.condition.icon;
        const condition = hour.condition.text;
        
        hourlyHTML += `
            <div class="hour-item" style="display: flex; flex-direction: column; align-items: center; justify-content: end; height: 100%; flex: 1;">
                <div style="margin-bottom: 10px; text-align: center;">
                    <img src="${iconUrl}" alt="${condition}" style="width: 32px; height: 32px;">
                </div>
                <div style="background: #51cf66; width: 100%; max-width: 40px; height: ${height}px; border-radius: 5px; margin-bottom: 10px;"></div>
                <span style="font-size: 12px; margin-bottom: 5px;">${hourTime}h</span>
                <span style="font-weight: bold; font-size: 14px;">${wind} km/h</span>
            </div>
        `;
    });
    
    hourlyHTML += `</div>`;
    grafico.innerHTML = hourlyHTML;
}

// Função para mostrar umidade
function showHumidity() {
    if (!weatherData) return;
    
    const hourlyData = weatherData.forecast.forecastday[0].hour;
    const grafico = document.querySelector('.grafico');
    
    let hourlyHTML = `
        <div class="hourly-forecast" style="display: flex; justify-content: space-between; align-items: end; height: 200px; padding: 20px 0; gap: 10px;">
    `;
    
    hourlyData.filter((_, index) => index % 3 === 0).forEach(hour => {
        const hourTime = new Date(hour.time).getHours();
        const humidity = hour.humidity;
        const height = Math.max((humidity / 100) * 150, 30);
        const iconUrl = hour.condition.icon.startsWith('//') ? 'https:' + hour.condition.icon : hour.condition.icon;
        const condition = hour.condition.text;
        
        hourlyHTML += `
            <div class="hour-item" style="display: flex; flex-direction: column; align-items: center; justify-content: end; height: 100%; flex: 1;">
                <div style="margin-bottom: 10px; text-align: center;">
                    <img src="${iconUrl}" alt="${condition}" style="width: 32px; height: 32px;">
                </div>
                <div style="background: #339af0; width: 100%; max-width: 40px; height: ${height}px; border-radius: 5px; margin-bottom: 10px;"></div>
                <span style="font-size: 12px; margin-bottom: 5px;">${hourTime}h</span>
                <span style="font-weight: bold; font-size: 14px;">${humidity}%</span>
            </div>
        `;
    });
    
    hourlyHTML += `</div>`;
    grafico.innerHTML = hourlyHTML;
}

// Função para atualizar os cards de diferentes períodos do dia
function updateDayCards(obj) {
    const forecast = obj.forecast.forecastday[0];
    const current = obj.current;
    const cardDays = document.querySelector('.card-days');

    // Usar o ícone e condição atual
    const iconUrl = current.condition.icon.startsWith('//') ? 'https:' + current.condition.icon : current.condition.icon;
    const condition = current.condition.text;

    // Temperaturas para diferentes períodos do dia
    const dayPeriods = [
        { period: 'Madrugada', temp: `${Math.round(forecast.hour[2].temp_c)}°`, hour: forecast.hour[2] },
        { period: 'Manhã', temp: `${Math.round(forecast.hour[8].temp_c)}°`, hour: forecast.hour[8] },
        { period: 'Tarde', temp: `${Math.round(forecast.hour[14].temp_c)}°`, hour: forecast.hour[14] },
        { period: 'Noite', temp: `${Math.round(forecast.hour[20].temp_c)}°`, hour: forecast.hour[20] }
    ];
    
    cardDays.innerHTML = dayPeriods.map(period => {
        const periodIconUrl = period.hour.condition.icon.startsWith('//') ? 'https:' + period.hour.condition.icon : period.hour.condition.icon;
        const periodCondition = period.hour.condition.text;
        
        return `
            <div class="${period.period.toLowerCase()}">
                <img src="${periodIconUrl}" alt="${periodCondition}">
                <h4>${period.period}</h4>
                <div class="temp">${period.temp}</div>
            </div>
        `;
    }).join('');
}

// Função para atualizar os cards dos índices especiais
function updateIndicesCards(obj) {
    const current = obj.current;
    const forecast = obj.forecast.forecastday[0];
    
    const cardsContainer = document.querySelector('.cards');
    const cardsData = [
        {
            title: 'Churrasco',
            icon: 'bi-fire',
            status: getChurrascoStatus(forecast.day.daily_chance_of_rain, current.temp_c),
            description: getChurrascoDescription(forecast.day.daily_chance_of_rain, current.temp_c)
        },
        {
            title: 'Mosquitos',
            icon: 'bi-bug',
            status: getMosquitoStatus(current.humidity),
            description: getMosquitoDescription(current.humidity)
        },
        {
            title: 'Frizz',
            icon: 'bi-droplet',
            status: getFrizzStatus(current.humidity),
            description: getFrizzDescription(current.humidity)
        },
        {
            title: 'Ressecamento da Pele',
            icon: 'bi-person',
            status: getPeleStatus(current.humidity),
            description: getPeleDescription(current.humidity)
        },
        {
            title: 'Gripe e Resfriado',
            icon: 'bi-thermometer',
            status: getGripeStatus(current.temp_c),
            description: getGripeDescription(current.temp_c)
        },
        {
            title: 'Índice UV',
            icon: 'bi-sun',
            status: getUVStatus(current.uv),
            description: getUVDescription(current.uv)
        },
        {
            title: 'Arco-íris',
            icon: 'bi-rainbow',
            status: getArcoirisStatus(forecast.day.daily_chance_of_rain),
            description: getArcoirisDescription(forecast.day.daily_chance_of_rain)
        }
    ];
    
    cardsContainer.innerHTML = cardsData.map(card => `
        <div class="card">
            <div class="txt-card">
                <h2>${card.title}</h2>
            </div>
            <div class="infor-card">
                <div class="img-card">
                    <i class="bi ${card.icon}"></i>
                </div>
                <div class="txt-infos">
                    <h1>${card.status}</h1>
                    <p>${card.description}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// Funções auxiliares para determinar os status dos índices
function getChurrascoStatus(chuva, temp) {
    if (chuva < 30 && temp > 20) return 'Tá valendo';
    if (chuva < 50 && temp > 18) return 'Dá pra fazer';
    return 'Melhor adiar';
}

function getChurrascoDescription(chuva, temp) {
    if (chuva < 30 && temp > 20) return 'Condições ideais para churrasco. Aproveite!';
    if (chuva < 50 && temp > 18) return 'Condições razoáveis. Fique de olho no tempo.';
    return 'Chuva e temperatura baixa. Melhor remarcar.';
}

function getMosquitoStatus(humidity) {
    if (humidity > 80) return 'Alto';
    if (humidity > 60) return 'Médio';
    return 'Baixo';
}

function getMosquitoDescription(humidity) {
    if (humidity > 80) return 'Condições ideais para mosquitos. Use repelente.';
    if (humidity > 60) return 'Condições moderadas. Tome cuidados.';
    return 'Poucos mosquitos. Condições desfavoráveis para eles.';
}

function getFrizzStatus(humidity) {
    if (humidity > 75) return 'Alto';
    if (humidity > 55) return 'Moderado';
    return 'Baixo';
}

function getFrizzDescription(humidity) {
    if (humidity > 75) return 'Umidade alta. Frizz intenso esperado.';
    if (humidity > 55) return 'Umidade moderada. Frizz pode aparecer.';
    return 'Umidade baixa. Pouco frizz.';
}

function getPeleStatus(humidity) {
    if (humidity < 40) return 'Alto';
    if (humidity < 60) return 'Moderado';
    return 'Baixo';
}

function getPeleDescription(humidity) {
    if (humidity < 40) return 'Ar seco. Hidrate a pele frequentemente.';
    if (humidity < 60) return 'Umidade adequada. Pele confortável.';
    return 'Umidade alta. Pele bem hidratada.';
}

function getGripeStatus(temp) {
    if (temp < 18) return 'Alto';
    if (temp < 22) return 'Moderado';
    return 'Baixo';
}

function getGripeDescription(temp) {
    if (temp < 18) return 'Temperatura baixa. Maior risco de gripes.';
    if (temp < 22) return 'Temperatura amena. Cuidados moderados.';
    return 'Temperatura agradável. Baixo risco.';
}

function getUVStatus(uv) {
    if (uv >= 11) return 'Extremo';
    if (uv >= 8) return 'Muito Alto';
    if (uv >= 6) return 'Alto';
    if (uv >= 3) return 'Moderado';
    return 'Baixo';
}

function getUVDescription(uv) {
    if (uv >= 11) return 'Radiação extrema. Evite sol entre 10h-16h.';
    if (uv >= 8) return 'Radiação muito alta. Use protetor solar.';
    if (uv >= 6) return 'Radiação alta. Proteção necessária.';
    if (uv >= 3) return 'Radiação moderada. Proteção recomendada.';
    return 'Radiação baixa. Proteção mínima necessária.';
}

function getArcoirisStatus(chuva) {
    if (chuva > 60) return 'Alta';
    if (chuva > 30) return 'Média';
    return 'Baixa';
}

function getArcoirisDescription(chuva) {
    if (chuva > 60) return 'Alta probabilidade de formação de arco-íris!';
    if (chuva > 30) return 'Possibilidade moderada de arco-íris.';
    return 'Pouca chance de arco-íris hoje.';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
}

// Inicializar a página
document.addEventListener('DOMContentLoaded', function() {
    // Buscar dados para Recife por padrão
    buscaApi();
    
    // Adicionar evento de tecla Enter na busca
    document.getElementById('city_name').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            buscaApi();
        }
    });
});