mapboxgl.accessToken = 'pk.eyJ1IjoiaXh4aWlyaXMiLCJhIjoiY202aTB2bTI1MDNpNTJqc2h0NW0xeTdlZSJ9.Oh-wamriLR992Hi8Vqm8tg';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: [104.0668, 30.5728],
    zoom: 10
});

// 添加比例尺
map.addControl(new mapboxgl.ScaleControl({
    maxWidth: 200, // 最大宽度
    unit: 'metric' 
}), 'bottom-right');

// 添加指北针和缩放控件
map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

let districtData = [];  // 存储行政区数据

map.on('load', () => {
    console.log("地图加载完成，开始添加数据源...");

// **加载成都市边界数据**
map.addSource('chengdu-boundary', {
    type: 'vector',
    url: 'mapbox://ixxiiris.0lyv9aea'
});

// **添加边界线图层**
map.addLayer({
    id: 'chengdu-boundary-line',
    type: 'line',
    source: 'chengdu-boundary',
    'source-layer': '0chengdu_boundary-15w3nd',
    paint: { 'line-color': '#333d29', 
        'line-width': 1.5 }
}); 

// **加载行政区划数据**
map.addSource('districts', {
    type: 'vector',
    url: 'mapbox://ixxiiris.24ojx4kx'
});

map.addLayer({
    id: 'districts-fill-layer',
    type: 'fill',
    source: 'districts',
    'source-layer': '0chengdu_districts_green_area-2yq96u',
    paint: { 
            'fill-color': [
                'interpolate',
                ['linear'],
                ['coalesce', ['get', 'green_per_capita'], 0],  // 默认设为 0
                0,  '#BFCAB9',  // 最浅
                10, '#8DA78E',
                20, '#5E8074',
                30, '#41615E',
                40, '#374849'   // 最深
            ],
         'fill-opacity': 0.3, 
         'fill-outline-color': "#87A368", 
        }
});
map.addLayer({
    id: 'districts-boundary-layer',
    type: 'line',
    source: 'districts',
    'source-layer': '0chengdu_districts_green_area-2yq96u',
    paint: { 'line-color': '#87A368', 
        'line-width': 1.1 }
}); 

// **底图层（仅作为背景，不允许交互）**
map.addLayer({
    id: "districts-background",
    type: "fill",
    source: "districts",
    "source-layer": "0chengdu_districts_green_area-2yq96u",
    paint: { "fill-color": "#F1F6EC", "fill-opacity": 0.25 },
    layout: { visibility: "none" } // 默认隐藏
});
map.setLayoutProperty("districts-background", "visibility", "none");

// **鼠标悬停边界层**
map.addLayer({
    id: 'district-hover-layer',
    type: 'line',
    source: 'districts',
    'source-layer': '0chengdu_districts_green_area-2yq96u',
    paint: {
        'line-color': '#00C8FF',  // **青色，和地图颜色形成对比**
        'line-width': 3,
        'line-opacity': 1  // 确保边界清晰
    },
    filter: ['==', 'name', '']  // 初始不高亮任何区域
}, 'districts-fill-layer');

// // **鼠标悬停阴影层**
// map.addLayer({
//     id: 'district-hover-shadow',
//     type: 'fill',
//     source: 'districts',
//     'source-layer': '0chengdu_districts_green_area-2yq96u',
//     paint: {
//         'fill-color': '#00C8FF', 
//         'fill-opacity': 0.15
//     },
//     filter: ['==', 'name', '']
// }, 'districts-fill-layer');

    // **加载公园绿地数据**
    map.addSource('green-spaces', {
        type: 'vector',
        url: 'mapbox://ixxiiris.4mxw2eg3'
    });
    map.addLayer({
        id: 'green-spaces-layer',
        type: 'fill',
        source: 'green-spaces',
        'source-layer': '1chengdu_green_spaces_clean_w-6esy40',
        paint: { 'fill-color': '#4A6C50', 'fill-opacity': 0.6, 'fill-outline-color': "#333F29" }
    });
    map.addLayer({
        id: 'green-spaces-border',
        type: 'line',
        source: 'green-spaces',
        'source-layer': '1chengdu_green_spaces_clean_w-6esy40',
        paint: {
            'line-color': "#333F29",
            'line-width': 0.8
        }
    }, 'green-spaces-layer'); // 确保边界线在填充层之上


    // 公园-步行可达性数据
    map.addSource('walking-access', {
        type: 'vector',
        url: 'mapbox://ixxiiris.atn6snvf'
    });
    map.addLayer({
        id: 'walking-access-layer',
        type: 'fill',
        source: 'walking-access',
        'source-layer': 'simplified_isochrone_walk-0lvrnu',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'time_limit'],  
                5,  '#e34a33',
                10, '#fc8d59',
                15, '#fdcc8a', 
            ],
            'fill-opacity': 0.3
        }
    });

    // 公园-骑行可达性数据
    map.addSource('biking-access', {
        type: 'vector',
        url: 'mapbox://ixxiiris.brwe1pg9'
    });
    map.addLayer({
        id: 'biking-access-layer',
        type: 'fill',
        source: 'biking-access',
        'source-layer': 'simplified_isochrone_bike-6u40rc',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'time_limit'],  
                5,  '#084594',
                10, '#74a9cf',
                15, '#bdc9e1', 
            ],
            'fill-opacity': 0.3
        }        
    });

    // 公交-步行可达性数据
    map.addSource('walking-access-stations', {
        type: 'vector',
        url: 'mapbox://ixxiiris.d9z462jo'
    });
    map.addLayer({
        id: 'walking-access-stations-layer',
        type: 'fill',
        source: 'walking-access-stations',
        'source-layer': 'stations_walk_polygon-0mam7n',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'time_limit'],  
                5,  '#e34a33',
                10, '#fc8d59',
                15, '#fdcc8a', 
            ],
            'fill-opacity': 0.3
        }
    });

    // 公交-骑行可达性数据
    map.addSource('biking-access-stations', {
        type: 'vector',
        url: 'mapbox://ixxiiris.4cig29vd'
    });
    map.addLayer({
        id: 'biking-access-stations-layer',
        type: 'fill',
        source: 'biking-access-stations',
        'source-layer': 'stations_bike_polygon-d05vq7',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'time_limit'],  
                5,  '#084594',
                10, '#74a9cf',
                15, '#bdc9e1', 
            ],
            'fill-opacity': 0.3
        }        
    });

    // 默认隐藏可达性
    map.setLayoutProperty('biking-access-layer', 'visibility', 'none');
    map.setLayoutProperty('walking-access-layer', 'visibility', 'none');
    map.setLayoutProperty('biking-access-stations-layer', 'visibility', 'none');
    map.setLayoutProperty('walking-access-stations-layer', 'visibility', 'none');

    console.log("所有数据源加载完成");

    // **确保 `district-highlight` 在 `districts-layer` 之上**
    if (map.getLayer('district-highlight')) {
        map.moveLayer('district-highlight', 'districts-layer');
    }

    // 确保绿地图层已经被加载
    if (map.getLayer('green-spaces-layer')) {
        map.moveLayer('green-spaces-layer');
    }
    if (map.getLayer('green-spaces-border')) {
        map.moveLayer('green-spaces-border');
    }
        
     console.log("绿地图层已置顶");

    // 公交站点数据
     map.addSource('stations', {
        type: 'vector',
        url: 'mapbox://ixxiiris.aackafmz'
    });

    // **添加公交站点（Bus Stop）**
    map.addLayer({
    id: "bus-stations",
    type: "circle",
    source: "stations",
    "source-layer": "stations-ab26n4",
    minzoom: 2, 
    maxzoom: 24, 
    paint: {
        "circle-radius": [
            "interpolate", ["linear"], ["zoom"],
            2, 4,
            4, 7, 
            8, 10,
            10, 12
        ],
        "circle-radius": 6,
        "circle-color": "#d295bf", 
        "circle-stroke-width": 0.6, 
        "circle-stroke-color": "#FFFFFF" 
    },
    filter: ["==", "type", "Bus Stop"] // **只筛选公交站点**
    });
    // **添加地铁站点（Metro Station）**
    map.addLayer({
    id: "metro-stations",
    type: "circle",
    source: "stations",
    "source-layer": "stations-ab26n4",
    minzoom: 6, 
    maxzoom: 24,
    paint: {
        "circle-radius": [
            "interpolate", ["linear"], ["zoom"],
            6, 6, 
            12, 10, 
            18, 14,
            24, 18 
        ],
        "circle-radius": 8,
        "circle-color": "#7e52a0", 
        "circle-stroke-width": 0.6,
        "circle-stroke-color": "#FFFFFF"
    },
    filter: ["==", "type", "Metro Station"] // **只筛选地铁站**
    });

    // 默认隐藏可见性
    map.setLayoutProperty('bus-stations', 'visibility', 'none');
    map.setLayoutProperty('metro-stations', 'visibility', 'none');
});

