# Green Space Accessibility in Chengdu: A Visualisation Report
## 1. Introduction 
The Chengdu Park City programme promotes sustainable development by integrating green spaces into urban life, ensuring accessibility within 15 minutes by foot, bike or public transport. The project visualises the accessibility of green spaces, identifies disparities and helps urban planners improve infrastructure and connectivity to achieve more equitable accessibility.
## 2. Visualisation Design & Technical Approach
### 2.1 Interactive Map Design
The website features an interactive map built with Mapbox GL JS and D3.js, incorporating multiple views:
1. Per capita green space distribution: Displays green space availability across Chengdu districts.
2. Walking and cycling accessibility: Evaluates the extent to which green spaces can be accessed within 5, 10, and 15 minutes.
3. Public transport accessibility: Examines how well parks are connected to bus stops and metro stations within a 15-minute travel time.
Users can navigate between these visualisations, hover over districts for details, and toggle accessibility layers.
### 2.2 Data Processing & Technical Implementation
1. Accessibility analysis: Isochrones (travel-time catchment areas) were computed using Python (NetworkX + OSMnx) to assess accessibility via walking, cycling, and public transport. The computed isochrones were converted into polygons for visualisation.
2. Geospatial data processing: OSM data was processed and integrated with Mapbox Tilesets to generate interactive layers.
3. Geospatial data processing: OSM data was processed and integrated with Mapbox Tilesets to generate interactive layers.
4. Data hosting for stability: Processed GeoJSON files were uploaded to Mapbox, where they were converted into tile datasets to enable stable and efficient data rendering.
5. D3.js bar chart: Displays per capita green space distribution for comparative analysis.
6. Frontend technologies: The website is developed with HTML, CSS, and JavaScript, ensuring device responsiveness.
## 3. Data Source
The visualisation relies on data from:
1. Green space, road network, and transport data: Extracted from OpenStreetMap (OSM) via OSMnx and Overpass API.
2. Isochrone calculations: Generated using Python (NetworkX + OSMnx) to determine accessibility zones for walking, cycling, and public transport.
3. Administrative boundaries: Sourced from OSM and processed in Mapbox.
4. Population data: Collected from Chengdu Municipal Statistics Bureau and hongheiku.com.
5. Icons: Sourced from Font Awesome.
6. Homepage background image: Photographed by the author at Luhu Park, Chengdu.
## 4. Conclusion
This visualisation contributes to an empirical study of park city planning in Chengdu. The findings show that central Chengdu has high green space accessibility, while suburban areas face disparities due to scarce parks and low transport connectivity, highlighting the need for improved green corridors and last mile transport solutions.
