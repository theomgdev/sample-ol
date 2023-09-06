let map, draw, source, layer;

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

    // txt-json dosyasından verileri çekme
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

            // modal-popup açma
            openModal(event.feature.getGeometry().getCoordinates());
        });
}

addDrawing = () => {
    // çizim işlemini başlat
    draw.setActive(true);
}

openModal = (coordinates) => {
    // modal-popup açma
    jsPanel.create({
        headerTitle: 'Çizim Bilgileri',
        contentSize: '300 200',
        position: 'center-top 0 58',
        content: `
            <form id="drawing-form">
                <label for="name">İsim:</label>
                <input type="text" id="name" name="name" required><br>
                <label for="number">Numara:</label>
                <input type="number" id="number" name="number" required><br>
                <input type="submit" value="Kaydet">
            </form>
        `,
        callback: function(panel) {
            // formu seçme
            let form = panel.content.querySelector('#drawing-form');
            // form gönderildiğinde
            form.addEventListener('submit', function(event) {
                // sayfa yenilenmesini engelleme
                event.preventDefault();
                // formdaki değerleri alma
                let name = form.elements.name.value;
                let number = form.elements.number.value;
                // api üzerinden txt ya da json dosyasına yazma
                saveDrawing(name, number, coordinates);
                // modal-popup kapatma
                panel.close();
            });
        }
    });
}

//ÖNEMLİ: Backend için Asp.Net Web Api yazmadan önce testleri jsonbin üzerinde geçici bir api ile yapma kararı aldım.

saveDrawing = (name, number, coordinates) => {
    // api url
    let url = 'https://api.jsonbin.io/b';
    // api key
    let key = '$2b$10$...'; // buraya kendi api key'inizi yazın
    // api headers
    let headers = {
        'Content-Type': 'application/json',
        'secret-key': key,
        'collection-id': '...' // buraya kendi collection id'nizi yazın
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

showDrawings = () => {
    // api url
    let url = 'https://api.jsonbin.io/b/...'; // buraya kendi bin id'nizi yazın
    // api key
    let key = '$2b$10$...'; // buraya kendi api key'inizi yazın
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
        // modal-popup açma
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
                // tablo gövdesini seçme
                let tbody = panel.content.querySelector('#drawing-body');
                // tabloya verileri ekleme
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
                // datatable oluşturma
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
    let url = 'https://api.jsonbin.io/b/...'; // buraya kendi bin id'nizi yazın
    // api key
    let key = '$2b$10$...'; // buraya kendi api key'inizi yazın
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
        // haritaya çizimleri ekleme
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