// **鼠标悬停查看行政区划信息**
let hoverPopup = new mapboxgl.Popup({
    closeOnClick: false,
    closeButton: false
});

map.on('mousemove', 'districts-fill-layer', (e) => {
    if (!e.features || e.features.length === 0) return;

    const properties = e.features[0].properties;
    const districtNameCn = properties.name || "未知区域";
    const districtNameEn = properties.name_en || "N/A";

    map.getCanvas().style.cursor = 'pointer';
    
    hoverPopup.setLngLat(e.lngLat)
        .setHTML(`<b>${districtNameCn} (${districtNameEn})</b><br>Click to open / close the details`)
        .addTo(map);
});

map.on('mouseleave', 'districts-fill-layer', () => {
    map.getCanvas().style.cursor = '';
    hoverPopup.remove();
});

// **鼠标移动时高亮**
map.on('mousemove', 'districts-fill-layer', function (e) {
    if (!e.features || e.features.length === 0) return;

    const hoveredDistrict = e.features[0].properties.name;
    console.log("悬停行政区:", hoveredDistrict);

    // **更新边界和阴影**
    map.setFilter('district-hover-layer', ['==', 'name', hoveredDistrict]);
    // map.setFilter('district-hover-shadow', ['==', 'name', hoveredDistrict]);
});

