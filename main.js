let map, draw, source, layer, baseApiUrl;

baseApiUrl = '';

// Map'in oluşturulması
initializeMap = () => {
    // Vektör veri kaynağının oluşturulması
    source = new ol.source.Vector({ wrapX: false });

    // Vektör veri katmanının oluşturulması
    layer = new ol.layer.Vector({
        source: source,
    });

    // Map'in oluşturulması
    map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            }),
            layer
        ],
        view: new ol.View({
            center: [3875337.272593909, 4673762.797695817], // Türkiye'nin koordinatları
            zoom: 7 // Türkiye'yi gösterecek yakınlaştırma seviyesi
        })
    });

    // txt-json dosyasından verileri çek
    loadDrawings();
}

addInteraction = () => {
    // çizim işlemini başlat
    draw = new ol.interaction.Draw({
        source: source,
        type: "LineString"
    });

    // haritaya çizim işlemini ekle
    map.addInteraction(draw);

    // yeni bir çizim tamamlandığında...
    draw.on("drawend",
        (event) => {

            // çizginin koordinatlarını kullanıcıya göster
            console.log(event.feature.getGeometry().getCoordinates());

            // çizim işlemini sonlandır
            draw.setActive(false);

            // modal-popup aç
            openModal(event.feature.getGeometry().getCoordinates());
        });
}

addDrawing = () => {
    // çizim işlemini başlat
    draw.setActive(true);
}

openModal = (coordinates) => {
    // modal-popup aç
    jsPanel.create({
        headerTitle: 'Polyline Info',
        contentSize: '400 250', // boyutu arttır
        position: 'center-top 0 50', // konumu ayarla
        resizeit: {
            disable: true// boyutu değiştirilemez yap
        },
        content: `
            <form id="drawing-form">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required><br>
                <label for="number">Number:</label>
                <input type="number" id="number" name="number" required><br>
                <input type="submit" value="Save">
            </form>
        `,
        callback: function(panel) {
            // formu seç
            let form = panel.content.querySelector('#drawing-form');
            // form gönderildiğinde
            form.addEventListener('submit', function(event) {
                // sayfa yenilenmesini engelle
                event.preventDefault();
                // formdaki değerleri al
                let name = form.elements.name.value;
                let number = form.elements.number.value;
                // api üzerinden txt ya da json dosyasına yaz
                saveDrawing(name, number, coordinates);
                // modal-popup kapat
                panel.close();
            });
        }
    });
}

saveDrawing = (name, number, coordinates) => {
    // api url
    let url = baseApiUrl + 'add-drawing';
    // api key
    let key = '$2b$10$...';
    // api headers
    let headers = {
        'Content-Type': 'application/json',
        'secret-key': key,
        'collection-id': '...'
    };
    // api body
    let body = {
        name: name,
        number: number,
        coordinates: coordinates
    };
    // api request
    fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        alert('Çizim başarıyla kaydedildi.');
    })
    .catch(error => {
        console.error(error);
        alert('Çizim kaydedilirken bir hata oluştu.');
    });
}

listDrawings = () => {
    // api url
    let url = baseApiUrl + 'get-drawings';
    // api key
    let key = '$2b$10$...';
    // api headers
    let headers = {
        'secret-key': key
    };
    // api request
    fetch(url, {
        method: 'GET',
        headers: headers
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // modal-popup aç
        jsPanel.create({
            headerTitle: 'Çizim Listesi',
            contentSize: '500 300',
            position: 'center-top 0 58',
            content: `
                <table id="drawing-table" class="display">
                    <thead>
                        <tr>
                            <th>İsim</th>
                            <th>Numara</th>
                            <th>Koordinatlar</th>
                        </tr>
                    </thead>
                    <tbody id="drawing-body">
                    </tbody>
                </table>
            `,
            callback: function(panel) {
                // tablo gövdesini seç
                let tbody = panel.content.querySelector('#drawing-body');
                // tabloya verileri ekle
                for (let drawing of data) {
                    let tr = document.createElement('tr');
                    let td1 = document.createElement('td');
                    td1.textContent = drawing.name;
                    let td2 = document.createElement('td');
                    td2.textContent = drawing.number;
                    let td3 = document.createElement('td');
                    td3.textContent = JSON.stringify(drawing.coordinates);
                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    tr.appendChild(td3);
                    tbody.appendChild(tr);
                }
                // datatable oluştur
                $('#drawing-table').DataTable();
            }
        });
    })
    .catch(error => {
        console.error(error);
        alert('Çizim listesi alınırken bir hata oluştu.');
    });
}

loadDrawings = () => {
    // api url
    let url = baseApiUrl + 'get-drawings';
    // api key
    let key = '$2b$10$...';
    // api headers
    let headers = {
        'secret-key': key
    };
    // api request
    fetch(url, {
        method: 'GET',
        headers: headers
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // haritaya çizimleri ekle
        for (let drawing of data) {
            let feature = new ol.Feature({
                geometry: new ol.geom.LineString(drawing.coordinates)
            });
            source.addFeature(feature);
        }
    })
    .catch(error => {
        console.error(error);
        alert('Çizimler yüklenirken bir hata oluştu.');
    });
}