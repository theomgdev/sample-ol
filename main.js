let map, draw, source, layer, baseApiUrl;

baseApiUrl = 'https://sampleol.azurewebsites.net/drawings/'; // webapi'nin temel url'ini belirle

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

    // webapi'den verileri çek
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
            openModal(event.feature); // parametre olarak sadece koordinatlar değil, bütün feature'ı gönder
        });
}

addDrawing = () => {
    // çizim işlemini başlat
    draw.setActive(true);
}

openModal = (feature) => { // parametre olarak sadece koordinatlar değil, bütün feature'ı al
    // modal-popup aç
    jsPanel.create({
        headerTitle: 'Create Polyline',
        contentSize: '400 250', // boyutu arttır
        position: 'center-top 0 50', // konumu ayarla
        resizeit: {
            disable: true// boyutu değiştirilemez yap
        },
        // kapatma ve tam ekran butonlarını gizle
        headerControls: {
            close: 'remove',
            maximize: 'remove',
        },
        content: `
            <form id="drawing-form">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required><br>
                <label for="number">Number:</label>
                <input type="number" id="number" name="number" required><br>
                <div class="panel-footer">
                    <input type="submit" value="Save">
                    <input type="reset" value="Cancel">
                </div>
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
                // webapi üzerinden veritabanına yaz
                saveDrawing(name, number, feature.getGeometry().getCoordinates()); // feature'dan koordinatları al
                // modal-popup kapat
                panel.close();
            });
            
            // form sıfırlandığında
            form.addEventListener('reset', function(event) {
                // sayfa yenilenmesini engelle
                event.preventDefault();
                // çizimi haritadan sil
                source.removeFeature(feature);
                // modal-popup kapat
                panel.close();
            });
        }
    });
}

saveDrawing = (name, number, coordinates) => {
    // webapi url'i (çizim ekleme)
    let url = baseApiUrl + 'create';
    
    // webapi body'si (çizim nesnesi)
    let body = {
        Name: name,
        Number: number,
        Coordinates: coordinates.map(c => ({ X: c[0], Y: c[1] })) // koordinatları webapi'nin beklediği formata dönüştür (X ve Y değerleri olan nesneler)
    };
    
    // webapi request'i (POST metodu ile JSON verisi gönder)
    fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      .then(response => response.json())
      .then(data => {
          console.log(data);
          alert('Polyline successfully saved.');
      })
      .catch(error => {
          console.error(error);
          alert('An error occured while saving polyline.');
      });
}

listDrawings = () => {
    // webapi url'i (çizim listesi alma)
    let url = baseApiUrl + 'getall';
    
    // webapi request'i (GET metodu ile JSON verisi alma)
    fetch(url, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // modal-popup aç
        jsPanel.create({
            headerTitle: 'Polyline List',
            contentSize: '600 450',
            position: 'center-top 0 58',
            content: `
                <div class="drawing-list">
                    <table id="drawing-table" class="display">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Number</th>
                                <th>Coordinates</th>
                            </tr>
                        </thead>
                        <tbody id="drawing-body">
                        </tbody>
                    </table>
                </div>
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
                    td3.textContent = JSON.stringify(drawing.coordinates.map(c => [c.x, c.y])); // koordinatları webapi'den gelen formattan harita için uygun formata dönüştür (dizi içinde dizi)
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
        alert('An error occured while listing drawings.');
    });
}

loadDrawings = () => {
    // webapi url'i (çizim listesi alma)
    let url = baseApiUrl + 'getall';
    
    // webapi request'i (GET metodu ile JSON verisi alma)
    fetch(url, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // haritaya çizimleri ekle
        for (let drawing of data) {
            let feature = new ol.Feature({
                geometry: new ol.geom.LineString(drawing.coordinates.map(c => [c.x, c.y])) // koordinatları webapi'den gelen formattan harita için uygun formata dönüştür (dizi içinde dizi)
            });
            source.addFeature(feature);
        }
    })
    .catch(error => {
        console.error(error);
        alert('An error occured while loading drawings.');
    });
}