// **鼠标移开时取消高亮**
map.on('mouseleave', 'districts-fill-layer', function () {
    map.setFilter('district-hover-layer', ['==', 'name', '']);
    // map.setFilter('district-hover-shadow', ['==', 'name', '']);
});

// **条形图
map.on('idle', function () {
    console.log("地图已完全加载，开始查询数据...");

    if (!map.getSource('districts')) {
        console.error("数据源 `districts` 还未加载！");
        return;
    }

    let features = map.querySourceFeatures('districts', {
        sourceLayer: '0chengdu_districts_green_area-2yq96u'
    });

    if (!features || features.length === 0) {
        console.warn("`querySourceFeatures()` 未能获取数据，尝试 `queryRenderedFeatures()`...");
        
        features = map.queryRenderedFeatures({ layers: ['districts-fill-layer'] });

        if (!features || features.length === 0) {
            console.error("无法获取任何数据，请放大或移动地图。");
            return;
        }
    }

    console.log("成功获取数据:", features);
    processDistrictData(features);
});

const allDistricts = new Map();  // 存储完整的行政区数据

function processDistrictData(features) {
    console.log("查询到的 features:", features);

    features.forEach(feature => {
        const name = feature.properties.name || "未知区域";
        const name_en = feature.properties.name_en || "N/A";
        const green_space = parseFloat(feature.properties.green_per_capita) || 0;

        // **如果已经存储该区，保留最大 `green_per_capita`**
        if (!allDistricts.has(name) || allDistricts.get(name).green_space < green_space) {
            allDistricts.set(name, { name, name_en, green_space });
        }
    });

    // **转换 Map 为数组**
    districtData = Array.from(allDistricts.values());

    console.log("`districtData` 处理完成:", districtData);

    updateBarChart();
}

// **更新条形图**
function updateBarChart() {
    console.log("更新条形图，districtData:", districtData);
    if (!districtData || districtData.length === 0) {
        console.error("`districtData` 为空，无法渲染条形图！");
        return;
    }

    const barChart = d3.select("#bar-chart");
    if (barChart.empty()) {
        console.error("`#bar-chart` 容器未找到，D3 无法渲染！");
        return;
    }

    districtData.sort((a, b) => b.green_space - a.green_space);

    barChart.selectAll("*").remove();
    const maxWidth = 300;

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(districtData, d => d.green_space)])
        .range([10, maxWidth]);

    barChart.selectAll(".bar-container")
        .data(districtData)
        .enter()
        .append("div")
        .attr("class", "bar-container")
        .html(d => `
            <div class="bar-label">
                ${d.name_en} (${d.name}) - ${d.green_space.toFixed(2)} m²
            </div>
            <div class="bar" style="width: ${xScale(d.green_space)}px;"></div>
        `);
}

// // **鼠标点击行政区描边并查看具体信息**
let selectedDistrict = null; // 记录当前选中的行政区
let districtPopup = new mapboxgl.Popup({ closeOnClick: false }); // 详细信息框

map.on('click', 'districts-fill-layer', function (e) {
    if (!e.features || e.features.length === 0) return;

    const properties = e.features[0].properties;
    console.log("选中的行政区:", properties);

    const districtId = properties.name;
    const districtNameCn = properties.name || "未知区域";
    const districtNameEn = properties.name_en || "N/A";
    const populationDensity = properties.pop_density ? properties.pop_density.toFixed(2) : "N/A"; 
    const greenPerCapita = properties.green_per_capita ? properties.green_per_capita.toFixed(2) : "N/A";

    const avgPopulationDensity = 963.21;
    const avgGreenPerCapita = 14.23;

    // **如果点击的是同一个行政区，隐藏弹窗**
    if (selectedDistrict === districtId) {
        districtPopup.remove();
        selectedDistrict = null;
    } else {
        // **更新弹窗内容并显示**
        districtPopup.setLngLat(e.lngLat)
            .setHTML(`
                <b>${districtNameCn} (${districtNameEn})</b><br>
                <b>Population Density:</b> ${populationDensity} /km² （Average of Chengdu: ${avgPopulationDensity}）<br>
                <b>Green space per capita:</b> ${greenPerCapita} m² （Average of Chengdu: ${avgGreenPerCapita}）
            `)
            .addTo(map);
        selectedDistrict = districtId;
    }
});

// **点击地图空白区域时，关闭信息框**
map.on('click', function (e) {
    const features = map.queryRenderedFeatures(e.point, { layers: ['districts-fill-layer'] });

    if (features.length === 0) {
        districtPopup.remove();
        selectedDistrict = null;
    }
});

// **点击右侧按钮时，关闭信息框**
document.querySelectorAll('.nav-item').forEach(button => {
    button.addEventListener('click', function () {
        districtPopup.remove();
        selectedDistrict = null;
    });
});


// **鼠标悬停查看公园绿地信息**
let parkPopup = new mapboxgl.Popup({ closeOnClick: false, closeButton: false });

map.on('mousemove', 'green-spaces-layer', (e) => {
    if (!e.features || e.features.length === 0) {
        parkPopup.remove();
        return;
    }

    const properties = e.features[0].properties;
    console.log("✅ 绿地属性:", properties);

    const parkName = properties.name || "未知公园";
    const parkNameEn = properties["name:en"] || "Unknown Park";
    const parkArea = properties.area_sqm ? properties.area_sqm.toFixed(2) : "N/A";

    map.getCanvas().style.cursor = 'pointer';
    parkPopup.setLngLat(e.lngLat)
        .setHTML(`<b>Green Space:<br>${parkNameEn} (${parkName})</br>Area: ${parkArea} m²`)
        .addTo(map);
});

map.on('mouseleave', 'green-spaces-layer', () => {
    map.getCanvas().style.cursor = '';
    parkPopup.remove();
});

// **切换页面清除弹出框**
map.on('load', function () {
    console.log("地图加载完成，清除所有弹出框");
    document.querySelectorAll('.mapboxgl-popup').forEach(popup => popup.remove());
});

// **跳转回主页**
document.querySelector('[data-section="back"]').addEventListener("click", function () {
    window.location.href = "1_main_page.html";  
});

document.addEventListener("DOMContentLoaded", function () {
    const navItems = document.querySelectorAll(".nav-item");
    const sections = document.querySelectorAll(".content-section");

    // **监听导航栏点击**
    navItems.forEach(item => {
        item.addEventListener("click", function () {
            navItems.forEach(nav => nav.classList.remove("active"));
            this.classList.add("active");

            // **隐藏所有 section，只显示当前的**
            const section = this.getAttribute("data-section");
            sections.forEach(sec => sec.classList.add("hidden"));
            document.getElementById(section).classList.remove("hidden");

            // **控制地图图层**
            if (section === "perCapita") {
                map.setLayoutProperty("districts-fill-layer", "visibility", "visible");
                map.setLayoutProperty("walking-access-layer", "visibility", "none");
                map.setLayoutProperty("biking-access-layer", "visibility", "none");
                map.setLayoutProperty("bus-stations", "visibility", "none");
                map.setLayoutProperty("metro-stations", "visibility", "none");
                map.setLayoutProperty("districts-background", "visibility", "none");
                map.setLayoutProperty("district-highlight", "visibility", "visible");
                map.setLayoutProperty('biking-access-stations-layer', 'visibility', 'none');
                map.setLayoutProperty('walking-access-stations-layer', 'visibility', 'none');
            } else if (section === "accessibility") {
                map.setLayoutProperty("districts-fill-layer", "visibility", "none");
                map.setLayoutProperty("walking-access-layer", "visibility", "visible");
                map.setLayoutProperty("biking-access-layer", "visibility", "none");
                map.setLayoutProperty("bus-stations", "visibility", "none");
                map.setLayoutProperty("metro-stations", "visibility", "none");
                map.setLayoutProperty("districts-background", "visibility", "visible");
                map.setLayoutProperty("district-highlight", "visibility", "none");
                map.setLayoutProperty('biking-access-stations-layer', 'visibility', 'none');
                map.setLayoutProperty('walking-access-stations-layer', 'visibility', 'none');
            } else if (section === "transport") {
                map.setLayoutProperty("districts-fill-layer", "visibility", "none");
                map.setLayoutProperty("walking-access-layer", "visibility", "none");
                map.setLayoutProperty("biking-access-layer", "visibility", "none");
                map.setLayoutProperty("bus-stations", "visibility", "none");
                map.setLayoutProperty("metro-stations", "visibility", "none");
                map.setLayoutProperty("districts-background", "visibility", "visible");
                map.setLayoutProperty("district-highlight", "visibility", "none");
                map.setLayoutProperty('biking-access-stations-layer', 'visibility', 'none');
                map.setLayoutProperty('walking-access-stations-layer', 'visibility', 'visible');
            }
        });
    });
    // **公园为中心可达性开关**
    // **步行可达性开关**
    document.getElementById("toggle-walking").addEventListener("click", function () {
        const visibility = map.getLayoutProperty("walking-access-layer", "visibility");
        map.setLayoutProperty("walking-access-layer", "visibility", visibility === "visible" ? "none" : "visible");
        map.setLayoutProperty("biking-access-layer", "visibility", visibility === "visible" ? "none" : "none");
    });

    // **骑行可达性开关**
    document.getElementById("toggle-biking").addEventListener("click", function () {
        const visibility = map.getLayoutProperty("biking-access-layer", "visibility");
        map.setLayoutProperty("biking-access-layer", "visibility", visibility === "visible" ? "none" : "visible");
        map.setLayoutProperty("walking-access-layer", "visibility", visibility === "visible" ? "none" : "none");
    });
    // **公交为中心可达性开关**
    // **步行可达性开关**
    document.getElementById("toggle-stations-walking").addEventListener("click", function () {
        const visibility = map.getLayoutProperty("walking-access-stations-layer", "visibility");
        map.setLayoutProperty("walking-access-stations-layer", "visibility", visibility === "visible" ? "none" : "visible");
        map.setLayoutProperty("biking-access-stations-layer", "visibility", visibility === "visible" ? "none" : "none");
    });

    // **骑行可达性开关**
    document.getElementById("toggle-stations-biking").addEventListener("click", function () {
        const visibility = map.getLayoutProperty("biking-access-stations-layer", "visibility");
        map.setLayoutProperty("biking-access-stations-layer", "visibility", visibility === "visible" ? "none" : "visible");
        map.setLayoutProperty("walking-access-stations-layer", "visibility", visibility === "visible" ? "none" : "none");
    });

    // **公交可达性开关**
    document.getElementById("toggle-bus").addEventListener("click", function () {
        const visibility = map.getLayoutProperty("bus-stations", "visibility");
        map.setLayoutProperty("bus-stations", "visibility", visibility === "visible" ? "none" : "visible");
    });

    // **骑行可达性开关**
    document.getElementById("toggle-metro").addEventListener("click", function () {
        const visibility = map.getLayoutProperty("metro-stations", "visibility");
        map.setLayoutProperty("metro-stations", "visibility", visibility === "visible" ? "none" : "visible");
    });
});

// **创建一个公交站点鼠标悬停的弹窗**
let stationPopup = new mapboxgl.Popup({
    closeOnClick: false,
    closeButton: false
});

// **鼠标悬停事件（公交站点 & 地铁站点）**
map.on("mousemove", ["bus-stations", "metro-stations"], (e) => {
    if (!e.features || e.features.length === 0) return;

    // **获取站点信息**
    const properties = e.features[0].properties;
    const stationType = properties.type || "Unknown Type";  // 站点类型（如 Bus Stop, Metro Station）
    const stationNameEn = properties.name_en || "Unknown Name";  // 英文名
    const stationNameCn = properties.name || "未知名称";  // 中文名

    console.log(`悬停站点: ${stationType} - <br>${stationNameEn}（${stationNameCn}）`);

    // **在鼠标位置显示站点信息**
    stationPopup.setLngLat(e.lngLat)
        .setHTML(`<b>${stationType} - <br>${stationNameEn}（${stationNameCn}）</b>`)
        .addTo(map);

    // **更改鼠标样式**
    map.getCanvas().style.cursor = 'pointer';
});

// **鼠标离开时，隐藏弹窗**
map.on("mouseleave", ["bus-stations", "metro-stations"], () => {
    map.getCanvas().style.cursor = '';  // 恢复鼠标样式
    stationPopup.remove();  // 关闭弹窗
});













